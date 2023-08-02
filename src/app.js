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
import { swaggerSpecs } from "./config/docConfig.js";
import swaggerUi from "swagger-ui-express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/sessions.routes.js";
import loggerRouter from "./routes/logger.routes.js";
import userRouter from "./routes/users.routes.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import { config } from "./config/config.js"
import { connectDB } from "./config/dbConnection.js";
import ViewController from "./controllers/views.controller.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import { addLogger } from "./middlewares/logger.js";
import { envLogger } from "./middlewares/logger.js";


const PORT = config.server.port;

const manager = new ProductManagerFS
const managerDB = new ProductManagerDB
const managerChatDB = new ChatManagerDB
const viewController = new ViewController

const app = express();

app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.url, 
        ttl:3600
    }),
    secret: config.keys.cookieSecret,
    saveUninitialized:false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname +"/views");
app.set("view engine", "handlebars");
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/logger", loggerRouter);
app.use("/api/users", userRouter);
app.use('/api/docs', swaggerUi.serve,swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);
const logger = envLogger();

logger.info("configuracion",config.entorno)

const server = app.listen(PORT, (req)=>{ 
    logger.info(`Servidor funcionando en el puerto ${PORT}`)         
    })

const io = new Server(server);
const messages = []


io.on("connection", socket =>{
    logger.info("Usuario conectado");                
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
    logger.info("producto eliminado")        
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

