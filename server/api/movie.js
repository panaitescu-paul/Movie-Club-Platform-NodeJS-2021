/**
* Movie class
*
* @author Paul Panaitescu
* @version 1.0 26 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const bcrypt = require('bcrypt');
const HOSTNAME = 'localhost';
const PORT = 3003;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***             Movie CRUD Functionality           ***
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