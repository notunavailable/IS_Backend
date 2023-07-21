const Difficulty = require("../models/Difficulty.js");
const User = require("../models/User.js")
const Skill = require("../models/Skill.js")

const calculateLevelExp = async ({difficultyId, currentLevel}) => {
    const difficulty = await Difficulty.findOne({ difficulty: difficultyId });
    if (difficulty) {
        const xp = difficulty.level0 * (difficulty.multiplier ** currentLevel);
        return xp;
    } else {
        console.error("Invalid difficulty provided");
    }
}

const calculateExp = ({start, end}) => {
    let calculateTimeInMillis = end.getTime() - start.getTime();
    let calculateTimeInMinutes = Math.floor(calculateTimeInMillis / (1000 * 60)); 
    let xp = Math.floor(calculateTimeInMinutes / 3); 
    return xp;
}


async function populateDifficulties() {
    try {
        // Delete all existing difficulties
        await Difficulty.deleteMany({});

        // Array of difficulties to create
        const difficulties = [
            { name: 'basic', level0: 45, multiplier: 1.1, color: "#808080", levelXP: 55 },
            { name: 'common', level0: 45, multiplier: 1.2, color: "#A9A9A9", levelXP: 54},
            { name: 'uncommon', level0: 45, multiplier: 1.3, color: "#008000", levelXP: 58.5},
            { name: 'advanced', level0: 45, multiplier: 1.4, color: "#0000FF", levelXP: 63},
            { name: 'elite', level0: 45, multiplier: 1.5, color: "#FF8C00", levelXP: 68},
            { name: 'rare', level0: 45, multiplier: 1.6, color: "#800080", levelXP: 72},
            { name: 'epic', level0: 45, multiplier: 1.7, color: "#FF000", levelXP: 77},
            { name: 'legendary', level0: 45, multiplier: 1.8, color: "#FFD700", levelXP: 81},
            { name: 'mythical', level0: 45, multiplier: 1.9, color: "#FF00FF", levelXP: 86},
            { name: 'transcendent', level0: 45, multiplier: 2, color: "#F8F8FF", levelXP: 90},
            { name: 'divine', level0: 45, multiplier: 2.1, color: "#FFFFFF", levelXP: 95},
            { name: 'cosmic', level0: 45, multiplier: 2.2, color: "#4B0082", levelXP: 99},
            { name: 'Infinite', level0: 45, multiplier: 2.3, color: "#000000", levelXP: 104}
        ];

        for (const diff of difficulties) {
            let difficulty = new Difficulty(diff);
            await difficulty.save();
            console.log(`Difficulty '${diff.name}' created.`);
        }
    } catch (error) {
        console.error('Error filling difficulty levels:', error);
    }
}

const addXP = async ({user, xp}) => {
    const currentLevel = user.level;
    let levelXP = await calculateLevelExp({difficultyId: user.difficulty, currentLevel: currentLevel+1})
    user.experience += xp;
    console.log("xp: ", xp)
    while(user.experience >= levelXP){
        user.experience -= levelXP;
        user.level++;
        levelXP = await calculateLevelExp({difficultyId: user.difficulty, currentLevel: currentLevel+1})
    }
    console.log("experience: ", user.experience);
    console.log("level: ", user.level)
}

const addSkillXP = async ({xp, user, skillIndex}) => {
    const level = user.skills[skillIndex].level+1;
    let levelXP = await calculateLevelExp({difficultyId: user.skills[skillIndex].difficulty, currentLevel: level})
    user.skills[skillIndex].experience += xp;
    while(user.skills[skillIndex].experience >= levelXP){
        const skill = await Skill.findById(user.skills[skillIndex].id)
        user.skills[skillIndex].experience -= levelXP;
        user.skills[skillIndex].level++;
        const difficulty = await Difficulty.findById(skill.difficulty)
        await addXP({user: user, xp: difficulty.levelXP})
        levelXP = await calculateLevelExp({difficultyId: user.skills[skillIndex].difficulty, currentLevel: level})
    }
}
module.exports = { calculateLevelExp, populateDifficulties, calculateExp, addSkillXP };


