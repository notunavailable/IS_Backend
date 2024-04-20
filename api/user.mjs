import express from 'express';
import User from '../models/User.mjs';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        if(user){
            return res.status(200).send({user});
        }
            return res.status(404).send({message: "User not found"});

    } catch (error) {
        console.log(e);
        return res.status(500).send({error})
    }
});

router.post('/register', async (req, res) => {
    try{
        const {username, email, password} = req.body;

        //make better error handling
        if(!username || !email || !password){
            return res.status(400).send({message: "Missing parameter"})
        }

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).send({message: `User with email ${userExists.email} already exists`});
        }

        const user = new User({username, email, password});
        await user.save();
        return res.status(201).send({user});
    } catch (error){
        return res.status(500).send({error});
    }
})

router.post('/:userId/:skillId/start', async (req, res) => {

})

router.post('/:userId/:skillId/end', async (req, res) => {

})

export default router;