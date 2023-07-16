const { upsert, query } = require('../controllers//pineconeController')
const { push } = require('../controllers/unregisteredQueueController')
const { embedding, createSkill } = require('../utils/chatgpt.js')
const Attribute = require('../models/Attribute')

const pushTest = async () => {
    return await push({refModel: "Skill", addition: "64b300c38b446b34e2d23fc3"});
}

const upsertTest = async () => {
    let skill;
    for (let i = 0; i < 3; i++) {
        skill = await createSkill({ skillDescription: "Swimming." })
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
    const metadata = {
        category: skill.category,
        description: skill.description,
        name: skill.name
    }
    const response = await upsert({ pIndex: "skills", values: values, id: "1", metadata: metadata })
    return response
}

const queryTest = async () => {
    const attributesList = await Attribute.find();
    const attributeNames = attributesList.map(attribute => attribute.name)
    let skill;
    for (let i = 0; i < 3; i++) {
        skill = await createSkill({ skillDescription: "I want a skill for programming in javascript.", attributesList: attributeNames })
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
    console.log(values)
    const response = await query({ pIndex: "skills", values: values })
    console.log(response)
    return response
}



module.exports = { upsertTest, queryTest, pushTest }