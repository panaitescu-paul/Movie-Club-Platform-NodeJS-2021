// const conn = require("./db_connection");
// const conn2 = require("./movie_club.sql");

// conn.query();
const {connection} = require("./db_connection");
const {movie_club} = require("./db_connection");

connection.query(movie_club, function (err, result) {
    if (err) throw err;
    console.log("Created All Tables!");
});


// test
