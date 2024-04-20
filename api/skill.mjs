import express from 'express';
import Skill from '../models/Skill.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
    if (await Skill.findOne({ name: req.body.name })) {
        return res.status(500).send({ message: "Skill already exists!" });
    }
    const newSkill = new Skill(req.body)
    newSkill.save().catch(err => console.log(err));
    return res.status(200).send(newSkill);
})

router.get('/', async (req, res) => {
    const skills = await Skill.find();
    return res.status(200).send(skills);
})

router.put('/track/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).send({ message: "Skill not found" });
        }
        const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, {
            tracking: !skill.tracking
        }, { new: true }); // `new: true` to return the updated document

        res.status(200).send(updatedSkill);
    } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
    }
});
export default router;