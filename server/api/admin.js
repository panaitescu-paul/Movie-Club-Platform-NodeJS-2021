const connection = require("../db/db_connection");
const express = require("express");
const bcrypt = require('bcrypt');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const HOSTNAME = 'localhost';
const PORT = 5001;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// CREATE Admin User
app.post("/admin", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let hashedPassword = bcrypt.hashSync(password, 10);
    let stmt = `INSERT INTO admin(username, password, createdAt) VALUES(?, ?, ?);`;

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let currentDateAndTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    connection.query(`SELECT COUNT(*) AS total FROM admin WHERE username = ?;`, [username], function (err, result) {
        if (result[0].total > 0) {
            res.status(409).json({
                message: 'An admin with this Username already exists!',
            });
        } else {
            connection.query(stmt, [username, hashedPassword, currentDateAndTime], function (err, result) {
                if (err) {
                    res.status(400).json({
                        message: 'The admin user could not be created!',
                        error: err.message
                    });
                    console.log(err);
                } else {
                    axios.get(`http://${HOSTNAME}:${PORT}/admin/${result.insertId}`).then(response =>{
                        res.status(201).send(response.data);
                    }).catch(err =>{
                        if(err){
                            console.log(err);
                        }
                        res.status(400).json({
                            message: `There is no User with the id ${result.insertId}`
                        });
                    });
                }
            });
        }
    });
});

// Login Admin User
app.post("/admin/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let stmt = `SELECT * FROM admin`;

    connection.query(stmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The admin users could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            let isFound = false;
            results.forEach((result) => {
                if (username === result.username) {
                    isFound = true;
                    let passwordMatch = bcrypt.compareSync(password, result.password);
                    if (passwordMatch) {
                        res.status(200).json({
                            message: "Successful!",
                            adminUser: result
                        });
                    } else {
                        res.status(403).json({
                            message: "Wrong password!"
                        });
                    }
                }
            });
            if (!isFound) {
                res.status(404).json({
                    message: "No admin user found with that username!"
                });
            }
        }
    });
});

// READ All Admin Users
app.get("/admin", (req, res) => {
    let stmt = `SELECT * FROM admin`;
    connection.query(stmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The admin users could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// READ One Admin User
app.get("/admin/:id", (req, res) => {
    let stmt = `SELECT * FROM admin WHERE id = ?`;
    connection.query(stmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The admin user could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).json({
                    message: `No admin user found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Search Admin User
app.get("/admin/username/search", (req, res) => {
    let stmt = `SELECT * FROM admin WHERE username LIKE ?`;
    connection.query(stmt, ['%' + req.query.username + '%'], function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The admin users could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(results.length) {
                res.status(200).send(results);
            } else {
                res.status(404).json({
                    message: `Admins with this Username (${req.query.username}) do not exist!`
                });
            }
        }
    });
});

// Update Admin User
app.put("/admin/:id", (req, res) => {
    let username = req.body.username;
    let getOneStmt = `SELECT * FROM admin WHERE id = ?`;
    let updateStmt = `UPDATE admin SET username = ? WHERE id = ?`;

    // Check the count of Admins with this Username
    connection.query(`SELECT COUNT(*) AS total FROM admin WHERE username = ?;`, [username], function (err, result) {
        if (result[0].total > 0) {
            res.status(409).json({
                message: 'An admin with this Username already exists!',
            });
        } else {
            connection.query(getOneStmt, [req.params.id], function (err, result) {
                if (err) {
                    res.status(400).json({
                        message: 'The admin user could not be showed!',
                        error: err.message
                    });
                    console.log(err);
                } else {
                    if(result.length) {
                        connection.query(updateStmt, [username, req.params.id], function (err, result) {
                            if (err) {
                                res.status(400).json({
                                    message: 'The admin user could not be updated!',
                                    error: err.message
                                });
                                console.log(err);
                            } else {
                                res.sendStatus(204);
                            }
                        });
                    } else {
                        res.status(404).json({
                            message: `No admin user found with the id ${req.params.id}!`
                        });
                    }
                }
            });
        }
    });
});

// Update Admin Password
app.put("/admin/password/:id", (req, res) => {
    let username = req.body.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let getOneStmt = `SELECT * FROM admin WHERE id = ?`;
    let updateStmt = `UPDATE admin SET password = ? WHERE id = ?`;

    // Check if Old Password and New Password are the same
    if(oldPassword === newPassword) {
        res.status(409).json({
            message: 'The old password and the new password should not be the same!'
        });
    } else {
        axios.post('http://localhost:8000/admin/login', {username: username, password: oldPassword}).then(response =>{
            if (response.status === 200) {
                connection.query(getOneStmt, [req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The admin user could not be showed!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        if(result.length) {
                            let hashedPassword = bcrypt.hashSync(newPassword, 10);
                            connection.query(updateStmt, [hashedPassword, req.params.id], function (err, result) {
                                if (err) {
                                    res.status(400).json({
                                        message: 'The admin user could not be updated!',
                                        error: err.message
                                    });
                                    console.log(err);
                                } else {
                                    res.sendStatus(204);
                                }
                            });
                        } else {
                            res.status(404).json({
                                message: `No admin user found with the id ${req.params.id}!`
                            });
                        }
                    }
                });
            } else {
                res.status(403).json({
                    message: "Wrong old password!"
                });
            }
        }).catch(err =>{
            if(err){
                console.log(err);
            }
            res.status(403).json({
                message: "Forbidden"
            });
        });
    }
});

// Delete Admin User
app.delete("/admin/:id", (req, res) => {
    let getOneStmt = `SELECT * FROM admin WHERE id = ?`;
    let deleteStmt = `DELETE FROM admin WHERE id = ?`;
    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The admin user could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                connection.query(deleteStmt, [req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The admin user could not be deleted!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No admin user found with the id ${req.params.id}!`
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
