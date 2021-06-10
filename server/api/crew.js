const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const HOSTNAME = 'localhost';
const PORT = 5000;
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// To bypass Cors Policy error
app.use(cors());

// CREATE Crew
app.post("/crew", (req, res) => {
    let name = req.body.name;
    let mainActivity = req.body.mainActivity || null;
    let dateOfBirth = req.body.dateOfBirth || null;
    let birthPlace = req.body.birthPlace || null;
    let biography = req.body.biography || null;
    let picture = req.body.picture || null;
    let website = req.body.website || null;
    let stmt = `INSERT INTO crew(name, mainActivity, dateOfBirth, birthPlace, biography, picture, website) VALUES(?, ?, ?, ?, ?, ?, ?);`;

    if (name === null || name === '') {
        res.status(409).json({
            message: `The Crew must have a name!`
        });
    } else {
        connection.query(stmt, [name, mainActivity, dateOfBirth, birthPlace, biography, picture, website], function (err, result) {
            if (err) {
                res.status(400).json({
                    message: 'The crew member could not be created!',
                    error: err.message
                });
                console.log(err);
            } else {
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
    }
});

// READ All Crew Members
app.get("/crew", (req, res) => {
    let stmt = `SELECT * FROM crew ORDER BY id`;
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

// Search Crew
app.get("/crew/name/search", (req, res) => {
    let stmt = `SELECT * FROM crew WHERE name LIKE ?`;
    connection.query(stmt, ['%' + req.query.name + '%'], function (err, results) {
        if (err) {
            res.status(400).json({
                message: 'The crew members could not be showed!',
                error: err.message
            });
            console.log(err);
        } else {
            if(results.length) {
                res.status(200).send(results);
            } else {
                res.status(404).json({
                    message: `Crews with this Name (${req.query.name}) do not exist!`
                });
            }
        }
    });
});

// Update Crew
app.put("/crew/:id", (req, res) => {
    let getOneStmt = `SELECT * FROM crew WHERE id = ?`;
    let updateStmt = `UPDATE crew SET name = ?, mainActivity = ?, dateOfBirth = ?, birthPlace = ?, biography = ?, picture = ?, website = ? WHERE id = ?`;

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
                let mainActivity = req.body.mainActivity || result[0].mainActivity;
                let dateOfBirth = req.body.dateOfBirth || result[0].dateOfBirth;
                let birthPlace = req.body.birthPlace || result[0].birthPlace;
                let biography = req.body.biography || result[0].biography;
                let picture = req.body.picture || result[0].picture;
                let website = req.body.website || result[0].website;

                connection.query(updateStmt, [name, mainActivity, dateOfBirth, birthPlace, biography, picture, website, req.params.id], function (err, result) {
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

// ******************************************************
// ***                                                ***
// ***              Crew Extra Functionality          ***
// ***                                                ***
// ******************************************************


app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});
