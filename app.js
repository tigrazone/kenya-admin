/**
 * app
 */

'use strict';

let express = require('express')
    , compression = require('compression')
    , path = require('path')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')()
    , bodyParser = require('body-parser')
    , serveIndex = require('serve-index')
    , session = require('express-session')({
        resave: false,
        saveUninitialized: true,
        httpOnly: false,
        secret: '12d5c4c313044a10437a26cedfb1615e8bfaabbf'
    })

    , status = require('http-status')
    , users = require('./routes/users')
    , feeds = require('./routes/feeds')
    , stream = require('./routes/stream')
    , articles = require('./routes/articles')
    , share = require('./routes/share')
    , comments = require('./routes/comments')
    , files = require('./routes/files')
    , friendships = require('./routes/friendships')
    , overlays = require('./routes/overlays')

    , app = express()
    , cors = require('cors');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


app.use(compression()); //gzip on

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors({
    credentials: true,
    // origin: 'http://127.0.0.1:3000'
}));
app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.raw({limit: '50mb'}));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser);

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(function (request, response, next) {
    const url = request.url
        , method = request.method
        , isCheckEmail = url.indexOf('/api/users/check/email') !== -1 && method === 'GET'
        , isCheckNickname = url.indexOf('/api/users/check/nickname') !== -1 && method === 'GET'
        , isRegistration = url === '/api/users' && method === 'POST'
        , isNewStream = url.indexOf('/api/stream/new') !== -1 && method === 'GET'
        , isAuthorization = url === '/api/users/authorization' && method === 'POST'
        , isStaticFiles = url.indexOf('api') === -1 && method === 'GET'
        // , isStaticFiles = (url.indexOf('.html') !== -1 || url.indexOf('.css') !== -1 || url.indexOf('.js') !== -1) && method === 'GET'
        , isLogs = url.indexOf('logs') !== -1
        , userId = request.session ? parseInt(request.session.userId) : null;

		
    if (userId || isNewStream || isRegistration || isAuthorization || isCheckEmail || isCheckNickname || isStaticFiles || isLogs) {
        next();
    } else {
        return response.sendStatus(status.UNAUTHORIZED);
    }
});

app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/api/users', users);
app.use('/api/feeds', feeds);
app.use('/api/articles', articles);
app.use('/api/comments', comments);
app.use('/api/stream', stream);
app.use('/api/files', files);
app.use('/api/friendships', friendships);
app.use('/api/overlays', overlays);
app.use('/logs', serveIndex(path.join(__dirname, 'frontend/logs'), {'icons': true}));

app.use('/share', share);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// error handler
app.use(function (error, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    // render the error page
    res.status(error.status || 500);
    res.render('error');
});

module.exports = [app, session, cookieParser];
