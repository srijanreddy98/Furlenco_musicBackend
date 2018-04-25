const passport = require('passport');
const path = require('path');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
var routes = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    })
    );
    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            // console.log(req);
            res.redirect('/api/current_user');
        }
    );
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    })
    );
    app.get(
        '/auth/facebook/callback',
        passport.authenticate('facebook'),
        (req, res) => {
            // console.log(req);
            res.redirect('/api/current_user');
        }
    );
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send('Logged Out');
    });
    app.get('/api/current_user', (req, res) => {
        if (req.query.client) {
            res.send(req.user);
        } else {
            // res.redirect('/client/user/attendance');
            res.send(req.user);
        }
    });
}
module.exports = {
    routes
}
