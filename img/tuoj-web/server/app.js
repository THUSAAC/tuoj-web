var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var autoIncrement = require("mongoose-auto-increment");

var app = express();

// app.set('env', 'release');

// set up mongo connection and session
var dbURL = 'mongodb://127.0.0.1/tuoj';
if (process.env.DBURL) {
	dbURL = process.env.DBURL;
}
mongoose.connect(dbURL);

autoIncrement.initialize(mongoose.connection);
var EXPRESS_SESSION = require("./config").EXPRESS_SESSION;
EXPRESS_SESSION.store = new MongoStore({ mongooseConnection: mongoose.connection });

app.use(bodyParser.urlencoded({ 
    extended: false,
    limit: 128 * 1024 * 1024
}));
app.use(bodyParser.json({
    limit: 128 * 1024 * 1024
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../client')));
app.use('/staticdata', express.static(path.resolve(__dirname, '../staticdata')));
app.use(session(EXPRESS_SESSION));

// add router
app.use('/api', require('./api'));

app.use(function(req, res, next) {
	res.status(404).send('Page not found');
});

module.exports = app;
