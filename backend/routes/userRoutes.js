import express from 'express'
import { login, logout, register } from '../controller/userController.js';
import { verifyJWT, verifyRole } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router() 

router.route("/register").post(singleUpload,register)
router.route("/login").post(login) 
router.route("/logout").post(verifyJWT,logout)

export default router ; 