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
// Server connection
app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});