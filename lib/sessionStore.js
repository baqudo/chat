var mongoose = require('mongoose');
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var config = require('config');
// console.log(mongoose.connection)

// const {
//     host,
//     port
// } = mongoose.connection;
// console.log(mongoose.connection)
// const connection = {
//     host,
//     port,
//     db: mongoose.connection,
//     url: "mongodb://localhost:27017/chat"
// };
// console.log({connection})
// var sessionStore = new MongoStore({
//     host: '127.0.0.1',
//     port: '27017',
//     db: 'session',
//     url: 'mongodb://localhost:27017/demo'
// });
// var sessionStore = new MongoStore({mongoose_connection: mongoose.connection});

var sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'session',
})
module.exports = sessionStore;