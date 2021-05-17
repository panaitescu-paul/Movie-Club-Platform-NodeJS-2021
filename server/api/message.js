const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 5004;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// CREATE Message
app.post("/message", (req, res) => {
    let userId = req.body.userId;
    let roomId = req.body.roomId;
    let content = req.body.content;
    let stmt = `INSERT INTO message(userId, roomId, content, modifiedAt, createdAt) VALUES(?, ?, ?, ?, ?);`;

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let currentDateAndTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    connection.query(stmt, [userId, roomId, content, currentDateAndTime, currentDateAndTime], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The message could not be created!',
                error: err.message
            });
            console.log(err);
        } else {
            console.log("A new message record inserted, ID: " + result.insertId );
            axios.get(`http://${HOSTNAME}:${PORT}/message/${result.insertId}`).then(response =>{
                res.status(201).send(response.data);
            }).catch(err =>{
                if(err){
                    console.log(err);
                }
                res.status(400).json({
                    message: `There is no Message with the id ${result.insertId}`
                });
            });
        }
    });
});

// READ All Messages
app.get("/message", (req, res) => {
    let stmt = `SELECT * FROM message`;
    connection.query(stmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The messages could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// READ One Message
app.get("/message/:id", (req, res) => {
    let stmt = `SELECT * FROM message WHERE id = ?`;
    connection.query(stmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The message could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).json({
                    message: `No message found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Update Message
app.put("/message/:id", (req, res) => {
    let content = req.body.content;
    let getOneStmt = `SELECT * FROM message WHERE id = ?`;
    let updateStmt = `UPDATE message SET content = ?, modifiedAt = ? WHERE id = ?`;

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let currentDateAndTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The message could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                connection.query(updateStmt, [content, currentDateAndTime, req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The message could not be updated!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No message found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Delete Message
app.delete("/message/:id", (req, res) => {
    let getOneStmt = `SELECT * FROM message WHERE id = ?`;
    let deleteStmt = `DELETE FROM message WHERE id = ?`;
    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The message could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                connection.query(deleteStmt, [req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The message could not be deleted!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No message found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// READ All messages from a room
app.get("/message/room/:roomId", (req, res) => {
    let stmt = `SELECT * FROM message WHERE roomId = ? ORDER BY createdAt`;
    let sqlGetRoom = `SELECT * FROM room WHERE id = ?`;

    // Check if there is a Room with this id
    connection.query(sqlGetRoom, [req.params.roomId], function (err, room) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if (!room.length) {
                res.status(404).json({
                    message: `Room with this ID (${req.params.roomId}) does not exist!`
                });
            } else {
                connection.query(stmt, [req.params.roomId], function (err, results) {
                    if (err) {
                        res.status(400).json({
                            message: 'The messages for this room could not be showed!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.status(200).send(results);
                    }
                } );
            }
        }
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
