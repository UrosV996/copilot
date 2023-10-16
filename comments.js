//Create web server
const express = require('express');
const app = express();
const port = 3000;
//Create a connection to the database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'reddit'
});
//Connect to the database
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});
//Set up the server
app.use(express.json());
app.use('/assets', express.static('assets'));
//Get the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
//Get the posts
app.get('/posts', (req, res) => {
    connection.query('SELECT * FROM posts;', (err, rows) => {
        if (err) {
            console.log(err.toString());
            res.status(500).send('Database error');
            return;
        }
        res.json(rows);
    });
});
//Post a new post
app.post('/posts', (req, res) => {
    const title = req.body.title;
    const url = req.body.url;
    const sql = `INSERT INTO posts (title, url) VALUES ('${title}', '${url}');`;
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err.toString());
            res.status(500).send('Database error');
            return;
        }
        res.json(rows);
    });
});
//Update the score
app.put('/posts/:id/:action', (req, res) => {
    const action = req.params.action;
    const id = req.params.id;
    if (action === 'upvote') {
        connection.query(`UPDATE posts SET score = score + 1 WHERE id = ${id};`, (err, rows) => {
            if (err) {
                console.log(err.toString());
                res.status(500).send('Database error');
                return;
            }
            res.json(rows);
        });
    } else if (action === 'downvote') {
        connection.query(`UPDATE posts SET score = score - 1 WHERE id = ${id};`, (err, rows) => {
            if (err) {
                console.log(err.toString());
                res.status(500).send('Database error