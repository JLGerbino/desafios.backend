import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const manager = new ProductManager

router.get('/', async(req,res)=>{
    const productos = await manager.getProducts();
    const limite = req.query.limit;
    if(!limite ){
       return res.send({
            productos
         })
    }
    let limiteProductos = productos.slice(0,limite);
    return res.send({
       limiteProductos
    })
})

router.get("/:pid", async(req, res)=>{
    const id = req.params.pid;
    const producto = await manager.getProductsById(id);
    res.send(producto);
})

router.post('/', async (req,res)=>{
    const {title, description, code, price, status, stock, category,thumbnail} = req.body;
    const producto = {title, description, code, price, status, stock, category, thumbnail};
    console.log(producto)
    const msg = await manager.addProduct(producto);
    res.send(msg);
})

router.delete("/:pid", async(req, res)=>{
    const id = req.params.pid;
    const msg = await manager.deleteProduct(id);
    res.send(msg);
})

router.put('/:pid', async (req,res)=>{
    const id_producto = req.params.pid
    const {title, description, code, price, status, stock, category, thumbnail} = req.body;    
    const msg = await manager.updateProduct(parseInt(id_producto), title, description, code, price, status, stock, category, thumbnail);
    res.send(msg);
})

export default router;