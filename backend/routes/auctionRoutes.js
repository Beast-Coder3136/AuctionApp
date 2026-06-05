import express from 'express'
import { verifyJWT, verifyRole } from '../middlewares/auth.js';
import { createAuction, getAuctionById, getSellerAuction, searchAuction, updateAuction } from '../controller/auctionController.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router() 

router.route("/").post(verifyJWT,verifyRole("Seller"),singleUpload,createAuction).get(verifyJWT,searchAuction)
router.route("/seller").get(verifyJWT,verifyRole('Seller'),getSellerAuction)
router.route("/:id").put(verifyJWT,verifyRole("Seller"),updateAuction).get(verifyJWT,getAuctionById)

export default router