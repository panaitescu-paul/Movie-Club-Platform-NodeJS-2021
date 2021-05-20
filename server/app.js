const express = require("express");
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const HOSTNAME = 'localhost';
const PORT = 4000;
let app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 2600}),
    saveUninitialized: false,
    resave: false
}));

io.on('connection', (socket) => {
    console.log("New WebSocket connection");

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
        console.log(data);
    });

    socket.on('chat update delete', () => {
        io.emit('chat update delete');
    });

    socket.on('chat participant', () => {
        console.log("here")
        io.emit('chat participant');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
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
        res.status(200).json({
            message: "Admin session available!",
            admin: req.session.loggedInAdmin
        });
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

server.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});