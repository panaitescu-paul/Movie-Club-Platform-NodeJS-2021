/**
* Movie class
*
* @author Paul Panaitescu
* @version 1.0 26 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 3000;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// ******************************************************
// ***                                                ***
// ***             Movie CRUD Functionality           ***
// ***                                                ***
// ******************************************************

/**
* CREATE new Movie
*
* Input:    title, overview, runtime, trailerLink, poster, releaseDate
* Output:   the Id of the new Movie
* Errors:   Title can not be null!
*           Movie with this Title already exists!
*           Movie could not be created!
*           Movie with this ID does not exist!
*/
app.post("/movie", (req, res) => {
    let title = req.body.title;
    let overview = req.body.overview;
    let runtime = req.body.runtime;
    let trailerLink = req.body.trailerLink;
    let poster = req.body.poster;
    let releaseDate = req.body.releaseDate;
    let sql =  `INSERT INTO movie(title, overview, runtime, trailerLink, poster, releaseDate) 
                VALUES(?, ?, ?, ?, ?, ?);`;

    // Check if Title is null
    if(title.length == 0) {
        res.status(409).json({
            message: 'Title can not be null!'
        });
        return 0;
    } else {
        // Check the count of Movies with this Title
        connection.query(`SELECT COUNT(*) AS total FROM movie WHERE title = ?;` ,
            [title], function (err, result) {
                if (result[0].total > 0) {
                    res.status(409).json({
                        message: 'Movie with this Title already exists!',
                    });
                } else {

                    // Create Movie
                    connection.query(sql, [title, overview, runtime, trailerLink, poster, releaseDate], function (err, result) {
                        if (err) {
                            res.status(400).json({
                                message: 'Movie could not be created!',
                                error: err.message
                            });
                            console.log(err.message);
                        } else {
                            // Get the last inserted Movie
                            axios.get(`http://${HOSTNAME}:${PORT}/movie/${result.insertId}`).then(response =>{
                                res.status(201).send(response.data);
                            }).catch(err =>{
                                if(err){
                                    console.log(err);
                                }
                                res.status(400).json({
                                    message: `Movie with this ID (${result.insertId}) does not exist!`
                                });
                            });
                        }
                    });
                }
            });
    }
});

/**
* READ all Movies
*
* Input:    -
* Output:   an array with all Movies and their information
* Errors:   There are no Movies in the DB!
*/
app.get("/movie", (req, res) => {
    let sql = `SELECT * FROM movie ORDER BY id`;
    connection.query(sql, function (err, movies) {
        if (err) {
            res.status(400).json({
                message: 'There are no Movies in the DB!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(movies);
        }
    });
});

/**
* READ Movie by id
*
* Input:    id of the Movie
* Output:   an Movie and their information
* Errors:   Movie with this ID does not exist!
*/
app.get("/movie/:id", (req, res) => {
    let sql = `SELECT * FROM movie WHERE id = ?`;

    connection.query(sql, [req.params.id], function (err, movie) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movie.length) {
                res.status(200).send(movie[0]);
            } else {
                res.status(404).json({
                    message: `Movie with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

/**
* SEARCH Movies by Title
*
* Input:    title of the Movie
* Output:   an array with all Movies with this Title, and their information
* Errors:   Movies with this Title do not exist!
*/
app.get("/movie/title/search", (req, res) => {
    let sql = `SELECT * FROM movie WHERE title LIKE ?`;

    connection.query(sql, ['%' + req.query.title + '%'], function (err, movies) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movies.length) {
                res.status(200).send(movies);
            } else {
                res.status(404).json({
                    message: `Movies with this Title (${req.query.title}) do not exist!`
                });
            }
        }
    });
});

/**
* UPDATE Movie by id
*
* Input:    id, title, overview, runtime, trailerLink, poster, releaseDate
* Output:   Status 204 - Success if Movie was successfully updated!
* Errors:   Title can not be null!
*           Movie with this Title already exists!
*           Movie with this ID does not exist!
*           The Movie could not be updated!
*/
app.put("/movie/:id", (req, res) => {
    let title = req.body.title;
    let overview = req.body.overview;
    let runtime = req.body.runtime;
    let trailerLink = req.body.trailerLink;
    let poster = req.body.poster;
    let releaseDate = req.body.releaseDate;
    let sqlGet = `SELECT * FROM movie WHERE id = ?`;
    let sqlUpdate = `UPDATE movie SET title = ?, overview = ?, runtime = ?, 
                     trailerLink = ?, poster = ?, releaseDate = ? WHERE id = ?`;
    
    // Check if Title is null
    if(title.length == 0) {
        res.status(409).json({
            message: 'Title can not be null!'
        });
        return 0;
    } else {
        // Check the count of Movies with this Title
        connection.query(`SELECT COUNT(*) AS total FROM movie WHERE title = ? AND id != ?;` ,
            [title, req.params.id], function (err, result) {
                if (result[0].total > 0) {
                    res.status(409).json({
                        message: 'Movie with this Title already exists!',
                    });
                } else {

                    // Get Movie
                    connection.query(sqlGet, [req.params.id], function (err, movie) {
                        if (err) {
                            res.status(400).json({
                                error: err
                            });
                            console.log(err);
                        } else {
                            if(!movie.length) {
                                res.status(404).json({
                                    message: `Movie with this ID (${req.params.id}) does not exist!`
                                });
                            } else {

                                // Update Movie
                                connection.query(sqlUpdate, [title, overview, runtime, trailerLink,
                                    poster, releaseDate, req.params.id], function (err) {
                                    if (err) {
                                        res.status(400).json({
                                            message: 'The Movie could not be updated!',
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
    }
});

/**
* DELETE Movie by id
*
* Input:    Id of the Movie to delete
* Output:   Status 204 - Success if Movie was successfully deleted!
* Erros:    Movie with this ID does not exist!
*           The Movie could not be deleted!
*/
app.delete("/movie/:id", (req, res) => {
    let sqlGet = `SELECT * FROM movie WHERE id = ?`;
    let sqlDelete = `DELETE FROM movie WHERE id = ?`;
    
    connection.query(sqlGet, [req.params.id], function(err, movie) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!movie.length) {
                res.status(404).json({
                    message: `Movie with this ID (${req.params.id}) does not exist!`
                });
            } else {
                connection.query(sqlDelete, [req.params.id], function(err) {
                    if (err) {
                        res.status(400).json({
                            message: 'The Movie could not be deleted!',
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
// ***             Movie Extra Functionality          ***
// ***                                                ***
// ******************************************************

// Server connection
app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});