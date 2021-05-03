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
const HOSTNAME = 'localhost';
const PORT = 3005;
let app = express();
app.use(express.json());
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
// Server connection
app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});