/**
* Movie_Crew class
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
const PORT = 3006;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// ******************************************************
// ***                                                ***
// ***          Movie_Crew CRUD Functionality         ***
// ***                                                ***
// ******************************************************

/**
* CREATE new Movie_Crew (Attach a Crew and a Role to a Movie)
*               
* Input:    movieId, crewId, roleId
* Output:   the Id of the new Movie_Crew
* Errors:   Movie with this ID does not exist!
*           Crew with this ID does not exist!
*           Role with this ID does not exist!
*           Crew with this Role is already attached to this Movie!
*           The Movie_Crew could not be created!
*           Movie_Crew with this ID does not exist!
*/
app.post("/movie_crew", (req, res) => {
    let movieId = req.body.movieId;
    let crewId = req.body.crewId;
    let roleId = req.body.roleId;
    let sqlGetMovie = `SELECT * FROM movie WHERE id = ?`;
    let sqlGetCrew = `SELECT * FROM crew WHERE id = ?`;
    let sqlGetRole = `SELECT * FROM role WHERE id = ?`;
    let sqlAddMovie_Crew = `INSERT INTO movie_crew(movieId, crewId, roleId) VALUES(?, ?, ?)`;

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
                
                // Check if there is a Crew with this id
                connection.query(sqlGetCrew, [crewId], function(err, crew) {
                    if (err) {
                        res.status(400).json({
                            error: err
                        });
                        console.log(err);
                    } else {
                        if(!crew.length) {
                            res.status(404).json({
                                message: `Crew with this ID (${crewId}) does not exist!`
                            });
                        } else {

                            // Check if there is a Role with this id
                            connection.query(sqlGetRole, [roleId], function(err, role) {
                                if (err) {
                                    res.status(400).json({
                                        error: err
                                    });
                                    console.log(err);
                                } else {
                                    if(!role.length) {
                                        res.status(404).json({
                                            message: `Role with this ID (${roleId}) does not exist!`
                                        });
                                    } else {

                                        // Check if Crew with this Role is already attached to this Movie
                                        connection.query(`SELECT COUNT(*) AS total FROM movie_crew WHERE movieId = ? AND crewId = ? AND roleId = ?;` , 
                                                        [movieId, crewId, roleId], function (err, result) {
                                            console.log('total: ', result[0].total);
                                            if (result[0].total > 0) {
                                                res.status(409).json({
                                                    message: 'Crew with this Role is already attached to this Movie!',
                                                });
                                            } else {
                                                
                                                // Add Movie_Crew
                                                connection.query(sqlAddMovie_Crew, [movieId, crewId, roleId], function (err, result) {
                                                    if (err) {
                                                        res.status(400).json({
                                                            message: 'The Movie_Crew could not be created!',
                                                            error: err.message
                                                        });
                                                        console.log(err.message);
                                                    } else {
                                                        console.log(`A new row has been inserted!`);
                                                        // Get the last inserted Movie_Crew
                                                        axios.get(`http://${HOSTNAME}:${PORT}/movie_crew/${result.insertId}`).then(response =>{
                                                            console.log(response);
                                                            res.status(201).send(response.data);
                                                        }).catch(err =>{
                                                            if(err){
                                                                console.log(err);
                                                            }
                                                            res.status(400).json({
                                                                message: `Movie_Crew with this ID (${result.insertId}) does not exist!`
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
            }
        }
    });



});

/**
* READ all Movie_Crews
*
* Output:   an array with all Movie_Crews and their information,
* Errors:   There are no Movie_Crews in the DB!
*/
app.get("/movie_crew", (req, res) => {
    let sql = `SELECT * FROM movie_crew`;
    connection.query(sql, function(err, movie_crews) {
        if (err) {
            res.status(400).json({
                message: 'There are no Movie_Crews in the DB!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(movie_crews);
        }
    });
});

/**
* READ Movie_Crew by id
*
* Input:    id of the Movie_Crew
* Output:   an Movie_Crew and their information,
* Errors:   Movie_Crew with this ID does not exist!
*/
app.get("/movie_crew/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM movie_crew WHERE id = ?`;

    connection.query(sql, [req.params.id], function(err, movie_crew) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movie_crew.length) {
                res.status(200).send(movie_crew[0]);
            } else {
                res.status(404).json({
                    message: `Movie_Crew with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

/**
* DELETE Movie_Crew by id
*
* Input:    Id of the Movie_Crew to delete
* Output:   Status 204 - Success if Movie_Crew was successfully deleted!
* Erros:    Movie_Crew with this ID does not exist!
*           This Movie_Crew could not be deleted!
*/
app.delete("/movie_crew/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sqlGet = `SELECT * FROM movie_crew WHERE id = ?`;
    let sqlDelete = `DELETE FROM movie_crew WHERE id = ?`;
    
    connection.query(sqlGet, [req.params.id], function(err, movie_crew) {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!movie_crew.length) {
                res.status(404).json({
                    message: `Movie_Crew with this ID (${req.params.id}) does not exist!`
                });
            } else {
                connection.query(sqlDelete, req.params.id, function(err) {
                    if (err) {
                        res.status(400).json({
                            message: 'The Movie_Crew could not be deleted!',
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
// ***         Movie_Crew Extra Functionality         ***
// ***                                                ***
// ******************************************************

/**
* READ Movie_Crew by Movie id
*
* Input:    id of the Movie
* Output:   an Movie_Crew and their information,
* Errors:   Movie_Crew with this Movie ID does not exist!
*/
 app.get("/movie_crew/movieId/:movieId", (req, res) => {
    let sql = `SELECT * FROM movie_crew WHERE movieId = ? ORDER BY id`;

    connection.query(sql, [req.params.movieId], function(err, movie_crew) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movie_crew.length) {
                res.status(200).send(movie_crew);
            } else {
                res.status(404).json({
                    message: `Movie_Crew with this Movie ID (${req.params.movieId}) does not exist!`
                });
            }
        }
    });
});

/**
* READ Movie_Crew by Crew id
*
* Input:    id of the Crew
* Output:   an Movie_Crew and their information,
* Errors:   Movie_Crew with this Crew ID does not exist!
*/
app.get("/movie_crew/crewId/:crewId", (req, res) => {
    let sql = `SELECT * FROM movie_crew WHERE crewId = ? ORDER BY id`;

    connection.query(sql, [req.params.crewId], function(err, movie_crew) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(movie_crew.length) {
                res.status(200).send(movie_crew);
            } else {
                res.status(404).json({
                    message: `Movie_Crew with this Crew ID (${req.params.crewId}) does not exist!`
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