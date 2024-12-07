const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

// Create Order - /api/v1/order
exports.createOrder = async (req, res, next) => {
    try {
        // Extract fields from request body
        const { cartItems, name, email, contactNumber, address, country } = req.body;

        // Calculate the total amount
        const amount = Number(cartItems.reduce((acc, item) => (acc + item.product.price * item.qty), 0)).toFixed(2);
        const status = 'confirmed';

        // Create the order
        const order = await orderModel.create({
            cartItems,
            amount,
            status,
            name,
            email,
            contactNumber,
            address,
            country
        });

        // Update product stock
        for (const item of cartItems) {
            const product = await productModel.findById(item.product._id);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.product._id} not found.` });
            }
            product.stock -= item.qty;
            await product.save();
        }

        // Respond with the created order
        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the order.',
            error: error.message
        });
    }
};
