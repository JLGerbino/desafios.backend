import express from "express"
import ProductManager from "./managers/productManager.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import __dirname from "./utils.js";

const PORT = 8080;
const manager = new ProductManager
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.listen(PORT, ()=>{    
        console.log(`Servidor funcionando en el puerto ${PORT}`)
    })

app.use("/products", productsRouter);
app.use("/carts", cartsRouter);














