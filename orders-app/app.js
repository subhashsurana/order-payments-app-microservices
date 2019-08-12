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

var app = express();
var appConfig = config.get(app.get('env'));
var logStream = fs.createWriteStream(path.join(__dirname, 'logs'), { flags: 'a' });

app.set(helmet());
app.use(morgan('dev', { stream: logStream }));
app.use(bodyParser.json({ limit: appConfig.app.http.jsonLimit }));
app.use(bodyParser.urlencoded({ limit: appConfig.app.http.jsonLimit, extended: true }));
app.use(cookieParser());

//set cors
app.use(cors(httpHelper.corsOptions()));

//routes
const orderRoute = require('./routes/order');
app.use('/api/order/', orderRoute);


//http error handlers
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not found');
    console.log(err)
    err.status = 404;
    next(err);
 });

//production error handler
app.use((req, res, next) => {
    res.status(err.status || 500);
    res.send(err);
});

// init database connection
var db = require('./modules/db');
var orchestrator = require('./modules/orchestrator');

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





