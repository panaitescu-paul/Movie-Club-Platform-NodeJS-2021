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
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 3001;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// ******************************************************
// ***                                                ***
// ***             User CRUD Functionality            ***
// ***                                                ***
// ******************************************************

/**
* CREATE new User
*
* Input:    username, password
* Output:   the Id of the new User
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

    // Check if Username and Password are null
    if(username.length == 0) {
        res.status(409).json({
            message: 'Username can not be null!'
        });
        return 0;
    } else if (password.length == 0) {
        res.status(409).json({
            message: 'Password can not be null!'
        });
        return 0;
    }

    // Check the count of Users with this Username
    connection.query(`SELECT COUNT(*) AS total FROM user WHERE username = ?;` , 
                    [username], function (err, result) {
        if (result[0].total > 0) {
            res.status(409).json({
                message: 'User with this Username already exists!',
            });
        } else {
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
                    // Get the last inserted User
                    axios.get(`http://${HOSTNAME}:${PORT}/user/${result.insertId}`).then(response =>{
                        res.status(201).send(response.data);
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
        }
    });
});

/**
* READ all Users
*
* Input:    -
* Output:   an array with all Users and their information
* Errors:   There are no Users in the DB!
*/
app.get("/user", (req, res) => {
    let sql = `SELECT * FROM user ORDER BY id`;
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
* Output:   an User and their information
* Errors:   User with this ID does not exist!
*/
app.get("/user/:id", (req, res) => {
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

/**
* SEARCH Users by Username
*
* Input:    username of the User
* Output:   an array with all Users with this Username, and their information
* Errors:   Users with this Username do not exist!
*/
app.get("/user/username/search", (req, res) => {
    let sql = `SELECT * FROM user WHERE username LIKE ?`;

    connection.query(sql, ['%' + req.query.username + '%'], function (err, users) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(users.length) {
                res.status(200).send(users);
            } else {
                res.status(404).json({
                    message: `Users with this Username (${req.query.username}) do not exist!`
                });
            }
        }
    });
});

/**
* UPDATE User by id
*
* Input:    id, username, firstName, lastName,
*           gender, birthday, country
* Output:   Status 204 - Success if User was successfully updated!
* Errors:   Username can not be null!
*           User with this Username already exists!
*           User with this ID does not exist!
*           The User could not be updated!
*/
app.put("/user/:id", (req, res) => {
    let username = req.body.username;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let gender = req.body.gender;
    let birthday = req.body.birthday || null;
    let country = req.body.country;
    let sqlGet = `SELECT * FROM user WHERE id = ?`;
    let sqlUpdate = `UPDATE user SET username = ?, firstName = ?, lastName = ?, 
                    gender= ?, birthday = ?, country = ? WHERE id = ?`;
    
    // Check if Username is null
    if(username.length == 0) {
        res.status(409).json({
            message: 'Username can not be null!'
        });
        return 0;
    } 

    // Check the count of Users with this Username
    connection.query(`SELECT COUNT(*) AS total FROM user WHERE username = ? AND id != ?;` , 
                    [username, req.params.id], function (err, result) {
        if (result[0].total > 0) {
            res.status(409).json({
                message: 'User with this Username already exists!',
            });
        } else {

            // Get User
            connection.query(sqlGet, [req.params.id], function (err, user) {
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

                        // Update User
                        connection.query(sqlUpdate, [username, firstName, lastName, gender,
                                        birthday, country, req.params.id], function (err) {
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
        }
    });
});

/**
* DELETE User by id
*
* Input:    Id of the User to delete
* Output:   Status 204 - Success if User was successfully deleted!
* Erros:    User with this ID does not exist!
*           The User could not be deleted!
*/
app.delete("/user/:id", (req, res) => {
    let sqlGet = `SELECT * FROM user WHERE id = ?`;
    let sqlDelete = `DELETE FROM user WHERE id = ?`;
    
    connection.query(sqlGet, [req.params.id], function(err, user) {
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
                connection.query(sqlDelete, [req.params.id], function(err) {
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

// ******************************************************
// ***                                                ***
// ***             User Extra Functionality           ***
// ***                                                ***
// ******************************************************

/**
* Login User
*
* Input:    username, password
* Output:   true    - if the Password and Username are matching
*           false   - if the Password and Username are not matching
* Errors:   User with this Username does not exist!
*/
app.post("/user/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = `SELECT * FROM user WHERE username = ?`;

    connection.query(sql, [username], function (err, user) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!user.length) {
                res.status(404).json({
                    message: `User with this Username does not exist!`
                });
            } else {
                let passwordMatch = bcrypt.compareSync(password, user[0].password);
                if (passwordMatch) {
                    res.status(200).json({
                        result: true,
                        message: `Password and Username are matching!`,
                        memberUser: user[0]
                    });
                } else {
                    res.status(403).json({
                        result: false,
                        message: `Password and Username are not matching!`
                    });
                }
            }
        }
    });
});

/**
* UPDATE User Password by id
*
* Input:    id, oldPassword, newPassword
* Output:   Status 204 - Success if User was successfully updated!
* Errors:   Old Password can not be null!
*           New Password can not be null!
*           Old Password and New Password are the same!
*           User with this ID does not exist!
*           Old Password is not matching this User!
*           User could not be updated!
*/
app.put("/user/password/:id", (req, res) => {
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let sqlGet = `SELECT password FROM user WHERE id = ?`;
    let sqlUpdate = `UPDATE user SET password = ? WHERE id = ?`;
    
    // Check if Old Password and New Password are null
    if(oldPassword.length == 0) {
        res.status(409).json({
            message: 'Old Password can not be null!'
        });
        return 0;
    } else if(newPassword.length == 0) {
        res.status(409).json({
            message: 'New Password can not be null!'
        });
        return 0;
    } 

    // Check if Old Password and New Password are the same
    if(oldPassword == newPassword) {
        res.status(409).json({
            message: 'Old Password and New Password are the same!'
        });
        return 0;
    }

    // Get the Old Password of the User
    connection.query(sqlGet, [req.params.id], function (err, user) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(!user.length) {
                res.status(404).json({
                    message: `User with this ID (${req.params.id}) does not exist!`
                });
            } else {
                let passwordMatch = bcrypt.compareSync(oldPassword, user[0].password);
                if (passwordMatch) {
                    // Old Password is matching this User

                    // Hash the Password
                    let hashedNewPassword = bcrypt.hashSync(newPassword, 10);
                    connection.query(sqlUpdate, [hashedNewPassword, req.params.id], function (err) {
                        if (err) {
                            res.status(400).json({
                                message: 'User could not be updated!',
                                error: err.message
                            });
                            console.log(err.message);
                        } else {
                            res.sendStatus(204);
                        }
                    });
                } else {
                    res.status(403).json({
                        message: `Old Password is not matching this User!`
                    });
                }

            }
        }
    });
});

// Server connection
app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});