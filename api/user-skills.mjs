import express from 'express';
import Skill from '../models/Skill.mjs';
import User from '../models/User.mjs';

const router = express.Router();

router.post('/:userId/:skillId/track', async (req, res) => {
    try {
        const { skillId, userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: `No user with id ${userId} found.` })
        }
        for (let i = 0; i < user.skills.length; i++) {
            if (user.skills[i]._id.toString() == skillId) {
                const date = new Date();
                const length = user.skills[i].log.length - 1;
                if (user.skills[i].tracking) {
                    user.skills[i].log[length].end = date;
                    user.skills[i].tracking = false;
                } else {
                    user.skills[i].log.push({ start: date });
                    user.skills[i].tracking = true;
                }
                user.save();
                return res.status(200).send(user.skills[i].log[length]);
            }
        }
        return res.status(404).send({ message: `No skill with id ${skillId} in user's skill list.` })
    } catch(error){
        return res.status(500).send(error);
    }

})

router.post('/:userId/:skillId/add', async (req, res) => {
    try{
        const { userId, skillId } = req.params;
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(400).send({ message: `No skill with id ${skillId}` });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send({ message: `No user with id ${userId}` })
        }
    
        const addedSkill = {
            skillRef: skill._id,
            log: [],
            tracking: false,
            level: 0,
            experience: 0
        };
    
    
        if (user.skills.length == 0) {
            user.skills = [addedSkill]
        } else {
            user.skills = [...user.skills, addedSkill];
        }
    
        user.save();
        await user.populate('skills.skillRef')
        return res.status(200).send(user.skills)
    } catch (error) {
        return res.status(500).send(error);
    }

})

export default router;