var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/users');

var http = require('http'),
    mongoskin = require('mongoskin'),
    dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
    db = mongoskin.db(dbUrl, {safe: true}),
    collections = {
        articles: db.collection('articles'),
        users: db.collection('users')
    };

// Other middlewares
var session = require('express-session'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override');

var app = express();
app.locals.appTitle = 'blog-express';

// Middleware for Monogoskin/MongoDB
app.use(function(req,res,next) {
    if (!collections.articles || !collections.users) return next(new Error('No collections.'))
    req.collections = collections;
    return next();
});

// view engine setup
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if('development' == app.get('env')) {
    app.use(errorHandler());
}

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//Pages & Routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('logout', routes.user.logout);
app.get('/admin', routes.article.admin);
app.post('/admin', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

//REST API Routes
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);

app.all('*', function(req, res) {
    res.send(404);
});

// http.createServer(app).listen(app.get('port'), function(){
// console.log('Express server listening on port ' + app.get('port'));
// });

var server = http.createServer(app);
var boot = function () {
    server.listen(app.get('port'), function(){
        console.info('Express server listening on port ' + app.get('port'));
    });
}
var shutdown = function() {
    server.close();
}
if (require.main === module) {
    boot();
} else {
    console.info('Running app as a module')
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}
module.exports = app;