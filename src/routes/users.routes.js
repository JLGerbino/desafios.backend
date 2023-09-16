import { Router } from "express";
import UserController from "../controllers/users.controller.js";
import { adminAccess } from "../middlewares/validations.js";
import { uploaderDocument } from "../utils.js"; 

const router = Router();
const userController = new UserController

router.get("/", userController.getUsers);
router.put("/premium/:uid", adminAccess, userController.roleChange);
router.put("/:uid/documents",uploaderDocument.fields([
    {name:"identificacion", maxCount:1},
    {name: "domicilio", maxCount:1},
    {name: "estadoDeCuenta", maxCount:1}]), userController.updateUserDocument);
router.delete("/:uid", userController.deleteUserById);   
router.delete("/", userController.deleteUsers);    



export default router;