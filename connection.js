const mysql = require('mysql2')
require('dotenv').config()

// db connection
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password: process.env.SQL_password,
        database: 'management_db'
    },
    console.log('Connected to the management_db database')
)

module.exports = db