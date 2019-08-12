var amqp = require("amqplib").connect("amqp://localhost");

const assertQueueOptions = { durable: true };
const sendToQueueOptions = { persistent: true };

exports.publish = (queue, message) => {
  const bufferedData = Buffer.from(JSON.stringify(message));
  amqp
    .then(connection => {
      return connection.createChannel();
    })
    .then(channel => {
      return channel.assertQueue(queue, assertQueueOptions).then(() => {
        return channel.sendToQueue(queue, bufferedData, sendToQueueOptions);
      });
    })
    .catch(console.warn);
};

exports.consume = (queue, cb) => {
  amqp
    .then(connection => {
      return connection.createChannel();
    })
    .then(channel => {
      return channel.assertQueue(queue, assertQueueOptions).then(() => {
        return channel.consume(queue, message => {
          if (message != null) {
            var content = JSON.parse(message.content.toString());
            console.log("AMQP received message: ", content);
            channel.ack(message);
            cb(content);
          }
        });
      });
    })
    .catch(console.warn);
};
