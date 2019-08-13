var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var Order = require("../models/order.models");
var httpHelper = require("../helpers/http");
var constants = require("../helpers/constants");
var amqp = require("../../lib/amqp");

const create = async (req, res) => {
  const order = req.body;
  try {
    if (order) {
      const newOrder = new Order({ ...order, customerID: req.body.customerID });

      await newOrder.save();
      if (newOrder) {
        await amqp.publish("orderCreated", newOrder);
        httpHelper.res(res, newOrder);
      } else {
        httpHelper.err(res, "Invalid order");
      }
    } else {
      httpHelper.err(res, "Invalid order details");
    }
  } catch (err) {
    httpHelper.err(res, err);
  }
};

var cancel = async (req, res) => {
  try {
    const order = mongoose.Types.ObjectId(req.body.id);
    if (order) {
      let dbOrderStatus = await Order.findOne({ _id: order });
      
      if (!dbOrderStatus) {
        return res.status(404).send("Invalid order requested");
      }
      if (dbOrderStatus.status === constants.ORDER_STATUS.CANCELLED) {
        return res
          .status(400)
          .send("Order already cancelled.Please retry with different order");
      }
      let orderStatus = await Order.updateOne(
        { _id: order },
        { $set: { status: constants.ORDER_STATUS.CANCELLED } }
      );
      if (!orderStatus.nModified) {
        return res.status(400).send("Order status not modified");
      }
      httpHelper.res(res, {});
    } else {
      httpHelper.err(res, "Invalid order details");
    }
  } catch (err) {
    httpHelper.err(res, err);
  }
};

var getStatus = async (req, res) => {
  const _id = req.params.id;
  try {
    if (mongoose.Types.ObjectId.isValid(_id)) {
      const order = await Order.findOne({ _id });
      if (!order) {
        return res.status(404).send("Invalid order");
      }
      httpHelper.res(res, { status: order.status });
    } else {
      httpHelper.err(res, "Invalid order details");
    }
  } catch (err) {
    httpHelper.err(res, err);
  }
};

router.post("/create", create);
router.patch("/cancel", cancel);
router.get("/status/:id", getStatus);

module.exports = router;
