// The index.js file of your application
// import the required libraries
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

// port of server
const port = 8088;


// set up public folder as source of static files (CSS, client side JS)
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// add in utilities custom support library
const utilities = require('./utilities');

// setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'hanna',
    password: '8!Y@nagi',
    database: 'mysmarthome'
});

// actually connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// setup routes
require('./routes/main')(app);

// perfrom remaining setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// start listening on specified port
app.listen(port, () => console.log(`Example app listening on port ${port}!`));