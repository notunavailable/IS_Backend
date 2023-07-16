const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function listModels(req, res) {
    try {
        // Fetch the list of available models
        const response = await openai.listModels();

        // Iterate through the list of models and print their details
        response.data.data.forEach(model => {
            console.log(`ID: ${model.id}`);
            console.log(`Object: ${model.object}`);
            console.log(`Created: ${model.created}`);
            console.log(`Tokens: ${model.tokens}`);
            console.log(`Status: ${model.status}`);

            // If you need more information, extend this section with more properties.

            console.log('\n');
        });
    } catch (error) {
        console.error(`Error fetching the list of models: ${error.message}`);
    }
}

const content = `You are the system for a website that 
gamifies real-life personal progress, similar to a LitRPG 
system. Users practice skills and gain experience points (XP) 
based on the time spent practicing. Improving skills also improves 
related attributes. There are five difficulty levels for XP gain: common,
 uncommon, rare, epic, and legendary. The complexity of skills 
 increases as users start with common or uncommon skills and evolve 
 them into more specific and challenging skills. So, common and uncommon 
 skills are the most general and should be created that way: not too complex, nuanced, or intricate.

Users begin with a set of attributes and can add 
up to 5 common or uncommon skills to their list. 
As they progress, they can evolve and add more skills
 to their list at specific milestones. Each skill 
 affects related attributes, which gain XP in percentages 
 with each skill level-up. Users can add skills to 
 their status from the app's database, and attributes 
 appear in their status upon reaching certain levels.

As the system, your responsibility is to create and 
design skills, attributes, and other elements that 
accurately reflect real-life challenges, descriptions, 
and affected attributes. You are like the god of this 
game or the dungeon master in Dungeons & Dragons.`;

const createSkill = async ({ skillDescription, attributesList }) => {
    try {
        const specifics = `The user would like to add a skill to their skill list. However, 
        the description they provided: "${skillDescription}" does not semantically match
        any skill in our database. So you have to create a common or uncommon skill based on their description
        that will go under review for approval into the database so this user and others 
        can add this skill to their skill list. The available attributes are: ${attributesList}`;

        const completion = await openai.createChatCompletion({
            model: "gpt-4-0613",
            messages: [
                { role: "system", content: `${content}` },
                { role: "user", content: `${specifics}` }
            ],
            functions: [
                {
                    name: "createSkill",
                    description: "This function registers a new skill in the database.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                description: "An accurate title or name of the skill.",
                            },
                            description: {
                                type: "string",
                                description: "An in-depth description of the skill reflecting its real-life nature."
                            },
                            difficulty: {
                                type: "string",
                                enum: ["common", "uncommon"],
                                description: "The difficulty level for leveling up this skill."
                            },
                            category: {
                                type: "string",
                                description: "The category of the skill.",
                            },
                            attributes: {
                                type: "array",
                                description: "List of affected attributes with the percentage of XP gain.",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string",
                                            description: "Name of affected attribute.",
                                        },
                                        affected: {
                                            type: "number",
                                            description: "Percentage of XP gain for the attribute.",
                                        },
                                    },
                                },
                            },
                            attributeExplanation: {
                                type: "string",
                                description: "An explanation of the affected attributes and their percentage XP gains."
                            },
                            difficultyExplanation: {
                                type: "string",
                                description: "An explanation of the skill's difficulty level."
                            },
                        },
                        required: [
                            "name",
                            "description",
                            "difficulty",
                            "category",
                            "attributes",
                            "attributeExplanation",
                            "difficultyExplanation",
                        ],
                    },
                    function_call: { name: "createSkill" },
                },
            ],
        });

        if (completion.data.choices.length === 0) {
            throw new Error("No response received from AI");
        }

        if (
            completion.data.choices[0].message &&
            completion.data.choices[0].message.function_call &&
            completion.data.choices[0].message.function_call.arguments
        ) {
            const response = JSON.parse(
                completion.data.choices[0].message.function_call.arguments
            );
            return response;
        }
        console.log(completion.data.choices);
        console.error("Please retry. Function_call had no arguments.");
        return;
    } catch (err) {
        console.error("An error occurred while creating skill", err);
        return;
    }
};

const createAttributeList = async ({ attributesDescription, allAttributes }) => {
    const specifics = `Your job right now is to create a list of attributes. IMPORTANT: All
    descriptions of the attributes and difficulty should be one to two paragraphs long.${attributesDescription}.
    This is the current list of attributes: ${allAttributes}`;

    const completion = await openai.createChatCompletion({
        model: "gpt-4-0613",
        messages: [{ "role": "system", "content": `${content} ${specifics}` }],
        functions: [{
            "name": "createAttributes",
            "description": "This function registers a list of new attributes in the database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "attributes": {
                        "type": "array",
                        "description": "List of attributes.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "An accurate title or name of the attribute."
                                },
                                "type": {
                                    "type": "string",
                                    "description": "What type of attribute it is. Think category."
                                },
                                "description": {
                                    "type": "string",
                                    "description": "An accurate description of the attribute. This has to be one to two paragraphs."
                                },
                                "difficulty": {
                                    "type": "string",
                                    "description": "How difficult it is to level up the skill. Should be realistic and based on real life.",
                                    "enum": ["common", "uncommon", "rare", "epic", "legendary"]
                                },
                                "difficultyExplanation": {
                                    "type": "string",
                                    "description": "An in-depth explanation of why the difficulty is what it is. This has to be one to two paragraphs."
                                }
                            }
                        }
                    },
                },
                "required": ["attributes"],

            },
            function_call: { "name": "createAttributeList" },
        }]
    });
    const response = JSON.parse(completion.data.choices[0].message.function_call.arguments).attributes;

    return response;
};

const embedding = async ({ data }) => {
    const embedding = await openai.createEmbedding({
        input: data,
        model: "text-embedding-ada-002"
    });
    return embedding.data.data[0].embedding;
}

const determineSkill = async ({matchedSkills, createdSkill, skillDescription}) => {
    try {
        const specifics = `The user would like to add a skill to their skill list. The following 
        is the description of the skill the user wants to add the their skill list: "${skillDescription}". 
        A skill has been created based off of the user's description: ${createdSkill}. The created skill 
        has an id of 1 because it hasn't been registered in the database yet. 
        The skill description of the created skill semantically matches the following skills 
        from our vector database with a cosine similarity of greater than 0.85: ${matchedSkills}. 
        Add one of the skills to the users skill list.`;

        const completion = await openai.createChatCompletion({
            model: "gpt-4-0613",
            messages: [
                { role: "system", content: `${content}` },
                { role: "user", content: `${specifics}` }
            ],
            functions: [
                {
                    name: "addSkill",
                    description: "Adds a skill to the user's skill list",
                    parameters: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "The ID of the skill being added to the users skill list"
                            }
                        },
                        required: ["id"]
                    },
                    function_call: {name: "addSKill"}
                }
            ],
        });

        if (completion.data.choices.length === 0) {
            throw new Error("No response received from AI");
        }

        if (
            completion.data.choices[0].message &&
            completion.data.choices[0].message.function_call &&
            completion.data.choices[0].message.function_call.arguments
        ) {
            const response = JSON.parse(
                completion.data.choices[0].message.function_call.arguments
            );
            return response;
        }
        console.log(completion.data.choices);
        console.error("Please retry. Function_call had no arguments.");
        return;
    } catch (err) {
        console.error("An error occurred while deciding skill to add", err);
        return;
    }
}

module.exports = { createSkill, createAttributeList, embedding, determineSkill };