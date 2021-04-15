const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'den1.mysql6.gear.host',
    user     : 'movieclubdb1',
    password : 'Ll7zX8!5sel!',
    database: 'movieclubdb1'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected to database!');
});

const movie_club = require('./movie_club.sql');
module.exports = {connection, movie_club};
