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
