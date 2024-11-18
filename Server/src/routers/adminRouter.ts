import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getUserDetails , updateUserProfile } from '../controllers/admin';
const adminRouter = express.Router();

adminRouter.get('/getUser',authenticateToken,getUserDetails)
adminRouter.put('/update-Profile/:id',authenticateToken,updateUserProfile)


export default adminRouter;