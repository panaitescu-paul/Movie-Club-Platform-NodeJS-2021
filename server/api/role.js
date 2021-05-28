const connection = require("../db/db_connection");
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const HOSTNAME = 'localhost';
const PORT = 5002;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// READ All Roles
app.get("/role", (req, res) => {
    let stmt = `SELECT * FROM role ORDER BY id`;
    connection.query(stmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The roles could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// READ One Role
app.get("/role/:id", (req, res) => {
    let stmt = `SELECT * FROM role WHERE id = ?`;
    connection.query(stmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The role could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).json({
                    message: `No role found with the id ${req.params.id}!`
                });
            }
        }
    });
});


app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});
