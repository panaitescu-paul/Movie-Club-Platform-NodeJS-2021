const conn = require("./db_connection");

const roomTable = "CREATE TABLE IF NOT EXISTS Room(Id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(255) NOT NULL)";

conn.query(roomTable, function (err, result) {
    if (err) throw err;
    console.log("Room Table created");
});