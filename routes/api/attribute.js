const express = require('express');
const Attribute = require('../../models/Attribute.js')
const Difficulty = require('../../models/Difficulty.js')
const router = express.Router();
var ObjectId = require('mongodb');
const { createAttributeList } = require('../../utils/chatgpt.js')

//Attribute registration
router.post("/register", async (req, res) => {
    const attribute = await Attribute.findOne({ name: req.body.name });
    if (attribute) {
        return res.status(400).send({
            message: "The attribute already exist"
        })
    }
    else {
        const newAttribute = new Attribute(req.body)
        newAttribute.save().catch(err => console.log(err));
        return res.status(201).send(newAttribute);
    }
});

router.post('/register/list', async (req, res) => {
    try {
        const allAttributes = await Attribute.find();
        const attributes = await createAttributeList({
            attributesDescription: req.body.attributesDescription,
            allAttributes: allAttributes
        });

        if (attributes) {

            const newAttributes = [];

            for (const attribute of attributes) {
                let foundAttribute = await Attribute.findOne({
                    name: attribute.name,
                });

                if (!foundAttribute) {
                    foundAttribute = await Attribute.create(attribute);
                }

                newAttributes.push(foundAttribute);
            }

            return res.status(201).send(newAttributes);
        } else {
            return res.status(400).send({ error: 'Failed to create attributes' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Server error occurred' });
    }
});

//Edit Attribute by id
router.put("/edit/:id", async (req, res) => {

    const query = { id: req.params.id };

    Attribute.findOneAndUpdate(query, { name: req.body.name, difficulty: req.body.difficulty }).then(attribute => {
        if (!attribute) {
            res.status(404).send({
                message: 'Attribute not found. cannot update!'
            })
        } else {
            res.status(200).send(attribute);
        }
    }).catch(err => res.status(400).json(err));
})

// Get all attributes
router.get("/get/all", async (req, res) => {
    try {
        const attributes = await Attribute.find();
        return res.status(200).send(attributes);
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "Internal server error"
        });
    }
});

//Delete User by id
router.delete('/delete', async (req, res) => {

    var query = { difficulty: req.body.difficulty };

    Attribute.findOne(query).then(attribute => {
        if (!attribute) {
            res.status(404).send({
                message: 'Attribute not found, cannot delete!'
            })
        } else {
            attribute.remove().then(() => res.status(200).send({
                message: `Deleted attribute ${attribute.name} with the difficulty: ${attribute.difficulty}`
            }))
        }
    }).catch(err => res.status(400).json(err));
})

module.exports = router;