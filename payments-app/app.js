const amqp = require('../lib/amqp');


amqp.consume('processPayment', message => {
    console.log('amqp: payment process requested!', message);
    if (authenticate(message.token)) {
        processPayment(message.order);
    } else {
        declineOrder(message.order._id, 'auth failed.');
    }
});

const authenticate = token => {
    // call auth service to authenticate the token
    console.log(token);
    return true;
}

const isValidOrder = () => {
    //Order validation logic

    var stat = { confirmed: 1, declined: 0 };
    var randomVal = getRandomNo(stat.declined, stat.confirmed);
    var validOrder = randomVal === 1 ? true : false;
    return validOrder;
}


//function to get random value

function getRandomNo(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const processPayment = order => {
    if (isValidOrder()) {
        //payment processing logic
        confirmOrder(order._id);
    } else {
        declineOrder(order._id, 'order validation failed.');
    }
}

const confirmOrder = orderID => {
    amqp.publish('orderConfirmed', {
        orderID: orderID
    });
}

const declineOrder = (orderID, reason) => {
    amqp.publish('orderDeclined', {
        orderID: orderID,
        reason: reason
    });
}
