import mongoose from 'mongoose';

const collection = 'User';

const schema = new mongoose.Schema({
    first_name:{
        type: String,
        require: true        
    },
    last_name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    age:{
        type: Number,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    cartId:{
        type: String,
        require: true
    },
    role: {
        type: String,
        required:true,
        enum:["User","admin","premium"],
        default: 'User'        
    },
    documents:{
        type:[
            {
                name:{
                type: String,
                required: true
                },
                reference:{
                    type: String,
                    required: true
                }
            }
        ],
        default:[]
    },
    last_connection:{
        type: Date,
        default: null
    },
    status:{
        type: String,
        require: true,
        enum:["completo", "incompleto", "pendiente"],
        default: "pendiente"
    },
    avatar:{
        type: String,
        default: ""        
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;

