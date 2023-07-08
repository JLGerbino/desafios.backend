import express from "express"
import handlebars from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import passport from "passport";
import ProductManagerFS from "./dao/managersFS/productManager.js";
import ProductManagerDB from "./dao/managersDB/productManagerDB.js";
import ChatManagerDB from "./dao/managersDB/chatManagerDB.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/sessions.routes.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import { config } from "./config/config.js"
import { connectDB } from "./config/dbConnection.js";
import ViewController from "./controllers/views.controller.js"

const PORT = config.server.port;

//const MONGO = config.mongo.url; 

const manager = new ProductManagerFS
const managerDB = new ProductManagerDB
const managerChatDB = new ChatManagerDB
const viewController = new ViewController

const app = express();

connectDB()
//const connection = mongoose.connect(MONGO);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.url, //MONGO,
        ttl:3600
    }),
    secret: config.keys.cookieSecret, //"CoderSecret",
    resave:false,
    saveUninitialized:false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname +"/views");
app.set("view engine", "handlebars");
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewRouter);
app.use("/api/sessions", sessionRouter)

console.log("configuracion",config)

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
        io.emit("actualizado", productos);}      
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
