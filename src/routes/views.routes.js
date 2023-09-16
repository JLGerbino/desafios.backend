import { Router } from "express";
import ViewController from "../controllers/views.controller.js";
import { userAccess, adminPremiumAccess, adminAccess, userPremiumAccess } from "../middlewares/validations.js";
import { uploaderProfile, uploader } from "../utils.js";

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
router.get("/carts/:cid", userPremiumAccess, viewController.cartById);
router.get("/chat", userAccess, viewController.chat);
router.get("/realTimeProducts", adminPremiumAccess, uploader.array("thumbnail"), viewController.realTimeProducts);
router.get("/register", publicAcces, uploaderProfile.single("avatar"), viewController.register);
router.get("/", publicAcces, viewController.login);
router.get("/profile", privateAcces, viewController.profile);
router.get("/reset-password", viewController.resetPassword);
router.get("/forgot-password", viewController.forgotPassword);
router.get("/users", adminAccess, viewController.users);
export default router;
