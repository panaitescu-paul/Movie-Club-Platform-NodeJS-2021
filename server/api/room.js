const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 5003;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// CREATE Room
app.post("/room", (req, res) => {
    let name = req.body.name;
    let userId = req.body.userId;
    let stmt = `INSERT INTO room(name, userId, createdAt) VALUES(?, ?, ?);`;

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let currentDateAndTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    connection.query(stmt, [name, userId, currentDateAndTime], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The room could not be created!',
                error: err.message
            });
            console.log(err);
        } else {
            console.log("A new room record inserted, ID: " + result.insertId );
            axios.get(`http://${HOSTNAME}:${PORT}/room/${result.insertId}`).then(response =>{
                res.status(201).send(response.data);
            }).catch(err =>{
                if(err){
                    console.log(err);
                }
                res.status(400).json({
                    message: `There is no Room with the id ${result.insertId}`
                });
            });
        }
    });
});

// READ All Rooms
app.get("/room", (req, res) => {
    let stmt = `SELECT * FROM room`;
    connection.query(stmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The rooms could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// READ One Room
app.get("/room/:id", (req, res) => {
    let stmt = `SELECT * FROM room WHERE id = ?`;
    connection.query(stmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The room could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).json({
                    message: `No room found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Update Room
app.put("/room/:id", (req, res) => {
    let name = req.body.name;
    let getOneStmt = `SELECT * FROM room WHERE id = ?`;
    let updateStmt = `UPDATE room SET name = ? WHERE id = ?`;
    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The room could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                connection.query(updateStmt, [name, req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The room could not be updated!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No room found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Delete Room
app.delete("/room/:id", (req, res) => {
    let getOneStmt = `SELECT * FROM room WHERE id = ?`;
    let deleteStmt = `DELETE FROM room WHERE id = ?`;
    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The room could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                connection.query(deleteStmt, [req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The room could not be deleted!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No room found with the id ${req.params.id}!`
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
