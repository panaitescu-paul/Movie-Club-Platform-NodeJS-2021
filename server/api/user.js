// TODO: add more cases to cover all errors
// TODO: updatePassword(email, oldPassword, newPassword)

// ******************************************************
// ***                                                ***
// ***             User CRUD Functionality            ***
// ***                                                ***
// ******************************************************

/**
* CREATE new User
*
* Input:   email, password
* Output:  the Id of the new User,
* Errors:  Email can not be null!
*          Password can not be null!
*          User with this Email already exists!
*          User could not be created!
*/
app.post("/user", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let sql = `INSERT INTO user(email, password) VALUES(?, ?)`;

    db.run(sql, [email, password], function (err) {
        if (err) {
            res.status(400).json({
                message: 'The User could not be created!',
                error: err.message
            });
            console.log(err.message);
        } else {
            console.log(`A new row has been inserted!`);
            // Get the last inserted User
            axios.get(`http://localhost:3001/user/${this.lastID}`).then(response =>{
                res.status(201).json({
                    id: response.data.user[0].id,
                    email: response.data.user[0].email,
                    username: response.data.user[0].username,
                    isAdmin: response.data.user[0].isAdmin,
                    createdAt: response.data.user[0].createdAt
                });
            }).catch(err =>{
                if(err){
                    console.log(err);
                }
                res.status(400).json({
                    message: `There is no User with the id ${this.lastID}`
                });
            });
        }
    });
});

/**
* READ all Users
*
* Output:   an array with all Users and their information,
* Errors:   There are no Users in the DB!
*/
app.get("/user", (req, res) => {
    let sql = `SELECT * FROM user`;
    db.all(sql, [], (err, users) => {
        if (err) {
            res.status(400).json({
                message: 'There are no Users in the DB!',
                error: err
            });
            console.log(err);
        } else {
            res.status(200).json({
                users
            });
        }
    });
});

/**
* READ User by id
*
* Input:   id of the User
* Output:  an User and their information,
* Errors:  User with this ID does not exist!
*/
app.get("/user/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sql = `SELECT * FROM user WHERE id = ?`;

    db.all(sql, [req.params.id], (err, user) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            console.log(err);
        } else {
            if(user.length) {
                res.status(200).json({
                    user
                });
            } else {
                res.status(404).json({
                    message: `User with this ID (${req.params.id}) does not exist!`
                });
            }
        }
    });
});

// TODO: add more cases to cover all errors
/**
* UPDATE User by id
*
* Input:    id, firstName, lastName, email, username,
*           birthday, gender, country, isAdmin
* Output:   Success if User was successfully updated!
* Errors:   Email can not be null!
*           User with this ID does not exist!
*           User with this Email already exists!
*           The User could not be updated!
*/
app.put("/user/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let username = req.body.username;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let country = req.body.country;
    let isAdmin = req.body.isAdmin;
    let sqlGet = `SELECT * FROM user WHERE id = ?`;
    let sqlUpdate = `UPDATE user SET firstName = ?, lastName = ?, email = ?, username = ?, 
                    birthday = ?, gender = ?, country = ?, isAdmin = ?, WHERE id = ?`;
    db.all(sqlGet, [req.params.id], (err, user) => {
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
                db.run(sqlUpdate, [firstName, firstName, lastName, email, username, 
                                   birthday, gender, country, isAdmin, req.params.id], (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'The User could not be updated!',
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
* DELETE User by id
*
* Input:   Id of the User to delete
* Output:  Success if User was successfully deleted!
* Erros:   User with this ID does not exist!
*          This User could not be deleted!
*/
app.delete("/user/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    let sqlGet = `SELECT * FROM user WHERE id = ?`;
    let sqlDelete = `DELETE FROM user WHERE id = ?`;
    db.all(sqlGet, [req.params.id], (err, user) => {
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
                db.run(sqlDelete, req.params.id, (err) => {
                    if (err) {
                        res.status(400).json({
                            message: 'The User could not be deleted!',
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
