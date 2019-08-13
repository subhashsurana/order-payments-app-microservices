# Order & Payment App flow

When order App receives "create" order request, it will 
- create an order model, saves to mongodb using mongoose,
- publish message Queue 'orderCreated' to AMQP message broker(RabbitMQ) with order info and dummy auth token,
- order orchestrator receives the message and publishes message 'processPayment' to AMQP,
- payment App receives the message, mock-authenticates the dummy auth token, mock-validates the order info
- payment App mock-process the payment and publish either 'orderConfirmed' or 'orderCancelled' message queue based on random logic to AMQP
- Order App orchestrator receives the message of 'orderConfirmed' and updates the order status in MongoDB
- 3 seconds after 'confirmed' status is updated, the order status is updated to 'delivered' status.

To run the Order & Payments app

    In PC, install and run mongodb server and rabbitmq server
    In the project, do:
        yarn install
        cd orders-app
        node app.js
        cd payments-app
        node app.js
    Use Postman to test the API endpoints

    localhost:8001/api/order/create
    localhost:8001/api/order/cancel
    localhost:8001/api/order/status/:id
