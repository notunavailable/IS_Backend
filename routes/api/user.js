const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

//modelse
const User = require('../../models/User.js');
const Skill = require('../../models/Skill.js')
const Attribute = require('../../models/Attribute.js')
const Difficulty = require('../../models/Difficulty.js')
const Queue = require('../../models/UnregisteredQueue.js')
const Category = require("../../models/Category.js");

//utils
const { getSkillName, createSkill, createAttribute } = require("../../utils/chatgpt.js")
const {calculateExp, calculateLevelExp, addXP} = require("../../utils/xp.js")

//controllers
const { completeSkill } = require('../../controllers/skillController.js')

//Register User
router.post('/register', async (req, res) => {
    const {
        username,
        email,
        password,
        firstName,
        lastName,
        birthday
    } = req.body;

    try {
        // Check if a user with the same username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (existingUser) {
            return res.status(400).send({ error: 'Username or email already in use' });
        }

        const difficulty = await Difficulty.findOne({ name: "rare" })
        const skills = [];
        const attributes = [];

        // Create a new user
        const user = new User({
            username,
            email,
            password, // You should hash the password before saving it
            firstName,
            lastName,
            difficulty,
            birthday,
            skills,
            attributes,
        });
        // Save new user to the database
        const savedUser = await user.save();
        return res.status(201).send(savedUser);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Server error occurred' });
    }
});



// Get User Status
router.get("/status/:id", async (req, res) => {
    const user = await User.findById(req.params.id).populate("skills.id").populate("difficulty");
    if (!user) {
        res.status(400).send({ message: "You sent an invalid id." });
    } else {
        const userSkills = user.skills;
        let skillData = [];
        if (userSkills.length > 0) {
            userSkills.map(skill => {
                skillData.push({
                    id: skill.id._id,
                    name: skill.id.name,
                    description: skill.id.description,
                    level: skill.level,
                    experience: skill.experience,
                    practicing: skill.practicing,
                });
            });
        }
        const userStatus = {
            firstName: user.firstName,
            lastName: user.lastName,
            level: user.level,
            experience: user.experience,
            skills: skillData,
            attributes: user.attributes.filter(attr => attr.currentLevel > 5),
            race: user.race,
            birthday: user.birthday,
            username: user.username
        };
        return res.status(200).send(userStatus);
    }
});

// Get User skills
router.get("/skills/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'skills.id',
            model: 'Skill',
            populate: {
              path: 'difficulty',
              model: 'Difficulty'
            }
          });
        if (!user) {
            res.status(400).send({ message: "You sent an invalid id." });
        } else {
            const userSkills = user.skills;
            if (userSkills.length > 0) {
                let skillData = [];
                userSkills.map(skill => {
                    skillData.push({
                        id: skill.id._id,
                        name: skill.id.name,
                        description: skill.id.description,
                        color: skill.id.difficulty.color,
                        level: skill.level,
                        experience: skill.experience,
                        practicing: skill.practicing,
                    });
                });
                return res.status(200).send(skillData);
            } else {
                return res.status(200).send({ message: "You have no skills yet." });
            }
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred while fetching skills." });
    }
});

// Calculate XP Gain
router.put("/practice/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        const skillId = req.body.skillId

        if(!skillId) {
            return res.status(404).send('No skill ID found.')
        }

        const skillIndex = user.skills.findIndex(skill => skill.id.toString() === skillId);

        if(skillIndex === -1){
            return res.status(404).send('Skill not found');
        }
        
        const currentTime = new Date();
        const practiceDescription = req.body.practiceDescription;

        if (user.skills[skillIndex].practicing) {
            user.skills[skillIndex].practicing = false;
            const xp = calculateExp({start: new Date(user.skills[skillIndex].lastPracticed), end: currentTime});
            await addXP({xp: xp, user: user, skillIndex: skillIndex});
 
            let practiceData = {
               start: user.skills[skillIndex].lastPracticed,
               end: currentTime,
               expGained: xp
            }
            
            if(practiceDescription){
                practiceData.practiceDescription = practiceDescription;
            }
            user.skills[skillIndex].practicingLogs.push(practiceData);

        } else {
            user.skills[skillIndex].practicing = true;
            user.skills[skillIndex].lastPracticed = currentTime;
        }

        user.markModified('skills');
        await user.save();
        res.status(200).send({ message: 'Practice state updated successfully', user: user });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error.' });
    }
});

// Add Attribute
router.post("/attributes/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    const attributeId = req.body.attributeId;

    if (!user && !attributeId) {
        res.status(400).send({ message: "Invalid user id or attribute id." });
    } else {
        // Avoid duplicates
        if (user.attributes.find((attribute) => attribute.attribute.toString() === attributeId)) {
            res.status(400).send({ message: "Attribute already added." });
        } else {
            // Add attribute to the user's list
            user.attributes.push({
                attribute: mongoose.Types.ObjectId(attributeId),
                addedAt: new Date(), // update addedAt to the current date
            });

            await user.save();
            res.status(200).send(user);
        }
    }
});


// Add Skill to User Skill List

router.post("/addSkill/:id", async (req, res) => {
    try {
        const skillDescription = req.body.description;
        const userId = req.params.id;

        if (!userId || !skillDescription) {
            return res.status(400).json({ error: "Invalid request parameters" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "No user found with this id" });
        }

        if (!skillDescription) {
            return res.status(400).json({ error: "Skill description is missing" });
        }

        const id = await completeSkill({ description: skillDescription, userId: userId });

        if (!id) {
            return res.status(500).json({ error: "Could not complete skill, no ID returned from completeSkill" });
        }

        const isSkillExist = user.skills.some((skill) => skill.id == id);

        if (isSkillExist) {
            return res.status(400).json({ error: "Skill already added to skill list." });
        }

        user.skills.push({ id: id, level: 0, experience: 0 });
        await user.save();
        return res.status(200).json({ message: "Skill added to user skill list." });

    } catch (error) {
        console.error(error);
        // Use res.status(500).json({error: error.message}) if you want to send error message to the client
        return res.status(500).json({ error: "An internal server error occured" });
    }
});


// Remove Skill
router.delete("/skills/:userId", async (req, res) => {
    const { userId } = req.params;
    const { skillId } = req.body;
    const user = await User.findById(userId);

    if (!user || !skillId) {
        res.status(400).send({ message: "Invalid user id or skill id." });
    } else {
        // Find the skill to be removed
        const skillToRemoveIndex = user.skills.findIndex(
            (skill) => skill.skill.toString() === skillId
        );

        if (skillToRemoveIndex >= 0) {
            // Update deregistration fields
            user.skills[skillToRemoveIndex].deregistered = true;
            user.skills[skillToRemoveIndex].deregistrationDate = new Date();

            // Actually remove the skill if needed, or keep it with the updated fields
            // user.skills.splice(skillToRemoveIndex, 1);

            await user.save();
            res.status(200).send(user);
        } else {
            res.status(400).send({ message: "Skill not found." });
        }
    }
});

module.exports = router;