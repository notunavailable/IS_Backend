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

export default router;