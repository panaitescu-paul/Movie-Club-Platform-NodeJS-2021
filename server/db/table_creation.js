const conn = require("./db_connection");

const createRoomTable = "CREATE TABLE IF NOT EXISTS Room(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL)";

conn.query(createRoomTable, function (err, result) {
    if (err) throw err;
    console.log("Room Table created");
});
