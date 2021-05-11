/**
* Genre class
*
* @author Paul Panaitescu
* @version 1.0 3 MAY 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 3004;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// ******************************************************
// ***                                                ***
// ***            Genre CRUD Functionality            ***
// ***                                                ***
// ******************************************************

/**
* READ all Genres
*
* Output:   an array with all Genres and their information,
* Errors:   There are no Genres in the DB!
*/
app.get("/genre", (req, res) => {
    let sql = `SELECT * FROM genre ORDER BY id`;
    connection.query(sql, function(err, genres) {
        if (err) {
            res.status(400).json({
                message: 'There are no Genres in the DB!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(genres);
        }
    });
});

/**
* READ Genre by id
*
* Input:    id of the Genre
* Output:   an Genre and their information,
* Errors:   Genre with this ID does not exist!
*/
app.get("/genre/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM genre WHERE id = ?`;

    connection.query(sql, [req.params.id], function(err, genre) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(genre.length) {
                res.status(200).send(genre[0]);
            } else {
                res.status(404).json({
                    message: `Genre with this ID (${req.params.id}) does not exist!`
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