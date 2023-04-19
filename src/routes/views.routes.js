import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const manager = new ProductManager

router.get("/", async (req, res)=>{
    const productos = await manager.getProducts();
    res.render("home", {products: productos} )

})

router.get("/realTimeProducts", async (req, res)=>{
    const productos = await manager.getProducts();
    console.log(productos)
    res.render("realTimeProducts", {products: productos})
})

export default router;
