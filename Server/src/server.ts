import { Method } from './../../Client/node_modules/axios/index.d';
import cors from 'cors';
import express from 'express';
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import connectDB from './config/db'
import * as dotenv from 'dotenv';
import path  = require('path');

dotenv.config();
const app = express();


app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
 
const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));    
// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({  limit: '10mb',extended: false }));
connectDB() 
 
app.use('/api/auth',authRouter); 
app.use('/api/Adimn',userRouter);

app.listen(process.env.PORT, ()=> console.log(`Server running on Port ${process.env.PORT}`))      