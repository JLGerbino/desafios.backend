import { Router } from "express";
import ViewController from "../controllers/views.controller.js";
import { userAccess, adminAccess } from "../middlewares/validations.js";
const router = Router();

const viewController = new ViewController 

const publicAcces = (req,res,next) =>{
    if(req.session.user) return res.redirect('/profile');
    next();
}
const privateAcces = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/');
    next();
}

router.get("/home", viewController.getHome);
router.get("/products", viewController.getProducts);
router.get("/carts/:cid", userAccess, viewController.cartById);
router.get("/chat", userAccess, viewController.chat);
router.get("/realTimeProducts", adminAccess, viewController.realTimeProducts);
router.get("/register", publicAcces, viewController.register);
router.get("/", publicAcces, viewController.login);
router.get("/profile", privateAcces, viewController.profile);
router.get("/resetPassword", viewController.resetPassword);

export default router;
