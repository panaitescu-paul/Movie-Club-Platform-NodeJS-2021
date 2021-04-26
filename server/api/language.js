/**
* Language class
*
* @author Paul Panaitescu
* @version 1.0 26 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const bcrypt = require('bcrypt');
const HOSTNAME = 'localhost';
const PORT = 3005;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***           Language CRUD Functionality          ***
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