
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '162912', // sua senha aqui se tiver
  database: 'fitmaster_v2'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

module.exports = connection;
