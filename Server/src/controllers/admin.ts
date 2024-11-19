import bcrypt from 'bcryptjs';
import { updateUser } from './authControllers';
import User from "../models/User";
import { Request, Response } from "express";

export const getUserDetails = async (req :Request , res : Response) : Promise<void> => {
    try {
        
        const {query = '' , page = 1 , limit = 6 } = req.query;

       const pageNumber = parseInt(page as string , 10)
       const limitNumber = parseInt(limit as string , 10)

       const skip = (pageNumber - 1) * limitNumber
        
         let users;
    const queryFilter = query
      ? {
          $and: [
            {
              $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
              ],
            },
            { isAdmin: false }, // Only fetch users where isAdmin is false
          ],
        }
      : { isAdmin: false }; // Default filter if no query is provided
   
       // Get users with pagination and query filter
       users = await User.find(queryFilter)
         .skip(skip)
         .limit(limitNumber);
   
       // Get the total count of users for calculating total pages
       const totalUsers = await User.countDocuments(queryFilter);
       const totalPages = Math.ceil(totalUsers / limitNumber);


       res.status(200).json({
         users,
         currentPage: pageNumber,
         totalPages,
       });
     } catch (error) {
       res.status(500).json({ message: 'Error occurred during fetch data from user', error });
     }
   };


   export const updateUserProfile = async (req  : Request , res : Response) : Promise<void> => {

    const {id} = req.params;
    const {name , email , image , isAdmin} = req.body;

    try {

        const user = await User.findById(id)

        if(!user){
            res.status(400).json({message : 'User is not found!'})
            return;
        }

        if(email && email !== user.email){
            const existUser = await User.findOne({ email });
            if(existUser){
                res.status(400).json({message : 'User with this email already exist..!'})
            }
        }

        user.name = name;
        user.email = email;
        user.image = image;
        user.isAdmin = isAdmin;

        await user.save()

        res.status(200).json({message : 'User update successfully!', user})

    } catch (error) {
        res.status(500).json({message : 'Error occured during update the profile image'})
    }
   }

  export const addNewUser = async (req : Request , res : Response) : Promise<void> => {

    const {name , email , image , password , isAdmin} = req.body;

    try {

      const Existinguser = await User.findOne({email})

      if(Existinguser){
        res.status(400).json({message : 'User is already exist!'})
        return
      }

      const hashedPassword = await bcrypt.hash(password ,10)

      const newUser = new User({
        name, 
        email,
        image,
        password : hashedPassword,
        isAdmin
      });

      await newUser.save()

      res.status(200).json({message : 'New User added successfully..!'})
      
    } catch (error) {
      res.status(500).json({message : 'Error occured during add new User!'})
    }
  }  

  export const deleteUser = async  (req : Request , res : Response) : Promise<void> => {

    try {

      const {id} = req.params
 
      console.log("This is user id",id)

      await User.findByIdAndDelete(id);

      res.status(200).json({ message: 'User deleted successfully.' });

    } catch (error) {
      res.status(500).json({message : 'Error occured during delete user'})
    }
  }
  