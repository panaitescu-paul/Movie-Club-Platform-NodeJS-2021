/**
* Rating class
*
* @author Paul Panaitescu
* @version 1.0 19 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 3002;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// ******************************************************
// ***                                                ***
// ***             Rating CRUD Functionality          ***
// ***                                                ***
// ******************************************************

/**
* CREATE new Rating (Add a Rating to a Movie)
*               
* Input:    userId 
*           movieId 
*           value - a number between 0-10
* Output:   the Id of the new Rating
* Errors:   The field Value must be a number between 0-10!
*           User with this ID does not exist!
*           Movie with this ID does not exist!
*           Rating from this User is already attached to this Movie!
*           The Rating could not be created!
*/
app.post("/rating", (req, res) => {
    let userId = req.body.userId;
    let movieId = req.body.movieId;
    let value = req.body.value;
    let sqlGetUser = `SELECT * FROM user WHERE id = ?`;
    let sqlGetMovie = `SELECT * FROM movie WHERE id = ?`;
    let sqlAddRating = `INSERT INTO rating(userId, movieId, value) VALUES(?, ?, ?)`;

    // Check if Value is a number between 0-10
    if (isNaN(value) || value < 0 || value > 10) {
        res.status(409).json({
            message: 'The field Value must be a number between 0-10!'
        });
        return 0;
    }

    // Check if there is a User with this id
    connection.query(sqlGetUser, [userId], function (err, user) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!user.length) {
                res.status(404).json({
                    message: `User with this ID (${userId}) does not exist!`
                });
            } else {
                // Check if there is a Movie with this id
                connection.query(sqlGetMovie, [movieId], function(err, movie) {
                    if (err) {
                        res.status(400).json({
                            error: err
                        });
                        console.log(err);
                    } else {
                        if(!movie.length) {
                            res.status(404).json({
                                message: `Movie with this ID (${movieId}) does not exist!`
                            });
                        } else {

                           // Check if this User added a rating to this movie already
                           connection.query(`SELECT COUNT(*) AS total FROM rating WHERE userId = ? AND movieId = ?;` , 
                                           [userId, movieId], function (err, result) {
                               console.log('total: ', result[0].total);
                               if (result[0].total > 0) {
                                   res.status(409).json({
                                       message: 'Rating from this User is already attached to this Movie!',
                                   });
                               } else {

                                   // Add Rating to Movie
                                   connection.query(sqlAddRating, [userId, movieId, value], function (err, result) {
                                       if (err) {
                                           res.status(400).json({
                                               message: 'The Rating could not be created!',
                                               error: err.message
                                           });
                                           console.log(err.message);
                                       } else {
                                           console.log(`A new row has been inserted!`);
                                           // Get the last inserted Rating
                                           axios.get(`http://${HOSTNAME}:${PORT}/rating/${result.insertId}`).then(response =>{
                                               console.log(response);
                                               res.status(201).send(response.data);
                                           }).catch(err =>{
                                               if(err){
                                                   console.log(err);
                                               }
                                               res.status(400).json({
                                                   message: `Rating with this ID (${result.insertId}) does not exist!`
                                               });
                                           });
                                       }
                                   });
                               }
                           });
                        }
                    }
                });
            }
        }
    });



});

/**
* READ all Ratings
*
* Output:   an array with all Ratings and their information
* Errors:   There are no Ratings in the DB!
*/
app.get("/rating", (req, res) => {
    let sql = `SELECT * FROM rating ORDER BY id`;
    connection.query(sql, function(err, ratings) {
        if (err) {
            res.status(400).json({
                message: 'There are no Ratings in the DB!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(ratings);
        }
    });
});

/**
* READ Rating by id
*
* Input:    id of the Rating
* Output:   an Rating and their information
* Errors:   Rating with this ID does not exist!
*/
app.get("/rating/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM rating WHERE id = ?`;

    connection.query(sql, [req.params.id], function(err, rating) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(rating.length) {
                res.status(200).send(rating[0]);
            } else {
                res.status(404).json({
                    message: `Rating with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

/**
* UPDATE Rating by id
*
* Input:    id - Id of the Rating
*           value - a number between 0-10
* Output:   Status 204 - Success if Rating was successfully updated!
* Errors:   The field Value must be a number between 0-10!
*           Rating with this ID does not exist!
*           The Rating could not be updated!
*/
app.put("/rating/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let value = req.body.value;
    let sqlGet = `SELECT * FROM rating WHERE id = ?`;
    let sqlUpdate = `UPDATE rating SET value = ? WHERE id = ?`;
    
    // Check if Value is a number between 0-10
    if (isNaN(value) || value < 0 || value > 10) {
        res.status(409).json({
            message: 'The field Value must be a number between 0-10!'
        });
        return 0;
    }

    connection.query(sqlGet, [req.params.id], (err, rating) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!rating.length) {
                res.status(404).json({
                    message: `Rating with this ID (${req.params.id}) does not exist!`
                });
            } else {
                connection.query(sqlUpdate, [value, req.params.id], function(err) {
                    if (err) {
                        res.status(400).json({
                            message: 'The Rating could not be updated!',
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
* DELETE Rating by id
*
* Input:    Id of the Rating to delete
* Output:   Status 204 - Success if Rating was successfully deleted!
* Erros:    Rating with this ID does not exist!
*           This Rating could not be deleted!
*/
app.delete("/rating/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sqlGet = `SELECT * FROM rating WHERE id = ?`;
    let sqlDelete = `DELETE FROM rating WHERE id = ?`;
    
    connection.query(sqlGet, [req.params.id], function(err, rating) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!rating.length) {
                res.status(404).json({
                    message: `Rating with this ID (${req.params.id}) does not exist!`
                });
            } else {
                connection.query(sqlDelete, req.params.id, function(err) {
                    if (err) {
                        res.status(400).json({
                            message: 'The Rating could not be deleted!',
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
// ***             Rating Extra Functionality         ***
// ***                                                ***
// ******************************************************

/**
* READ all Ratings for a Movie
*
* Output:   an array with all Ratings from a Movie and their information
* Errors:   There are no Ratings for this Movie!
*/
app.get("/rating/movie/:id", (req, res) => {
    let sql = `SELECT * FROM rating WHERE movieId = ?`;
    connection.query(sql, [req.params.id], function(err, ratings) {
        if (err) {
            res.status(400).json({
                message: 'There are no Ratings for this Movie!',
                error: err.message
            });
            console.log(err);
        } else {
            if(ratings.length) {
                res.status(200).send(ratings);
            } else {
                res.status(404).json({
                    message: `There are no Ratings for this Movie!`
                });
            }
        }
    });
});

/**
 * READ Rating by movieId and userId
 *
 * Input:    id of the Movie and id of the User
 * Output:   an Rating and their information
 * Errors:   Movie or User with this ID does not exist!
 */
app.get("/rating/movie/:movieId/user/:userId", (req, res) => {
    console.log("req.params.movieId: ", req.params.movieId);
    console.log("req.params.userId: ", req.params.userId);
    let sql = `SELECT * FROM rating WHERE movieId = ? AND userId = ?`;
    let sqlGetUser = `SELECT * FROM user WHERE id = ?`;
    let sqlGetMovie = `SELECT * FROM movie WHERE id = ?`;

    // Check if there is a Movie with this id
    connection.query(sqlGetMovie, [req.params.movieId], function(err, movie) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!movie.length) {
                res.status(404).json({
                    message: `Movie with this ID (${req.params.movieId}) does not exist!`
                });
            } else {

                // Check if there is a User with this id
                connection.query(sqlGetUser, [req.params.userId], function (err, user) {
                    if (err) {
                        res.status(400).json({
                            error: err
                        });
                        console.log(err);
                    } else {
                        if(!user.length) {
                            res.status(404).json({
                                message: `User with this ID (${req.params.userId}) does not exist!`
                            });
                        } else {
                            connection.query(sql, [req.params.movieId, req.params.userId], function(err, rating) {
                                if (err) {
                                    res.status(400).json({
                                        error: err.message
                                    });
                                    console.log(err);
                                } else {
                                    res.status(200).send(rating[0]);
                                }
                            });
                        }
                    }
                });
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