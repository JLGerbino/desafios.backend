import express from "express"
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./managers/productManager.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewRouter from "./routes/views.routes.js"
import __dirname from "./utils.js";


const PORT = 8080;

const manager = new ProductManager

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname +'/views');
app.set('view engine', 'handlebars');
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/", viewRouter);

const server = app.listen(PORT, ()=>{    
        console.log(`Servidor funcionando en el puerto ${PORT}`)
    })

const socketServerIO = new Server(server);

socketServerIO.on("connection", socket =>{
        console.log("Usuario conectado");
        socket.on("message", async nuevoProducto =>{

        nuevoProducto = await manager.addProduct(nuevoProducto);//esto tengo que hacer en app
        console.log(nuevoProducto)
        // if (nuevoProducto === "Todos los campos son obligatorios"){
        //   return  alert("Todos los campos son obligatorios")
        // }
        //console.log(nuevoProducto)
        //const productos = manager.getProduct();
        // console.log(agregado)
        //productos.push(nuevoProducto)
        const productos = await manager.getProducts();
        //console.log(productos);
        socketServerIO.emit("actualizado", productos); //productos       
    })

    socket.on("message1", async idEliminar =>{
        console.log(idEliminar)
        idEliminar = await manager.deleteProduct(idEliminar);
        const productos = await manager.getProducts();
        socketServerIO.emit("actualizado", productos)
    } )
})


















