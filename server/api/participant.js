const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 5005;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// CREATE Participant
app.post("/participant", (req, res) => {
    let userId = req.body.userId;
    let roomId = req.body.roomId;
    let getAllStmt = `SELECT * FROM participant`;
    let stmt = `INSERT INTO participant(userId, roomId, createdAt) VALUES(?, ?, ?);`;

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let currentDateAndTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;


    connection.query(getAllStmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The participants could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            let isFound = false;
            results.forEach((result) => {
                if (result.userId === userId && result.roomId === roomId) {
                    isFound = true;
                }
            });

            if (isFound) {
                res.status(400).json({
                    message: 'This user is already part of this room!',
                });
            } else {
                connection.query(stmt, [userId, roomId, currentDateAndTime], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The participant could not be created!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        console.log("A new participant record inserted, ID: " + result.insertId );
                        axios.get(`http://${HOSTNAME}:${PORT}/participant/${result.insertId}`).then(response =>{
                            res.status(201).send(response.data);
                        }).catch(err =>{
                            if(err){
                                console.log(err);
                            }
                            res.status(400).json({
                                message: `There is no Participant with the id ${result.insertId}`
                            });
                        });
                    }
                });
            }
        }
    });
});

// READ All Participants
app.get("/participant", (req, res) => {
    let stmt = `SELECT * FROM participant`;
    connection.query(stmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The participants could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// READ One Participant
app.get("/participant/:id", (req, res) => {
    let stmt = `SELECT * FROM participant WHERE id = ?`;
    connection.query(stmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The participant could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).json({
                    message: `No participant found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Get all users of a room
app.get("/participant/roomId/:roomId", (req, res) => {
    let stmt = `SELECT * FROM participant WHERE roomId = ?`;
    connection.query(stmt, [req.params.roomId], function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The participants could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(results.length) {
                res.status(200).send(results);
            } else {
                res.status(404).json({
                    message: `No room found with the id ${req.params.roomId}!`
                });
            }
        }
    });
});

// Get all rooms of a user
app.get("/participant/userId/:userId", (req, res) => {
    let stmt = `SELECT * FROM participant WHERE userId = ?`;
    connection.query(stmt, [req.params.userId], function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The participants could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(results.length) {
                res.status(200).send(results);
            } else {
                res.status(404).json({
                    message: `No user found with the id ${req.params.userId}!`
                });
            }
        }
    });
});

// Delete Participant
app.delete("/participant/:id", (req, res) => {
    let getOneStmt = `SELECT * FROM participant WHERE id = ?`;
    let deleteStmt = `DELETE FROM participant WHERE id = ?`;
    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The participant could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                connection.query(deleteStmt, [req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The participant could not be deleted!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No participant found with the id ${req.params.id}!`
                });
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
