/**
* Review class
*
* @author Paul Panaitescu
* @version 1.0 19 APR 2020
*/

const connection = require("../db/db_connection");
const express = require("express");
const axios = require('axios');
const HOSTNAME = 'localhost';
const PORT = 3002;
let app = express();
app.use(express.json());

// ******************************************************
// ***                                                ***
// ***             Review CRUD Functionality          ***
// ***                                                ***
// ******************************************************

/**
* CREATE new Review (Add a Review to a Movie)
*               
* Input:   userId 
*          movieId 
*          value - a number between 0-5
* Output:  the Id of the new Review,
* Errors:  Title can not be null!
*          Content can not be null!
*          User with this ID does not exist!
*          Movie with this ID does not exist!
*          This User already added a Review to this Movie!
*          Review could not be added to Movie!
*/
app.post("/review", (req, res) => {
    let userId = req.body.userId;
    let movieId = req.body.movieId;
    let title = req.body.title;
    let content = req.body.content;
    let sqlGetUser = `SELECT * FROM user WHERE id = ?`;
    let sqlGetMovie = `SELECT * FROM movie WHERE id = ?`;
    let sqlAddReview = `INSERT INTO review(userId, movieId, title, content) VALUES(?, ?, ?, ?)`;

    // Check if there is a User with this id
    db.all(sqlGetUser, [userId], (err, user) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!user.length) {
                res.status(404).json({
                    message: `User with this ID (${req.params.id}) does not exist!`
                });
            } else {
                // TODO: add the next query here, if it doesn't work otherwise
            }
        }
    });
    // Check if there is a Movie with this id
    db.all(sqlGetMovie, [userId], (err, user) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!user.length) {
                res.status(404).json({
                    message: `User with this ID (${req.params.id}) does not exist!`
                });
            } else {
               // TODO: add the next query here, if it doesn't work otherwise
            }
        }
    });

            // Add Review to Movie
    db.run(sqlAddReview, [userId, movieId, title, content], function (err) {
                if (err) {
                    res.status(400).json({
                        message: 'The Review could not be created!',
                        error: err.message
                    });
                    console.log(err.message);
                } else {
                    console.log(`A new row has been inserted!`);
                    // Get the last inserted Review
            axios.get(`http://localhost:3001/review/${this.lastID}`).then(response =>{
                res.status(201).json({
                    id: response.data.rating[0].id,
                    userId: response.data.rating[0].userId,
                    movieId: response.data.rating[0].movieId,
                    title: response.data.rating[0].title,
                    content: response.data.rating[0].content,
                    modifiedAt: response.data.rating[0].modifiedAt,
                    createdAt: response.data.rating[0].createdAt
                });
                    }).catch(err =>{
                        if(err){
                            console.log(err);
                        }
                        res.status(400).json({
                    message: `There is no Review with the id ${this.lastID}`
                        });
            });
        }
    });
});

/**
* READ all Reviews
*
 * Output:   an array with all Reviews and their information,
* Errors:   There are no Reviews in the DB!
*/
app.get("/review", (req, res) => {
    let sql = `SELECT * FROM review`;
    db.all(sql, [], (err, reviews) => {
        if (err) {
            res.status(400).json({
                message: 'There are no Reviews in the DB!',
                error: err
            });
            console.log(err);
        } else {
            res.status(200).json({
                reviews
            });
        }
    });
});

/**
* READ Review by id
*
 * Input:   id of the Review
 * Output:  an Review and their information,
 * Errors:  Review with this ID does not exist!
*/
app.get("/review/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM review WHERE id = ?`;

    db.all(sql, [req.params.id], (err, review) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(review.length) {
                res.status(200).json({
                    review
                });
            } else {
                res.status(404).json({
                    message: `Review with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

/**
* UPDATE Review by id
*
* Input:    id - Id of the Review
 *           value - a number between 0-5
 * Output:   Success if Review was successfully updated!
* Errors:   Title can not be null!
*           Content can not be null!
*           Review with this ID does not exist!
*           Review could not be updated!
*/
app.put("/review/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let title = req.body.title;
    let content = req.body.content;
    let sqlGet = `SELECT * FROM review WHERE id = ?`;
    let sqlUpdate = `UPDATE review SET title = ?, content = ?, WHERE id = ?`;
    db.all(sqlGet, [req.params.id], (err, review) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!review.length) {
                res.status(404).json({
                    message: `Review with this ID (${req.params.id}) does not exist!`
                });
            } else {
                db.run(sqlUpdate, [title, content, req.params.id], (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'The Review could not be updated!',
                            error: err.message
                        });
                        console.log(err.message);
                    } else {
                        res.sendStatus(204);
                    }
                });
            }
        }
    });
});

/**
* DELETE Review by id
*
 * Input:   Id of the Review to delete
 * Output:  Success if Review was successfully deleted!
 * Erros:   Review with this ID does not exist!
 *          This Review could not be deleted!
*/
app.delete("/review/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sqlGet = `SELECT * FROM review WHERE id = ?`;
    let sqlDelete = `DELETE FROM review WHERE id = ?`;
    db.all(sqlGet, [req.params.id], (err, review) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!review.length) {
                res.status(404).json({
                    message: `Review with this ID (${req.params.id}) does not exist!`
                });
            } else {
                db.run(sqlDelete, req.params.id, (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'The Review could not be deleted!',
                            error: err.message
                        });
                        console.log(err.message);
                    } else {
                        res.sendStatus(204);
                    }
                });
            }
        }
    });
});


// Server connection
app.listen(PORT, HOSTNAME, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    }
});