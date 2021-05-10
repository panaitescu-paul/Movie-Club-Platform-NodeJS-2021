const mysql = require('mysql');
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'den1.mysql6.gear.host',
    user            : 'movieclubdb1',
    password        : 'Ll7zX8!5sel!',
    database        : 'movieclubdb1',
    multipleStatements: true
});

// const connection = mysql.createConnection({
//     host:               'den1.mysql6.gear.host',
//     user:               'movieclubdb1',
//     password:           'Ll7zX8!5sel!',
//     database:           'movieclubdb1',
//     multipleStatements: true
// });

// connection.connect(function(err) {
//     if (err) {
//         console.error('Error connecting: ' + err.stack);
//         return;
//     }
//
//     console.log('Connected to database!');
// });

pool.getConnection(function(err, connection) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected to database!');
});

module.exports = pool;
