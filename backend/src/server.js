import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

 import "dotenv/config"

import connectDB from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 5001


import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'

app.use(express.json());
app.use(cors({
   origin:"http://localhost:5173",
   credentials:true
}))
app.use(cookieParser())


app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chat",chatRoutes);

app.listen(PORT,(req,res)=>{
   console.log(`server listning at ${PORT}`)
   connectDB()
})