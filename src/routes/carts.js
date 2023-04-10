import { Router } from "express";
import CartManager from "../managers/cartManagers.js";

const router = Router();

const manager = new CartManager


router.post('/', async (req,res)=>{
    const msg = await manager.createCart();
    res.send(msg);
})

router.post('/:cid/products/:pid', async (req,res)=>{
    const id_carrito = req.params.cid;
    const id_producto = req.params.pid;    
    const msg = await manager.addCart(id_carrito, id_producto);
    res.send(msg);
})

router.get("/:cid", async(req, res)=>{
    const id = req.params.cid;
    const producto = await manager.getCartsId(id);
    res.send(producto);
})

export default router;


