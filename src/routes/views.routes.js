import { Router } from "express";
import ProductManagerFS from "../dao/managersFS/productManager.js";
import ProductManagerDB from "../dao/managersDB/productManagerDB.js";

const router = Router();

const manager = new ProductManagerFS
const managerDB = new ProductManagerDB

router.get("/", async (req, res)=>{
    const productos = await managerDB.getProducts(); //manager.getProducts()    
    const prods = productos.map(item=>item.toObject())
    console.log(productos)
    res.render("home", {products: prods})

})

router.get("/realTimeProducts", async (req, res)=>{
    const productos = await managerDB.getProducts(); //manager.getProducts();
    const prods = productos.map(item=>item.toObject())
    console.log(productos)
    res.render("realTimeProducts", {products: prods})
})

router.get("/chat", (req,res)=>{
    res.render("chat", {})
})

export default router;
