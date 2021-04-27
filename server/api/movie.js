/**
* Movie class
*
* @author Paul Panaitescu
* @version 1.0 26 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const HOSTNAME = 'localhost';
const PORT = 3003;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***             Movie CRUD Functionality           ***
// ***                                                ***
// ******************************************************

// TODO: Add if else statements to prevent stoping the server after request failure

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
    } 

    // Check the count of Movies with this Title
    connection.query(`SELECT COUNT(*) AS total FROM movie WHERE title = ?;` , 
                    [title], function (err, result) {
        console.log('total: ', result[0].total);
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
                    console.log(`A new row has been inserted!`);
                    // Get the last inserted Movie
                    axios.get(`http://${HOSTNAME}:${PORT}/movie/${result.insertId}`).then(response =>{
                        console.log(response);
                        res.status(201).send(response.data[0]);
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