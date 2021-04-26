/**
* User class
*
* @author Paul Panaitescu
* @version 1.0 19 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const bcrypt = require('bcrypt');
const HOSTNAME = 'localhost';
const PORT = 3000;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***             User CRUD Functionality            ***
// ***                                                ***
// ******************************************************

/**
* CREATE new User
*
* Input:    username, password
* Output:   the Id of the new User,
* Errors:   Username can not be null!
*           Password can not be null!
*           User with this Username already exists!
*           User could not be created!
*           User with this ID does not exist!
*/
app.post("/user", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = `INSERT INTO user(username, password) VALUES(?, ?);`;
    console.log(username);
    console.log(password);

    // Check if Username and Password are null
    if(username.length == 0) {
        res.status(409).json({
            message: 'Username can not be null!'
        });
    } else if (password.length == 0) {
        res.status(409).json({
            message: 'Password can not be null!'
        });
    }

    // Check the count of Users with this Username
    connection.query(`SELECT COUNT(*) AS total FROM user WHERE username = ?;` , 
                    [username], function (err, result) {
        console.log('total: ', result[0].total);
        if (result[0].total > 0) {
            res.status(409).json({
                message: 'User with this Username already exists!',
            });
        } 
    });

    // Hash the Password
    let hashedPassword = bcrypt.hashSync(password, 10);
    
    // Create User
    connection.query(sql, [username, hashedPassword], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'User could not be created!',
                error: err.message
            });
            console.log(err.message);
        } else {
            console.log(`A new row has been inserted!`);
            // Get the last inserted User
            axios.get(`http://${HOSTNAME}:${PORT}/user/${result.insertId}`).then(response =>{
                console.log(response);
                res.status(201).send(response.data[0]);
            }).catch(err =>{
                if(err){
                    console.log(err);
                }
                res.status(400).json({
                    message: `User with this ID (${result.insertId}) does not exist!`
                });
            });
        }
    });
});

/**
* READ all Users
*
* Input:    -
* Output:   an array with all Users and their information,
* Errors:   There are no Users in the DB!
*/
app.get("/user", (req, res) => {
    let sql = `SELECT * FROM user`;
    connection.query(sql, function (err, users) {
        if (err) {
            res.status(400).json({
                message: 'There are no Users in the DB!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(users);
        }
    });
});

/**
* READ User by id
*
* Input:    id of the User
* Output:   an User and their information,
* Errors:   User with this ID does not exist!
*/
app.get("/user/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM user WHERE id = ?`;

    connection.query(sql, [req.params.id], function (err, user) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(user.length) {
                res.status(200).send(user[0]);
            } else {
                res.status(404).json({
                    message: `User with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

// TODO: add more cases to cover all errors
/**
* UPDATE User by id
*
* Input:    id, firstName, lastName, email, username,
*           birthday, gender, country, isAdmin
* Output:   Success if User was successfully updated!
* Errors:   Email can not be null!
*           User with this ID does not exist!
*           User with this Email already exists!
*           The User could not be updated!
*/
app.put("/user/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let username = req.body.username;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let country = req.body.country;
    let isAdmin = req.body.isAdmin;
    let sqlGet = `SELECT * FROM user WHERE id = ?`;
    let sqlUpdate = `UPDATE user SET firstName = ?, lastName = ?, email = ?, username = ?, 
                    birthday = ?, gender = ?, country = ?, isAdmin = ?, WHERE id = ?`;
    connection.query(sqlGet, [req.params.id], (err, user) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!user.length) {
                res.status(404).json({
                    message: `User with this ID (${req.params.id}) does not exist!`
                });
            } else {
                connection.query(sqlUpdate, [firstName, firstName, lastName, email, username, 
                                   birthday, gender, country, isAdmin, req.params.id], (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'The User could not be updated!',
                            error: err.message
                        });
                        console.log(err.message);
                    } else {
                        res.sendStatus(204);
                    }
                });
            }
        }
    });
});

/**
* DELETE User by id
*
* Input:   Id of the User to delete
* Output:  Success if User was successfully deleted!
* Erros:   User with this ID does not exist!
*          This User could not be deleted!
*/
app.delete("/user/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sqlGet = `SELECT * FROM user WHERE id = ?`;
    let sqlDelete = `DELETE FROM user WHERE id = ?`;
    connection.query(sqlGet, [req.params.id], (err, user) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!user.length) {
                res.status(404).json({
                    message: `User with this ID (${req.params.id}) does not exist!`
                });
            } else {
                connection.query(sqlDelete, req.params.id, (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'The User could not be deleted!',
                            error: err.message
                        });
                        console.log(err.message);
                    } else {
                        res.sendStatus(204);
                    }
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
