/**
* Movie_Genre class
*
* @author Paul Panaitescu
* @version 1.0 27 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 3007;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// ******************************************************
// ***                                                ***
// ***         Movie_Genre CRUD Functionality         ***
// ***                                                ***
// ******************************************************

/**
* CREATE new Movie_Genre (Attach a Genre to a Movie)
*               
* Input:    movieId, genreId
* Output:   the Id of the new Movie_Genre
* Errors:   Movie with this ID does not exist!
*           Genre with this ID does not exist!
*           Genre is already attached to this Movie!
*           The Movie_Genre could not be created!
*           Movie_Genre with this ID does not exist!
*/
app.post("/movie_genre", (req, res) => {
    let movieId = req.body.movieId;
    let genreId = req.body.genreId;
    let sqlGetMovie = `SELECT * FROM movie WHERE id = ?`;
    let sqlGetGenre = `SELECT * FROM genre WHERE id = ?`;
    let sqlAddMovie_Genre = `INSERT INTO movie_genre(movieId, genreId) VALUES(?, ?)`;

    // Check if there is a Movie with this id
    connection.query(sqlGetMovie, [movieId], function (err, movie) {
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

                // Check if there is a Genre with this id
                connection.query(sqlGetGenre, [genreId], function(err, genre) {
                    if (err) {
                        res.status(400).json({
                            error: err
                        });
                        console.log(err);
                    } else {
                        if(!genre.length) {
                            res.status(404).json({
                                message: `Genre with this ID (${genreId}) does not exist!`
                            });
                        } else {

                            // Check if Genre is already attached to this Movie
                            connection.query(`SELECT COUNT(*) AS total FROM movie_genre WHERE movieId = ? AND genreId = ?;` , 
                                            [movieId, genreId], function (err, result) {
                                console.log('total: ', result[0].total);
                                if (result[0].total > 0) {
                                    res.status(409).json({
                                        message: 'Genre is already attached to this Movie!',
                                    });
                                } else {

                                    // Add Movie_Genre
                                    connection.query(sqlAddMovie_Genre, [movieId, genreId], function (err, result) {
                                        if (err) {
                                            res.status(400).json({
                                                message: 'The Movie_Genre could not be created!',
                                                error: err.message
                                            });
                                            console.log(err.message);
                                        } else {
                                            console.log(`A new row has been inserted!`);
                                            // Get the last inserted Movie_Genre
                                            axios.get(`http://${HOSTNAME}:${PORT}/movie_genre/${result.insertId}`).then(response =>{
                                                console.log(response);
                                                res.status(201).send(response.data);
                                            }).catch(err =>{
                                                if(err){
                                                    console.log(err);
                                                }
                                                res.status(400).json({
                                                    message: `Movie_Genre with this ID (${result.insertId}) does not exist!`
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
* READ all Movie_Genres
*
* Output:   an array with all Movie_Genres and their information,
* Errors:   There are no Movie_Genres in the DB!
*/
app.get("/movie_genre", (req, res) => {
    let sql = `SELECT * FROM movie_genre`;
    connection.query(sql, function(err, movie_genres) {
        if (err) {
            res.status(400).json({
                message: 'There are no Movie_Genres in the DB!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(movie_genres);
        }
    });
});

/**
* READ Movie_Genre by id
*
* Input:    id of the Movie_Genre
* Output:   an Movie_Genre and their information,
* Errors:   Movie_Genre with this ID does not exist!
*/
app.get("/movie_genre/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM movie_genre WHERE id = ?`;

    connection.query(sql, [req.params.id], function(err, movie_genre) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movie_genre.length) {
                res.status(200).send(movie_genre[0]);
            } else {
                res.status(404).json({
                    message: `Movie_Genre with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

/**
* DELETE Movie_Genre by id
*
* Input:    Id of the Movie_Genre to delete
* Output:   Status 204 - Success if Movie_Genre was successfully deleted!
* Erros:    Movie_Genre with this ID does not exist!
*           This Movie_Genre could not be deleted!
*/
app.delete("/movie_genre/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sqlGet = `SELECT * FROM movie_genre WHERE id = ?`;
    let sqlDelete = `DELETE FROM movie_genre WHERE id = ?`;
    
    connection.query(sqlGet, [req.params.id], function(err, movie_genre) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!movie_genre.length) {
                res.status(404).json({
                    message: `Movie_Genre with this ID (${req.params.id}) does not exist!`
                });
            } else {
                connection.query(sqlDelete, req.params.id, function(err) {
                    if (err) {
                        res.status(400).json({
                            message: 'The Movie_Genre could not be deleted!',
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
// ***         Movie_Genre Extra Functionality        ***
// ***                                                ***
// ******************************************************

/**
* READ Movie_Genre by Movie id
*
* Input:    id of the Movie
* Output:   an Movie_Genre and their information,
* Errors:   Movie_Genre with this Movie ID does not exist!
*/
app.get("/movie_genre/movieId/:movieId", (req, res) => {
    let sql = `SELECT * FROM movie_genre WHERE movieId = ?`;

    connection.query(sql, [req.params.movieId], function(err, movie_genre) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movie_genre.length) {
                res.status(200).send(movie_genre);
            } else {
                res.status(404).json({
                    message: `Movie_Genre with this Movie ID (${req.params.movieId}) does not exist!`
                });
            }
        }
    });
});

/**
* READ Movie_Genre by Genre id
*
* Input:    id of the Genre
* Output:   an Movie_Genre and their information,
* Errors:   Movie_Genre with this Genre ID does not exist!
*/
app.get("/movie_genre/genreId/:genreId", (req, res) => {
    let sql = `SELECT * FROM movie_genre WHERE genreId = ? ORDER BY id`;

    connection.query(sql, [req.params.genreId], function(err, movie_genre) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movie_genre.length) {
                res.status(200).send(movie_genre);
            } else {
                res.status(404).json({
                    message: `Movie_Genre with this Genre ID (${req.params.genreId}) does not exist!`
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