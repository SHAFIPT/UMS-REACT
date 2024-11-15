import User from '../models/User'
import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';

export const registerUser = async (req : Request , res : Response) : Promise<void> => {
    const {name ,email ,password} = req.body;

    try {
        
        const existingUser = await User.findOne({email})
        if(existingUser){
             res.status(400).json({message : 'User already exist'});
             return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password : hashedPassword, 
            isAdmin : false
        }) 

        await newUser.save()

        console.log("New user saved:", newUser);

        const token = generateToken(newUser._id.toString());

        res.status(201).json({token , user : {id : newUser._id.toString() , name ,email , isAdmin : newUser.isAdmin}})

    } catch (error) {
        res.status(500).json({message : 'Error registering user',error})
    }
}

export const loginUser = async (req : Request , res : Response) : Promise<void> => {
    const {email , password} = req.body;
    try {

        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({messege : 'Invalid credentials'})
            return;
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
             res.status(400).json({message : 'Password is Incorrect..!'})
             return;
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({token , user : {id : user._id, name : user.name ,email : user.email , isAdmin : user.isAdmin}})
        
    } catch (error) {
        res.status(500).json({message : "Error logging in" , error})
    }
}