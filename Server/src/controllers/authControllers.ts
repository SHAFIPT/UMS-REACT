import User from '../models/User'
import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import path from 'path'

export const registerUser = async (req : Request , res : Response) : Promise<void> => {
    const {name ,email ,password} = req.body;

    console.log("this is register name':", name);
    console.log("this is register name:", email);
    console.log("this is register name", password);

    try {
        
        const existingUser = await User.findOne({email})

        console.log("Existing user check:", existingUser);

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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                status: 'error',
                message: 'User not found. Please check your email address.'
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                status: 'error',
                message: 'Incorrect password. Please try again.'
            });
            return;
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: "An error occurred during login. Please try again later.",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

    export const getUserDetails = async (req : Request , res : Response) : Promise<void> => {

        const {email} = req.body;
        
        try {

            const user = await User.findOne({email : email});

            if(!user){
                res.status(400).json({message : 'Invalid email address'})
                return;
            }

            const {password ,...userData} = user.toObject();


            res.status(200).json({user : userData})
            
        } catch (error) {
            res.status(500).json({message : 'Error occure during fetch user data.!'})
        }
    }

    export const UpdatePassword = async (req : Request , res : Response) : Promise<void> => {
        const {email , currentPassword , newPassword} = req.body;

        try {

            const user = await User.findOne({email});

            if(!user){
                res.status(404).json({message : 'User not found'})
                return;
            }

            const isMatch = await bcrypt.compare(currentPassword ,user.password);
            if(!isMatch){
                res.status(400).json({message : 'Incorrect current password'});
                return
            }

            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword ,salt);

            user.password = hashedNewPassword;
            await user.save()

            res.status(200).json({message : 'Password update successfully...!'})
            
        } catch (error) {
            res.status(500).json({message : 'Error occured during update password..!'})
        }
    }

export const updateUser = async (req : Request , res : Response) : Promise<void> => {
    try {

        const {name ,email , id} = req.body;


        const updateUser = await User.findByIdAndUpdate(id ,{name , email} ,{new :true});

        if(!updateUser){
            res.status(404).json({success : false, message : 'User not found'});
            return;
        }

        res.status(200).json({success : true ,user :updateUser})
        
    } catch (error) {
        res.status(500).json({message : 'An Error occured while updating the profile..'})
    }
}
export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {

        const {id , image} = req.body;

        console.log("id",id)
        console.log("name",image)

        const updateUser = await User.findOneAndUpdate(
            {_id : id},
            {$set : {image}},
            {new : true ,runValidators : true}
        )


        if (updateUser) {
             res.status(200).json({ user : updateUser});
        }else{
            res.status(404).json({message : 'User not found'})
        }

    } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({ message: 'Error updating profile image' });
    }
};