import { Router } from "express";
import CartManager from "../dao/managersFS/cartManagers.js";
import CartManagerDB from "../dao/managersDB/cartsManagerDB.js";
//import carritoModel from "../dao/models/carrito.model.js";

const router = Router();

const managerDB = new CartManagerDB
const manager = new CartManager

//ruta db
router.post('/', async (req,res)=>{
    const msg = await managerDB.createCart();
    res.send(msg);
})

//ruta fs
// router.post('/', async (req,res)=>{
//     const msg = await manager.createCart();
//     res.send(msg);
// })

//ruta db
router.post('/:cid/products/:pid', async (req,res)=>{
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;    
    const msg = await managerDB.addCart(id_carrito, id_producto)  //manager.addCart(id_carrito, id_producto);
    res.send(msg);
})

//ruta fs
// router.post('/:cid/products/:pid', async (req,res)=>{
//     const id_carrito = req.params.cid;
//     const id_producto = req.params.pid;    
//     const msg = await manager.addCart(id_carrito, id_producto);
//     res.send(msg);
// })

//ruta db
router.get("/:cid", async(req, res)=>{
    const id = req.params.cid;
    const producto = await managerDB.getCartsId(id) //carritoModel.find({_id:id});
    res.send(producto);
})

//ruta fs
// router.get("/:cid", async(req, res)=>{
//     const id = req.params.cid;
//     const producto = await manager.getCartsId(id);
//     res.send(producto);
// })

export default router;
