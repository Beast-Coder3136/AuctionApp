import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors' 
import { connectDB } from './lib/db.js';
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import auctionRoutes from './routes/auctionRoutes.js'
import bidRoutes from './routes/bidRoutes.js'
import { startCronJobs } from './lib/crone.js';
import { app, server } from './lib/socket.js';

dotenv.config({})


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin : "http://localhost:5173" ,
  credentials : true 
}))
app.use(cookieParser())

app.use("/api/user",userRoutes) 
app.use("/api/message",messageRoutes)
app.use("/api/auction",auctionRoutes)
app.use("/api/bid",bidRoutes)


startCronJobs()
const port = process.env.PORT
server.listen(port,()=>{
  connectDB() ;
  console.log("server is listening on port : "+ port) 
})