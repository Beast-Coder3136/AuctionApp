import express from 'express'
import { verifyJWT, verifyRole } from '../middlewares/auth.js';
import { createMessage, getAllMessage } from '../controller/messageController.js';

const router = express.Router()

router.route("/:auctionId").get(verifyJWT,getAllMessage) 
router.route("/").post(verifyJWT,createMessage)

export default router
