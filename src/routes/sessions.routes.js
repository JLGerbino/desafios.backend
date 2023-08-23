import { Router } from 'express';
import passport from 'passport';
import SessionsController from '../controllers/sessions.controller.js';
import { uploaderProfile } from '../utils.js';

const router = Router();
const sessionsController = new SessionsController 

router.post("/register", uploaderProfile.single("avatar"), passport.authenticate("register", {failureRedirect:"/failregister"}), sessionsController.register);
router.get("/failregister", sessionsController.failregister);
router.post("/", passport.authenticate("login" ,{failureRedirect:"/faillogin"}), sessionsController.login);
router.get("/faillogin", sessionsController.faillogin);
router.get('/logout', sessionsController.logout);
//router.post('/resetPassword', sessionsController.resetPassword);
router.post('/reset-password', sessionsController.resetPassword);
router.get('/github', passport.authenticate('github', {scope:['user:email']}), sessionsController.github);
router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/'}), sessionsController.githubcallback)
router.post("/forgot-password", sessionsController.forgotPassword);

export default router;