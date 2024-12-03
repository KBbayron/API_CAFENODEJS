const mysql = require('mysql');
require('dotenv').config();  

const connection = mysql.createConnection({
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,      
  user: process.env.BD_USERNAME,  
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME    
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
});

module.exports = connection;

