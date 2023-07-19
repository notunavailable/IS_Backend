const Skill = require('../models/Skill.js')
const Attribute = require('../models/Attribute.js')
const Difficulty = require('../models/Difficulty.js')
const User = require('../models/User.js')

const { push, pull } = require('./unregisteredQueueController.js')
const { upsert, query, remove } = require('./pineconeController.js')
const { createSkill, determineSkill, embedding } = require('../utils/chatgpt.js')

const deleteSkill = async ({id}) => {
    if (!id) {
        return;
    }
    try {
        const skillToRemove = await Skill.findById(id);
        // If no skill is found, throw an error
        if (!skillToRemove) {
            return;
        }
        // Remove the skill from the Pinecone database
        await remove({pIndex: 'skills', id: skillToRemove._id});
        // Pull the skill from the queue
        await pull({refModel: 'Skill', id: skillToRemove._id});
        // Delete the Skill from all users who have it in their skills list
        await User.updateMany(
          {},
          { $pull: { skills: { id: skillToRemove._id } } } 
        );

        // Delete the Skill
        await Skill.findByIdAndDelete(id);
        return { success: true, message: `Skill with id ${id} successfully deleted` };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


const getAffectedAttributes = async ({ skillData }) => {
    const attributes = skillData.attributes;
    const names = attributes.map((attribute) => attribute.name)
    const affectedAttributes = await Attribute.find({ name: { $in: names } })
    return affectedAttributes.map((attribute, i) => {
        return {
            id: attribute._id,
            affected: skillData.attributes[i].affected
        }
    })
}

const registerSkill = async ({ skillData }) => {
    if(!skillData){
        return;
    }
    if (
        skillData.name &&
        skillData.description &&
        skillData.difficulty &&
        skillData.category &&
        skillData.attributes[0].name &&
        skillData.attributes[0].affected &&
        skillData.createdBy &&
        skillData.attributeExplanation &&
        skillData.difficultyExplanation
    ) {
        const vector = await embedding({ data: skillData.description })
        const newSkill = {
            name: skillData.name,
            description: skillData.description,
            difficulty: await Difficulty.findOne({name: skillData.difficulty}),
            category: skillData.category,
            createdBy: skillData.createdBy,
            attributeExplanation: skillData.attributeExplanation,
            difficultyExplanation: skillData.difficultyExplanation,
            attributes: await getAffectedAttributes({skillData: skillData})
        }
        const skill = new Skill(newSkill);
        const savedSkill = await skill.save();
        const metadata = {
            category: savedSkill.category,
            description: savedSkill.description,
            name: savedSkill.name,
            difficulty: skillData.difficulty
        }
        if (!await upsert({ pIndex: "skills", values: vector, id: savedSkill._id, metadata: metadata })) {
            console.log("Error while upserting vector to vector index")
        }
        if (!await push({ refModel: "Skill", addition: `${savedSkill._id}` })) {
            console.log("Error pushing skill id to unregistered skill queue")
        }
        return savedSkill._id;
    } else {
        return;
    }
}

const completeSkill = async ({ description, userId }) => {
    const attributesList = await Attribute.find();
    const attributeNames = attributesList.map(attribute => attribute.name)
    let skill;
    for (let i = 0; i < 3; i++) {
        skill = await createSkill({ skillDescription: description, attributesList: attributeNames });
        if (skill) {
            break;
        } else if (i == 2) {
            console.error("Error creating skill. Please try again.")
            return;
        }
    }
    const values = await embedding({
        data: skill.description
    })
    skill.id = 1;
    skill.createdBy = userId;
    const qResponse = await query({ pIndex: "skills", values: values });
    console.log(qResponse)
    const matches = qResponse.matches.filter(match => match.score > 0.85)
    if (matches.length == 0) {
        return await registerSkill({skillData: skill})
    }
    const IDs = matches.map((match) => match.id)
    const matchedSkills = await Skill.find({ _id: { $in: IDs } })
    let finalSkill;
    for (let i = 0; i < 3; i++) {
        finalSkill = await determineSkill({ matchedSkills: matchedSkills, createdSkill: skill, skillDescription: description });
        if (finalSkill) {
            break;
        } else if (i == 2) {
            console.error("Error determining skill. Please try again.")
            return;
        }
    }
    if (finalSkill.id == 1) {
        return await registerSkill({skillData: skill})
    }
    return finalSkill.id;
}

module.exports = { completeSkill, deleteSkill }