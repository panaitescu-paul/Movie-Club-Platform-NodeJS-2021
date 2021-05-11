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
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 3005;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

/**
* READ Language by id
*
* Input:    id of the Language
* Output:   an Language and their information,
* Errors:   Language with this ID does not exist!
*/
app.get("/language/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM language WHERE id = ?`;

    connection.query(sql, [req.params.id], function(err, language) {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            console.log(err);
        } else {
            if(language.length) {
                res.status(200).send(language[0]);
            } else {
                res.status(404).json({
                    message: `Language with this ID (${req.params.id}) does not exist!`
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