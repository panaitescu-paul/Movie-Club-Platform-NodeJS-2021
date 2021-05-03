/**
* Language class
*
* @author Paul Panaitescu
* @version 1.0 3 MAY 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const HOSTNAME = 'localhost';
const PORT = 3006;
let app = express();
app.use(express.json());
// To bypass Cors Policy error
app.use(cors());

// ******************************************************
// ***                                                ***
// ***          Language CRUD Functionality           ***
// ***                                                ***
// ******************************************************

/**
* READ all Languages
*
* Output:   an array with all Languages and their information,
* Errors:   There are no Languages in the DB!
*/
app.get("/language", (req, res) => {
    let sql = `SELECT * FROM language ORDER BY id`;
    connection.query(sql, function(err, languages) {
        if (err) {
            res.status(400).json({
                message: 'There are no Languages in the DB!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(languages);
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