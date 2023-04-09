import express from "express"
import ProductManager from "./managers/productManager.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const PORT = 8080;
const manager = new ProductManager
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(PORT, ()=>{    
        console.log(`Servidor funcionando en el puerto ${PORT}`)
    })

app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
// app.get('/products', async(req,res)=>{
//     const productos = await manager.getProducts();
//     const limite = req.query.limit;
//     if(!limite ){
//        return res.send({
//             productos
//          })
//     }
//     let limiteProductos = productos.slice(0,limite);
//     return res.send({
//        limiteProductos
//     })
// })

// app.get("/product/:pid", async(req, res)=>{
//     const id = req.params.pid;
//     const producto = await manager.getProductsById(id);
//     res.send(producto);
// })

// app.post('/products', async (req,res)=>{
//     const {title, description, price, thumbnail, code, stock} = req.body;
//     const producto = {title, description, price, thumbnail, code, stock};
//     console.log(producto)
//     const msg = await manager.addProduct(producto);
//     res.send(msg);
// })

// app.delete("/products/:pid", async(req, res)=>{
//     const id = req.params.pid;
//     const msg = await manager.deleteProduct(id);
//     res.send(msg);
// })

// app.put('/products/:pid', async (req,res)=>{
//     const id_producto = req.params.pid
//     const {title, description, price, thumbnail, code, stock} = req.body;    
//     const msg = await manager.updateProduct(id_producto, title, description, price, thumbnail, code, stock);
//     res.send(msg);
// })














