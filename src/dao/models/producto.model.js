import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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
    owner:{
        type: String
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"User"        
    },
    thumbnail:{
        type: String,
        require: true
     }// []    
})

schema.plugin(mongoosePaginate)

const productoModel = mongoose.model(collection, schema);

export default productoModel