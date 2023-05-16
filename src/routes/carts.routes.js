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

//ruta db nueva
router.delete('/:cid/products/:pid', async (req,res)=>{
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;    
    const msg = await managerDB.deleteProdInCartById(id_carrito, id_producto)
    res.send(msg);
})

//ruta db nueva
router.delete('/:cid', async (req,res)=>{
    const id_carrito = req.params.cid;        
    const msg = await managerDB.deleteProdInCart(id_carrito)
    res.send(msg);
})

//ruta db nueva 
router.put('/:cid/products/:pid', async (req,res)=>{
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;  
    const quantity = req.body.quantity 
    const cantidad = parseInt(quantity)
    console.log(cantidad)
    const msg = await managerDB.UpdateQuantityProd(id_carrito, id_producto, cantidad)
    res.send(msg);
})

router.put('/:cid', async (req,res)=>{
    const id_carrito = req.params.cid;    
    const msg = await managerDB.UpdateCartWithProds(id_carrito)
    res.send(msg);
})

export default router;
