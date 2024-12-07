const mongoose = require('mongoose');

// Define the schema for the Order
const orderSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true },
    cartItems: { 
        type: Array, 
        required: true 
    },
    amount: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'Confirmed' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Create the model from the schema
const orderModel = mongoose.model('Order', orderSchema);

// Export the model
module.exports = orderModel;
