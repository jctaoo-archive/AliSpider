const mysql = require('mysql');
const express = require('express');
const {start_user_about_api} = require('./api/');
const {start_data_about_api} = require('./api/');
const {start_help_about_api} = require('./api/');
const bodyParser = require("body-parser");
const path = require("path");

let app = express();
const connectionCONF = {
  host     : 'localhost',
  user     : 'pig',
  password : '123456',
  database : 'FIRST'
};
 
app.listen(20205);
let connectionG;

function handleDisconnection() {
  let connection = mysql.createConnection(connectionCONF);
  connectionG = connection;
  connection.connect(function(err) {
      if(err) {
          setTimeout(handleDisconnection, 2000);
      }
  });
  connection.on('error', function(err) {
      console.error('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('db error执行重连:'+err.message);
          handleDisconnection();
      } else {
         throw err;
      }
   });
}

handleDisconnection()

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
start_user_about_api(connectionG, app);
start_data_about_api(connectionG, app);
start_help_about_api(connectionG, app);