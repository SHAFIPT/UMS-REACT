import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getUserDetails , updateUserProfile , addNewUser , deleteUser} from '../controllers/admin';
const adminRouter = express.Router();

adminRouter.get('/getUser',authenticateToken,getUserDetails)
adminRouter.put('/update-Profile/:id',authenticateToken,updateUserProfile)
adminRouter.post("/add-User",authenticateToken,addNewUser);
adminRouter.delete('/deleteUser/:id',authenticateToken,deleteUser)


export default adminRouter;