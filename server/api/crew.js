const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const HOSTNAME = 'localhost';
const PORT = 5004;
let app = express();
app.use(express.json());
// To bypass Cors Policy error
app.use(cors());

// CREATE Crew
app.post("/crew", (req, res) => {
    let name = req.body.name || null;
    let dateOfBirth = req.body.dateOfBirth || null;
    let birthPlace = req.body.birthPlace || null;
    let biography = req.body.biography || null;
    let website = req.body.website || null;
    let stmt = `INSERT INTO crew(name, dateOfBirth, birthPlace, biography, website) VALUES(?, ?, ?, ?, ?);`;

    connection.query(stmt, [name, dateOfBirth, birthPlace, biography, website], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The crew member could not be created!',
                error: err.message
            });
            console.log(err);
        } else {
            console.log("A new crew record inserted, ID: " + result.insertId );
            axios.get(`http://${HOSTNAME}:${PORT}/crew/${result.insertId}`).then(response =>{
                res.status(201).send(response.data);
            }).catch(err =>{
                if(err){
                    console.log(err);
                }
                res.status(400).json({
                    message: `There is no Crew member with the id ${result.insertId}`
                });
            });
        }
    });
});

// READ All Crew Members
app.get("/crew", (req, res) => {
    let stmt = `SELECT * FROM crew`;
    connection.query(stmt, function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The crew members could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            res.status(200).send(results);
        }
    });
});

// READ One Crew
app.get("/crew/:id", (req, res) => {
    let stmt = `SELECT * FROM crew WHERE id = ?`;
    connection.query(stmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The crew member could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).json({
                    message: `No crew member found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Update Crew
app.put("/crew/:id", (req, res) => {
    let getOneStmt = `SELECT * FROM crew WHERE id = ?`;
    let updateStmt = `UPDATE crew SET name = ?, dateOfBirth = ?, birthPlace = ?, biography = ?, website = ? WHERE id = ?`;

    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The crew member could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                let name = req.body.name || result[0].name;
                let dateOfBirth = req.body.dateOfBirth || result[0].dateOfBirth;
                let birthPlace = req.body.birthPlace || result[0].birthPlace;
                let biography = req.body.biography || result[0].biography;
                let website = req.body.website || result[0].website;

                connection.query(updateStmt, [name, dateOfBirth, birthPlace, biography, website, req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The crew member could not be updated!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No crew member found with the id ${req.params.id}!`
                });
            }
        }
    });
});

// Delete Crew
app.delete("/crew/:id", (req, res) => {
    let getOneStmt = `SELECT * FROM crew WHERE id = ?`;
    let deleteStmt = `DELETE FROM crew WHERE id = ?`;
    connection.query(getOneStmt, [req.params.id], function (err, result) {
        if (err) {
            res.status(400).json({
                message: 'The crew member could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(result.length) {
                connection.query(deleteStmt, [req.params.id], function (err, result) {
                    if (err) {
                        res.status(400).json({
                            message: 'The crew member could not be deleted!',
                            error: err.message
                        });
                        console.log(err);
                    } else {
                        res.sendStatus(204);
                    }
                });
            } else {
                res.status(404).json({
                    message: `No crew member found with the id ${req.params.id}!`
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
