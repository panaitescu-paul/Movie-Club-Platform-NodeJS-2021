/**
* Movie_Language class
*
* @author Paul Panaitescu
* @version 1.0 27 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const HOSTNAME = 'localhost';
const PORT = 3006;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***        Movie_Language CRUD Functionality       ***
// ***                                                ***
// ******************************************************

// ******************************************************
// ***                                                ***
// ***       Movie_Language Extra Functionality       ***
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