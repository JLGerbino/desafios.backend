import { Router } from "express";
import UserController from "../controllers/users.controller.js";
import { adminAccess } from "../middlewares/validations.js";

const router = Router();
const userController = new UserController

router.put("/premium/:uid", adminAccess, userController.roleChange);
// router.put("/premium/:uid", checkRole(["admin"]) , async(req,res)=>{
    
// });

export default router;