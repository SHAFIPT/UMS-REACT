import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { loginUser , registerUser ,getUserDetails ,UpdatePassword ,updateUser} from '../controllers/authControllers';

const authRouter = express.Router();

authRouter.post('/login',loginUser);
authRouter.post('/register',registerUser);
authRouter.post('/getUser',authenticateToken,getUserDetails);
authRouter.post('/changePassword',authenticateToken,UpdatePassword);
authRouter.patch('/updateUser',authenticateToken,updateUser)

export default authRouter; 