const express = require("express");
const session = require('express-session');
const path = require('path');
const HOSTNAME = 'localhost';
const PORT = 3000;
let app = express();
app.use(express.json());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, '../client')));
let sess;

app.get('/',(req,res) => {
    sess = req.session;
    if(sess.email) {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, '../client') + '/index.html');
});

app.post('/login',(req,res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
});

app.get('/admin',(req,res) => {
    sess = req.session;
    if(sess.email) {
        res.write(`<h1>Hello ${sess.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }
});

app.get('/logout',(req,res) => {
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