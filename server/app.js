const express = require("express");
const session = require('express-session');
const path = require('path');
const redis = require('redis');
const bodyParser = require('body-parser');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const HOSTNAME = 'localhost';
const PORT = 3000;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client')));

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

app.get('/',(req,res) => {
    let sess = req.session;
    if(sess.email) {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, '../client') + '/index.html');
});

app.post('/login',(req,res) => {
    console.log(req.session);
    req.session.email = req.body.email;
    res.end('done');
});

app.get('/admin',(req,res) => {
    console.log(req.session);
    console.log(req.session.email);
    if(req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }
});

app.get('/logout',(req,res) => {
    console.log("here")
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