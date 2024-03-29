import mongoose from 'mongoose';

const collection = 'Ticket';

const schema = new mongoose.Schema({
    code:{
        type: String,
        require: true
    },
    purchase_datetime:{
        type: Date,
        default: Date.now        
    },
    amount:{
        type: Number,
        require: true
    },
    purchaser:{
        type: String,
        require: true,        
        }    
})

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;
