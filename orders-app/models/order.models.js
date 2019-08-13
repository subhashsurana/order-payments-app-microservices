const mongoose = require('mongoose');

var constants = require('../helpers/constants');

const OrderSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true,
    },
    
    status: {
        type: String,
        required: true,
        default: constants.ORDER_STATUS.CREATED
    },

    details: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;