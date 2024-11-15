import { Method } from './../../Client/node_modules/axios/index.d';
import cors from 'cors';
import express from 'express';
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import connectDB from './config/db'
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
 
const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));    
app.use(express.json());
connectDB() 
 
app.use('/api/auth',authRouter); 
app.use('/api/users',userRouter);

app.listen(process.env.PORT, ()=> console.log(`Server running on Port ${process.env.PORT}`))      