const express = require("express");
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const HOSTNAME = 'localhost';
const PORT = 4000;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, '../client') + '/index.html');
});

app.post('/login/member',(req,res) => {
    console.log(req.body);
    req.session.loggedInMember = req.body;
    if(req.session.loggedInMember) {
        res.end('Member session created!');
    } else {
        res.end('Member session not created!');
    }
});

app.post('/login/admin',(req,res) => {
    console.log(req.body);
    req.session.loggedInAdmin = req.body;
    if(req.session.loggedInAdmin) {
        res.end('Admin session created!');
    } else {
        res.end('Admin session not created!');
    }
});

app.get('/member',(req,res) => {
    console.log(req.session.loggedInMember);
    if(req.session.loggedInMember) {
        // res.end('Member session available!');
        res.status(200).json({
            message: "Member session available!",
            member: req.session.loggedInMember
        });
    } else {
        res.end('Member session not available!');
    }
});

app.get('/admin',(req,res) => {
    console.log(req.session.loggedInAdmin);
    if(req.session.loggedInAdmin) {
        res.end('Admin session available!');
    } else {
        res.end('Admin session not available!');
    }
});

app.get('/logout',(req,res) => {
    console.log("here");
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});