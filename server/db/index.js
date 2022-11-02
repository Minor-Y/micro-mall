const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    // host: '121.4.124.242',
    user: 'root',
    password: '15658168387Xie',
    database: 'minor-mall',
    port: '3306',
})

module.exports = db