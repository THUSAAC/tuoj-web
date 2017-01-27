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
mongoose.connect('mongodb://127.0.0.1/tuoj');

autoIncrement.initialize(mongoose.connection);
var EXPRESS_SESSION = require("./config").EXPRESS_SESSION;
EXPRESS_SESSION.store = new MongoStore({ mongooseConnection: mongoose.connection });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// catch all error to avoid server crash
app.use(function(req, res, next) {
    try {
        next()
    } catch (err) {
        next(err)
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));
app.use(session(EXPRESS_SESSION));

// check user whether has proper privilege
var login_required = function(req,res,next){
    if (!req.session.user) {
        return res.redirect("/login");
    } else {
        next();
    }
};
var admin_required = function(req,res,next) {
    if (!req.session.is_admin) {
        return res.status(400).send('Access deined');
    }
    next();
};
/*app.use("/contests", login_required);
app.use("/addcontests", admin_required);
app.use("/problem_pool", admin_required);
app.use("/status", admin_required);
app.use("/rejudge", admin_required);
app.use("/broadcast", admin_required);
app.use("/editcontests", admin_required);*/

var staticAdminModules = [ 'rejudge', 'broadcast', 'delay' , 'user'];
staticAdminModules.forEach(function(moduleName) {
    app.get('/' + moduleName, admin_required, function(req, res, next) {
        res.render(moduleName, {
            user: req.session.user,
            is_admin: req.session.is_admin,
            call: req.session.call
        });
    });
    console.log('Static page ' + moduleName + ' loaded');
});

// add router
app.use("/problem_pool", require("./api/problem_pool"));
app.use('/addcontests',require("./api/addcontests"));
app.use('/contests',require("./api/contests"));
app.use('/api', require('./api/api'));
// app.use('/status',require('./api/status'));
// app.use('/rejudge',require('./api/rejudge'));
// app.use('/broadcast',require('./api/broadcast'));
app.use('/faq', require('./api/faq'));
app.use('/editcontests',require('./api/editcontests'))

app.use(function(req, res, next) {
	res.status(404).send('Page not found');
});

module.exports = app;
