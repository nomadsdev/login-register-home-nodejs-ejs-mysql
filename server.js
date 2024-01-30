const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_register_home'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home.ejs');
});
  
app.get('/login', (req, res) => {
    res.render('login.ejs');
});
  
app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length > 0) {
        const user = results[0];
        if (user.password === password) {
          res.send('Login successful');
        } else {
          res.send('Incorrect password');
        }
      } else {
        res.send('User not found');
      }
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
      if (err) {
        throw err;
      }
      res.send('Registration successful');
    });
});

app.listen(port, () => {
    console.log('Server is running');
});