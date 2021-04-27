/**
* Movie_Crew class
*
* @author Paul Panaitescu
* @version 1.0 27 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const HOSTNAME = 'localhost';
const PORT = 3004;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***          Movie_Crew CRUD Functionality         ***
// ***                                                ***
// ******************************************************

// TODO: Add if else statements to prevent stoping the server after request failure
// TODO: return the object after it was created

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
            }
        }
    });

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
            }
        }
    });

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
            }
        }
    });

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
                        res.status(201).send(response.data[0]);
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
// ******************************************************
// ***                                                ***
// ***         Movie_Crew Extra Functionality         ***
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