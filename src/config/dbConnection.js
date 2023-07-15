import mongoose from "mongoose";
import { config } from "./config.js";
import { EError } from "../enums/EErrors.js";
import { CustomError } from "../repository/customError.repository.js";
import { generateDBErrorParam } from "../repository/dbErrorParams.js";

export const connectDB = async()=>{
    try {       
        await mongoose.connect(config.mongo.url);              
        console.log("Conectado a la base de datos.")          
    } catch (error) {
        CustomError.createError({
            name: "Error connection",
            cause: generateDBErrorParam(),
            message: "error de coneccion a la base de datos",
            errorCode: EError.DATABASE_ERROR,              
        });    
        console.log("Error al tratar de conectar: " + error)
    }
}