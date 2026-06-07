import { io } from '../lib/socket.js'
import Message from '../models/message.js'
import { getAuctionById } from './auctionController.js'

export const getAllMessage = async (req, res) => {
  try {
    const { auctionId } = req.params
    const messages = await Message.find({ auction: auctionId }).populate("sender", "-password").sort({ createdAt: 1 })
    return res.status(200).json({
      success: true,
      messages
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createMessage = async (req, res) => {
  try {
    const { content, auctionId } = req.body;
    if (!content || !auctionId) {
      return res.status(400).json({
        success: false,
        message: "Please Provide key fields"
      })
    }
    const newMessage = await Message.create({
      auction: auctionId,
      content,
      sender: req.user.id
    })
    await newMessage.populate("sender", "-password")
    io.to(auctionId).emit("new-message-recieve",newMessage)
    return res.status(202).json({
      success: true,
      message: newMessage
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

