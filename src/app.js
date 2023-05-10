import express from "express"
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import ProductManagerFS from "./dao/managersFS/productManager.js";
import ProductManagerDB from "./dao/managersDB/productManagerDB.js";
import ChatManagerDB from "./dao/managersDB/chatManagerDB.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewRouter from "./routes/views.routes.js"
import __dirname from "./utils.js";

const PORT = 8080;

const MONGO = "mongodb+srv://joselgerbino:tote1311@cluster0.qduemld.mongodb.net/ecommerce?retryWrites=true&w=majority"

const manager = new ProductManagerFS
const managerDB = new ProductManagerDB
const managerChatDB = new ChatManagerDB

const app = express();

const connection = mongoose.connect(MONGO);

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

const io = new Server(server);
const messages = []

io.on("connection", socket =>{
        console.log("Usuario conectado");
        
        socket.on("message", async nuevoProducto =>{
        nuevoProducto = await managerDB.addProduct(nuevoProducto); //manager.addProduct(nuevoProducto);
        console.log(nuevoProducto)
        if (nuevoProducto === "Todos los campos son obligatorios"){
            io.emit("actualizado", "campos"); 
        }if(nuevoProducto === "El 'code' del producto ya existe, intente cambiarlo."){
            io.emit("actualizado", "code");
        }else{        
        const productos = await managerDB.getProducts(); //manager.getProducts();        
        io.emit("actualizado", productos);} //productos       
    })

    socket.on("message1", async idEliminar =>{        
        idEliminar = await managerDB.deleteProduct(idEliminar); //manager.deleteProduct(idEliminar);
        console.log(idEliminar)
        if (idEliminar === "El producto que quiere eliminar no existe") {
            io.emit("actualizado", "inexistente")
        }else{
        const productos = await managerDB.getProducts(); //manager.getProducts();
        io.emit("actualizado", productos)
        }
    })

    //chat
    socket.on("message2", async data =>{
        await messages.push(data)
        await managerChatDB.createChats(data)
        io.emit("messageLogs", messages)
    })
})

















