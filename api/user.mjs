import express from 'express';
import User from '../models/User.mjs';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        if(user){
            await user.populate('skills.skillRef');
            return res.status(200).send({user});
        } else {
            return res.status(404).send({message: "User not found"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({error})
    }
});

router.post('/register', async (req, res) => {
    try{
        const {username, email, password, firstName, lastName, birthday} = req.body;

        //make better error handling
        if(!username || !email || !password || !firstName || !lastName || !birthday){
            return res.status(400).send({message: "Missing parameter"});
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).send({message: `User with email ${userExists.email} already exists`});
        }

        req.body.skills = [];

        const user = new User(req.body);
        await user.save();
        return res.status(201).send({user});
    } catch (error){
        return res.status(500).send({error});
    }
})

export default router;