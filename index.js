const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const { keys } = require('./keys/keys');
var bodyParser = require('body-parser');
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://srijanreddy98:chintu98@ds155699.mlab.com:55699/furlenco');
require('./services/passport');
const { routes } = require('./Routes/authRoutes');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(
    cookieSession({
        maxAge: 30 * 24 * 3600 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(cookieParser());
// app.use(express.static(__dirname + '/dist'));
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname + '/dist', 'index.html'));
// });
app.use(passport.initialize());
app.use(passport.session());
routes(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is up on port:${PORT}`));