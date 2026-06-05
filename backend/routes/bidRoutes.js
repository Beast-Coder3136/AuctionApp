import express from 'express'
import { verifyJWT, verifyRole } from '../middlewares/auth.js';
import {  getBids, placeBid,  updateBidStatus } from '../controller/biddController.js';

const router = express.Router()

router.route("/:auctionId").get(verifyJWT,getBids)
router.route("/").post(verifyJWT,verifyRole("Buyer"),placeBid)
router.route("/update/status").put(verifyJWT,verifyRole("Seller"),updateBidStatus)

export default router
