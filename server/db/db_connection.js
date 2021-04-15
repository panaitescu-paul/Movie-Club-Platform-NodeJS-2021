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

module.exports = connection;