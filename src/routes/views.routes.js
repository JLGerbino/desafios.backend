import { Router } from "express";
import ViewController from "../controllers/views.controller.js";

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
router.get("/realTimeProducts", viewController.realTimeProducts);
router.get("/carts/:cid", viewController.cartById);
router.get("/chat", viewController.chat);
router.get("/register", publicAcces, viewController.register);
router.get("/", publicAcces, viewController.login);
router.get("/profile", privateAcces, viewController.profile);
router.get("/resetPassword", viewController.resetPassword);

export default router;
