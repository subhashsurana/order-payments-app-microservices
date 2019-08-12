var dbController = require('./dbController');
var db = require('../modules/db');
var dbError = 'DB Error. Details: ';

exports.create = async (entity, data) => {
    try {
        var dbConn = db.collection(entity);
        var result = await dbController.create(dbConn, data);
        return {
            id: result.ops[0].id
        };
        
    } catch (err) {
        await Promise.reject(new Error(dbError + err));
    }
};

exports.update = async (entity, data, criteria) => {
    try {
        var dbConn = db.collection(entity);
        var result = await dbController.update(dbConn, data, criteria);
    } catch (err) {
        await Promise.reject(new Error(dbError + err));
    }
};

exports.remove = async (entity, criteria) => {
  try {
    var dbConn = db.collection(entity);
    var result = await dbController.remove(dbConn, criteria);
  } catch (err) {
    await Promise.reject(new Error(dbError + err));
  }
};

exports.find = async (entity, criteria) => {
  console.log(criteria);
  try {
    var dbConn = db.collection(entity);
    var result = await dbController.findOne(dbConn, criteria);
  } catch (err) {
    await Promise.reject(new Error(dbError + err));
  }
};