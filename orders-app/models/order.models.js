"use strict"

var uuid = require('../../lib/uuid');
var constants = require('../helpers/constants');

class Order {
    constructor(customerID, details) {
        this.id = uuid.create();
        this.customerID = customerID;
        this.status = constants.ORDER_STATUS.CREATED;
        this.details = details;
        this.CreatedAt = new Date();
    }

    set status(status) {
        this._status = status;
    }

    get status() {
        return this._status;
    }

    set customerID(id) {
        this._customerID = customerID;
    }

    get customerID() {
        return this._customerID;
    }

    set details(details) {
        this._details = details;
    }

    get details() {
        return this._details;
    }

}

module.exports = Order;
