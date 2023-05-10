import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema({

    productos:{
        type:[
            {
                product: {
                type: mongoose.Schema.Types.ObjectId, ref: "products",
                _id: String
                },
                quantity: Number                
            }
        ],
        default: []
    },         
})

const carritoModel = mongoose.model(collection, schema);

export default carritoModel