import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema({

    productos:{        
        type:[
            {
                product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                //_id: String
                },
                quantity: Number,
    //             userId: {
    //     type: String,//mongoose.Schema.Types.ObjectId,
    //     //ref: 'User',
    //     require: true,
    // }                     
            }
        ],
        default: []
    },
    
}
)

const carritoModel = mongoose.model(collection, schema);

export default carritoModel