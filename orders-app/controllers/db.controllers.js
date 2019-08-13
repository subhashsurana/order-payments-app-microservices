const mongoose = require("mongoose");
var dbConfig;
var dbConnection;
var dbUrl;

exports.init = config => {
  console.log("db module initialized.");
  dbConfig = config;
  dbUrl = "mongodb://" + dbConfig.mongo.host + ":" + dbConfig.mongo.port + "/" + dbConfig.mongo.dbMain;
  mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
  
  dbConnection = mongoose.connection;
  
  console.log("mongodb connected and listening on address " + dbConfig.mongo.host
                                                      + ":" + dbConfig.mongo.port);
  dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
