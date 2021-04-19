const mysql      = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
    host:               'den1.mysql6.gear.host',
    user:               'movieclubdb1',
    password:           'Ll7zX8!5sel!',
    database:           'movieclubdb1',
    multipleStatements: true
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected to database!');
});

// const movie_club = fs.readFileSync('movie_club.sql').toString();
// const movie_club = require('./movie_club.sql');
// module.exports = {connection, movie_club};
module.exports = connection;
