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

        nuevoProducto = await manager.addProduct(nuevoProducto);
        console.log(nuevoProducto)
        if (nuevoProducto === "Todos los campos son obligatorios"){
            socketServerIO.emit("actualizado", "campos"); 
         }if(nuevoProducto === "El 'code' del producto ya existe, intente cambiarlo."){
            socketServerIO.emit("actualizado", "code");
         }else{        
        const productos = await manager.getProducts();
        //console.log(productos);
        socketServerIO.emit("actualizado", productos);} //productos       
    })

    socket.on("message1", async idEliminar =>{        
        idEliminar = await manager.deleteProduct(idEliminar);
        console.log(idEliminar)
        if (idEliminar === "El producto que quiere eliminar no existe") {
            socketServerIO.emit("actualizado", "inexistente")
        }else{
        const productos = await manager.getProducts();
        socketServerIO.emit("actualizado", productos)
        }
    })
})


















