import express from "express"
import ProductManager from "./managers/productManager.js";

const PORT = 8080;
const manager = new ProductManager
const app = express();

app.use(express.urlencoded({extended:true}))

app.listen(PORT, ()=>{    
        console.log(`Servidor funcionando en el puerto ${PORT}`)
    })

app.get('/products', async(req,res)=>{
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

app.get("/product/:pid", async(req, res)=>{
    const id = req.params.pid;
    const producto = await manager.getProductsById(id);
    res.send(producto);
})
















