const amqp = require('../../lib/amqp');
const mongoose = require('mongoose');
const Order = require("../models/order.models");
const constants = require('../helpers/constants');
const dummyAuthToken = 'vb67asbBGhsafhDgsf6IkpNcAS22asd12418';

exports.init = () => {
    amqp.consume('orderCreated', newOrder => {
        console.log('amqp: order created!', newOrder);

        amqp.publish('processPayment', {
            token: dummyAuthToken,
            order: newOrder
        });
    });

    amqp.consume('orderConfirmed', async (message) => {
        var orderID = message.orderID;
        console.log("amqp: order confirmed! Order ID: ",orderID);
        await updateOrderStatus(orderID, constants.ORDER_STATUS.CONFIRMED);
        setTimeout(async () => {
            await updateOrderStatus(orderID, constants.ORDER_STATUS.DELIVERED);
            console.log('order delivered');
        }, 3000);
    });

    amqp.consume('orderDeclined', async (message) => {
        console.log('amqp: order declined! reason: ', message.reason);
        await updateOrderStatus(message.orderID, constants.ORDER_STATUS.CANCELLED);
    });

}

const updateOrderStatus = async (id, status) => {
    const orderId = mongoose.Types.ObjectId(id);
  if (orderId) {
    await Order.updateOne({ _id: orderId }, { $set: { status: status } });
  } else {
    console.log("Invalid order details");
  }
};
        




