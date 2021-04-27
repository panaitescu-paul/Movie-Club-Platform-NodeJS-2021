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