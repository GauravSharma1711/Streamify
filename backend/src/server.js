import express from 'express'

 import "dotenv/config"

import connectDB from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 5001


import authRoutes from './routes/auth.routes.js'





app.use("/api/v1/auth",authRoutes);


app.listen(PORT,(req,res)=>{
   console.log(`server listning at ${PORT}`)
   connectDB()
})