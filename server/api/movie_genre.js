/**
* Movie_Genre class
*
* @author Paul Panaitescu
* @version 1.0 27 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const HOSTNAME = 'localhost';
const PORT = 3005;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***         Movie_Genre CRUD Functionality         ***
// ***                                                ***
// ******************************************************

// TODO: Add if else statements to prevent stoping the server after request failure
// TODO: return the object after it was created

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
            }
        }
    });

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
            }
        }
    });

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
                        res.status(201).send(response.data[0]);
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
});
// ******************************************************
// ***                                                ***
// ***         Movie_Genre Extra Functionality         ***
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