import { Router } from "express";
import LoggerController from "../controllers/logger.controller.js"; 

const router = Router();
const loggerController = new LoggerController

router.get('/loggerTest', loggerController.test);

export default router