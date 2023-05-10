import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    code:{
        type: Number,
        require: true,
        unique: true
    },
    price:{
        type: Number,
        require: true,        
    },
    status:{
        
    },
    stock:{
        type: Number,
        require: true
    },
    category:{
        type: String,
        require:true
    },
    thumbnail:[]
})

const productoModel = mongoose.model(collection, schema);

export default productoModel