import express from 'express'
import {createServer}  from 'http'
import { Server } from 'socket.io';
const app = express() ;
const server = createServer(app) 
const io = new Server(server,{
  pingTimeout : 5 * 60 * 1000 ,
  cors : {
    origin : "http://localhost:5173"
  }
})

io.on("connection",(socket)=>{
  console.log("Client is now connected") 
  socket.on("setup",(user)=>{
    console.log(`${user?._id} is connected ${user.role}`)
    socket.emit("connected")
  })
  socket.on("join-auction",(auctionId)=>{
    console.log(`Room created for ${auctionId}`)
    socket.join(auctionId)
  })
  socket.on("new-message",(newMessage)=>{
    const auctionId = newMessage?.auction
    socket.in(auctionId).emit("new-message-recieve",newMessage)
  })
  socket.on("new-bid",(bid)=>{
    socket.in(bid?.auction?._id).emit("new-bid-recieve",bid)
  })
 
})

export { io , app , server }
