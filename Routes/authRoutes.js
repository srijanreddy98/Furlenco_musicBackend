const passport = require('passport');
const passport2 = require('passport');
const path = require('path');
const jwt = require('jsonwebtoken');
const { User, Playlist } = require('../models/models');
var routes = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    })
    );
    app.get('/', (req, res) => {
        res.redirect('/client/login');
    })
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
    app.get('/auth/twitter', passport.authenticate('twitter', {
        scope: ['profile', 'email']
    })
    );
    app.get(
        '/auth/twitter/callback',
        passport.authenticate('twitter'),
        (req, res) => {
            // console.log(req);
            res.redirect('/api/current_user');
        }
    );
    app.get('/auth/instagram', passport.authenticate('instagram', {
        scope: ['basic'],
        failWithError: true 
    })
    );
    app.get(
        '/auth/instagram/callback',
        passport.authenticate('instagram'),
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
            res.redirect('/client/user/dashboard');
            // res.send(req.user);
        }
    });
    app.get('/api/playlist', (req, res) => {
        console.log(req.query.id);
        
        Playlist.find({userId : req.query.id}).then(
            (docs) => {
                res.send(docs)
            },
            (err) => res.status(500).send(err)
        );
    });
    app.post('/api/createPlaylist', (req, res) => {
        var tags = [];
        for (let i of req.body.tags) {
            tags.push(i.name);
        }
        Playlist({
            userId: req.body.id,
            name: req.body.name,
            tags: tags,
            songs: []
        }).save().then(
            (doc) => {
                res.send(doc)
            },
            (err) => res.status(500).send(err)
        );
    });
    app.post('/api/addSong', (req, res) => {
        Playlist.findByIdAndUpdate(req.body.id, { $push: { songs: JSON.stringify({url: req.body.url, name:req.body.name}) } }, { new: true }).then(
            (docs) => { console.log(docs); res.status(201).send(docs); },
            (err) => { console.log(err);res.status(500).send(err); }
        );
    });
    app.post('/api/sharedPlaylist' ,(req, res) => {
        Playlist.findById(req.body.id).then(
            (doc) => {
                Playlist({
                    name: doc.name,
                    tags: doc.tags,
                    songs: doc.songs,
                    userId: req.body.user
                }).save().then(
                    (r) => res.send(r)
                );
            }
        );
    });
}
module.exports = {
    routes
}
