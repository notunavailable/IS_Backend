const Difficulty = require("../models/Difficulty.js");
const User = require("../models/User.js")

const calculateLevelExp = async ({difficultyId, currentLevel}) => {
    const difficulty = await Difficulty.findOne({ difficulty: difficultyId });
    if (difficulty) {
        const xp = difficulty.level0 * (difficulty.multiplier ^ currentLevel)
        return xp;
    } else {
        throw new Error("Invalid difficulty provided.");
    }
}

const calculateExp = ({start, end}) => {
    let calculateTimeInMillis = end.getTime() - start.getTime();
    let calculateTimeInMinutes = Math.floor(calculateTimeInMillis / (1000 * 60)); 

    console.log(`Interval in Milliseconds: ${calculateTimeInMillis}`);
    console.log(`Time in Minutes: ${calculateTimeInMinutes}`);

    let xp = Math.floor(calculateTimeInMinutes / 5); 

    console.log(`Calculated XP: ${xp}`);
    return xp;
}


async function populateDifficulties() {
    try {
        // Delete all existing difficulties
        await Difficulty.deleteMany({});

        // Array of difficulties to create
        const difficulties = [
            { name: 'basic', level0: 45, multiplier: 1.1, color: "#808080" },
            { name: 'common', level0: 45, multiplier: 1.2, color: "#A9A9A9" },
            { name: 'uncommon', level0: 45, multiplier: 1.3, color: "#008000" },
            { name: 'advanced', level0: 45, multiplier: 1.4, color: "#0000FF" },
            { name: 'elite', level0: 45, multiplier: 1.5, color: "#FF8C00" },
            { name: 'rare', level0: 45, multiplier: 1.6, color: "#800080" },
            { name: 'epic', level0: 45, multiplier: 1.7, color: "#FF000" },
            { name: 'legendary', level0: 45, multiplier: 1.8, color: "#FFD700" },
            { name: 'mythical', level0: 45, multiplier: 1.9, color: "#FF00FF" },
            { name: 'transcendent', level0: 45, multiplier: 2, color: "#F8F8FF" },
            { name: 'divine', level0: 45, multiplier: 2.1, color: "#FFFFFF" },
            { name: 'cosmic', level0: 45, multiplier: 2.2, color: "#4B0082" },
            { name: 'Infinite', level0: 45, multiplier: 2.3, color: "#000000" }
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

const addXP = async ({xp, user, skillIndex}) => {
    const level = user.skills[skillIndex].level+1;
    const levelXP = await calculateLevelExp({difficulty: user.skills[skillIndex].difficulty, currentLevel: level})
    user.skills[skillIndex].experience += xp;
    if(user.skills[skillIndex].experience >= levelXP){
        user.skills[skillIndex].experience -= levelXP;
        user.skills[skillIndex].level++;
    }
}
module.exports = { calculateLevelExp, populateDifficulties, calculateExp, addXP };


