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