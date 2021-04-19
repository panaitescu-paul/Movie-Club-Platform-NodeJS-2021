// TODO: add more cases to cover all errors


// ******************************************************
// ***                                                ***
// ***             Rating CRUD Functionality          ***
// ***                                                ***
// ******************************************************

/**
* CREATE new Rating (Add a Rating to a Movie)
*               
* Input:   userId 
*          movieId 
*          value - a number between 0-5
* Output:  the Id of the new Rating,
* Errors:  The field Value must be a number between 0-5!
*          User with this ID does not exist!
*          Movie with this ID does not exist!
*          Rating from this User is already attached to this Movie!
*          Rating could not be added to Movie!
*/
app.post("/rating", (req, res) => {
    let userId = req.body.userId;
    let movieId = req.body.movieId;
    let value = req.body.value;
    let sqlGetUser = `SELECT * FROM user WHERE id = ?`;
    let sqlGetMovie = `SELECT * FROM movie WHERE id = ?`;
    let sqlAddRating = `INSERT INTO rating(userId, movieId, value) VALUES(?, ?, ?)`;

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

    // Add Rating to Movie
    db.run(sqlAddRating, [userId, movieId, value], function (err) {
        if (err) {
            res.status(400).json({
                message: 'The Rating could not be created!',
                error: err.message
            });
            console.log(err.message);
        } else {
            console.log(`A new row has been inserted!`);
            // Get the last inserted Rating
            axios.get(`http://localhost:3001/rating/${this.lastID}`).then(response =>{
                res.status(201).json({
                    id: response.data.rating[0].id,
                    userId: response.data.rating[0].userId,
                    movieId: response.data.rating[0].movieId,
                    value: response.data.rating[0].value,
                    createdAt: response.data.rating[0].createdAt
                });
            }).catch(err =>{
                if(err){
                    console.log(err);
                }
                res.status(400).json({
                    message: `There is no Rating with the id ${this.lastID}`
                });
            });
        }
    });
});

/**
 * READ all Ratings
 *
 * Output:   an array with all Ratings and their information,
 * Errors:   There are no Ratings in the DB!
 */
app.get("/rating", (req, res) => {
    let sql = `SELECT * FROM rating`;
    db.all(sql, [], (err, ratings) => {
        if (err) {
            res.status(400).json({
                message: 'There are no Ratings in the DB!',
                error: err
            });
            console.log(err);
        } else {
            res.status(200).json({
                ratings
            });
        }
    });
});

/**
 * READ Rating by id
 *
 * Input:   id of the Rating
 * Output:  an Rating and their information,
 * Errors:  Rating with this ID does not exist!
 */
app.get("/rating/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM rating WHERE id = ?`;

    db.all(sql, [req.params.id], (err, rating) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(rating.length) {
                res.status(200).json({
                    rating
                });
            } else {
                res.status(404).json({
                    message: `Rating with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

/**
 * UPDATE Rating by id
 *
 * Input:    id - Id of the Rating
 *           value - a number between 0-5
 * Output:   Success if Rating was successfully updated!
 * Errors:   The field Value must be a number between 0-5!
 *           Rating with this ID does not exist!
 *           The Rating could not be updated!
 */
app.put("/rating/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let value = req.body.value;
    let sqlGet = `SELECT * FROM rating WHERE id = ?`;
    let sqlUpdate = `UPDATE rating SET value = ?, WHERE id = ?`;
    db.all(sqlGet, [req.params.id], (err, rating) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(!rating.length) {
                res.status(404).json({
                    message: `Rating with this ID (${req.params.id}) does not exist!`
                });
            } else {
                db.run(sqlUpdate, [value, req.params.id], (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'The Rating could not be updated!',
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