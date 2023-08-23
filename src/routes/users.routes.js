import { Router } from "express";
import UserController from "../controllers/users.controller.js";
import { adminAccess, checkAuthenticated } from "../middlewares/validations.js";
import { uploaderDocument } from "../utils.js"; 

const router = Router();
const userController = new UserController

router.put("/premium/:uid", adminAccess, userController.roleChange);
router.put("/:uid/documents",uploaderDocument.fields([
    {name:"identificacion", maxCount:1},
    {name: "domicilio", maxCount:1},
    {name: "estadoDeCuenta", maxCount:1}]), userController.updateUserDocument)

export default router;