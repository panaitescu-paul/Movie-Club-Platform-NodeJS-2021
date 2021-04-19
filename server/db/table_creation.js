// const conn = require("./db_connection");
// const conn2 = require("./movie_club.sql");

// conn.query();
const {connection} = require("./db_connection");
const {movie_club} = require("./db_connection");

let createTodos = `CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(120),
    lastName  VARCHAR(120),
    email     VARCHAR(120) UNIQUE NOT NULL,
    username  VARCHAR(120) DEFAULT email,
    password  VARCHAR(120),
    birthday  DATE,
    gender    VARCHAR(20),
    country   VARCHAR(120),
    isAdmin   BOOLEAN NOT NULL DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

connection.query(createTodos, function (err, result) {
    if (err) throw err;
    console.log("Created All Tables!");
});
