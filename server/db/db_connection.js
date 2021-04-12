const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'den1.mysql3.gear.host',
    user     : 'movieclubdb',
    password : 'Zm246A6W~-pX'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected to database!');
});