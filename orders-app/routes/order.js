var express = require('express');
var router = express.Router();
var httpHelper = require('../helpers/http');
var amqp = require('../../lib/amqp');
var orderModel = require('../models/order.models');
var dbEntityController = require('../controllers/dbEntityController');
var constants = require('../helpers/constants');
var mongodb = require('mongodb');

var entity = 'order';

const create = async (req, res) => {
    try {
        const order = req.body;
        if (order) {
            const newOrder = new orderModel(order.customerID, order.details);
            const createdOrder = await dbEntityController.create(entity, newOrder);
            newOrder.id = createdOrder.id;

            if (newOrder) {
                await amqp.publish('orderCreated', newOrder);
                httpHelper.res(res, createdOrder);
            } else {
                httpHelper.err(res, 'Invalid order');
            }

        } else {
            httpHelper.err(res, 'Invalid order details');
        }

    } catch (err) {
        httpHelper.err(res, err);

    }
}

var cancel = async (req, res) => {
    try {
        var order = req.body;
        if (order && order.id) {
            await dbEntityController.update(entity,
                { _status: constants.ORDER_STATUS.CANCELLED },
                { id: order.id });
            httpHelper.res(res, {});
        } else {
            httpHelper.err(res, 'Invalid order details');
        }
    } catch (err) {
        httpHelper.err(res, err);
    }
}

var getStatus = async (req, res) => {
    const _id = req.params.id;
    try {
        if (mongodb.ObjectID.isValid(_id)) {
          var orders = await dbEntityController.find(entity, {_id });
          httpHelper.res(res, { status: orders[0]._status });
        } else {
          httpHelper.err(res, "Invalid order details");
        }
    } catch (err) {
        httpHelper.err(res, err);
    }
}

router.post('/create', create);
router.post('/cancel', cancel);
router.post('/status/:id', getStatus);

module.exports = router;
