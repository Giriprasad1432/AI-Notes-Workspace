import express from "express"
import {authController,RegisterController,LogoutController} from "../controller/authContrtoller.js";

const router=express.Router();

router.post("/login",authController);
router.post("/register",RegisterController);
router.post("/logout",LogoutController);

export default router;