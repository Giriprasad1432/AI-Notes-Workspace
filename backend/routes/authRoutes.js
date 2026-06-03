import express from "express"
import {authController,RegisterController,LogoutController} from "../controller/authContrtoller.js";
import {protect} from "../middleware/authMiddleWare.js";
const router=express.Router();

router.post("/login",authController);
router.post("/register",RegisterController);
router.post("/logout",protect,LogoutController);

export default router;