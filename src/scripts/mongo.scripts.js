import {ProuctModel} from "../dao/models/producto.model";// "../daos/models/product.model.js";
import {connectDB} from "../config/dbConnection.js"; //"../config/dbConnection.js"; 

connectDB(); 

//funcion para agregar el owner a cada producto

const updateProducts = async() =>{
    try {
        const adminId = "64737347561c7ba2b31ad479"
        const result = await ProuctModel.updateMany({},{$set:{owner:adminId}})
        console.log("Result", result)
    } catch (error) {
        console.log(error.message)
    }
}
updateProducts();