// TODO: add more cases to cover all errors


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