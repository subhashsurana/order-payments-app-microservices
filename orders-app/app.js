var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var morgan = require('morgan');
var cors = require('cors');
var fs = require('fs');
var path = require('path');
var config = require('./config/config');
var httpHelper = require('./helpers/http');
const orderRoute = require('./routes/order');


var app = express();
var appConfig = config.get(app.get('env'));
var logStream = fs.createWriteStream(path.join(__dirname, 'logs'), { flags: 'a' });

var db = require('./controllers/db.controllers');
var orchestrator = require('./modules/orchestrator');

app.set(helmet());
app.use(morgan('dev', { stream: logStream }));
app.use(bodyParser.json({ limit: appConfig.app.http.jsonLimit }));
app.use(bodyParser.urlencoded({ limit: appConfig.app.http.jsonLimit, extended: true }));
app.use(cookieParser());

//set cors
app.use(cors(httpHelper.corsOptions()));

//routes
app.use('/api/order/', orderRoute);


// init database connection
db.init(appConfig.db);
orchestrator.init();

//start api server
const server = app.listen(appConfig.app.port, appConfig.app.host, () => {
    console.log('orders api service listening on address ' +
        server.address().address +
        ":" + server.address().port);
});

process.on('uncaughtException', (err) => {
    console.log(err);
});

process.on('SIGINT', () => {
    console.log('App exited');
    process.exit(0);
});





