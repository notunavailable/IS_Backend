const express = require('express');
const Skill = require('../../models/Skill.js')
const router = express.Router();
const { deleteSkill } = require('../../controllers/skillController.js')

//Skill registration
router.post("/register", async (req, res) => {
    const skill = await Skill.findOne({ name: req.body.name });

    if (skill) {
        return res.status(400).send({
            message: "The skill already exist"
        })
    }
    else {
        const newSkill = new Skill(req.body)
        newSkill.save().catch(err => console.log(err));
        return res.status(201).send(newSkill);
    }
});

// Get skill by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const skill = await Skill.findById(id)
            .populate('difficulty')
            .populate('attributes.id')
            .populate('createdBy');

        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        const attributes = skill.attributes.map(attr => ({ name: attr.id.name, affected: attr.affected }));
        const skillData = {
            _id: skill._id,
            name: skill.name,
            difficulty: {
                name: skill.difficulty.name,
                id: skill.difficulty._id,
                color: skill.difficulty.color
            },
            category: skill.category,
            attributes: attributes,
            createdBy: `${skill.createdBy.firstName} ${skill.createdBy.lastName}`,
            description: skill.description

        }
        res.status(200).json(skillData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while fetching the skill." });
    }
});

// Get all skills
router.get("/", async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching skills." });
    }
});

// Get all skills
router.get("/unregistered", async (req, res) => {
    try {
        const skills = await Skill.find({ approved: false });
        res.status(200).json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching unregistered skills." });
    }
});

//Edit skill by id
router.put("/edit/:id", async (req, res) => {

    const query = { id: req.params.id };

    Skill.findOneAndUpdate(query, { name: req.body.name, difficulty: req.body.difficulty }).then(skill => {
        if (!skill) {
            res.status(404).send({
                message: 'Skill not found. cannot update!'
            })
        } else {
            res.status(200).send(skill);
        }
    }).catch(err => res.status(400).json(err));
})

//Delete User by id
router.delete('/delete/:id', async (req, res) => {

    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: "No ID inputted." })
    }

    const response = deleteSkill({ id: id });
    if (!response.skill) {
        return res.status(200).send({ message: `Deleted skill ${response.skill}` })
    } else {
        return res.status(500).send(response.error)
    }

})

module.exports = router;