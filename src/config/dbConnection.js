import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(config.mongo.url);
        console.log("Conectado a la base de datos.")
    } catch (error) {
        console.log("Error al tratar deconectar: " + error)
    }
}