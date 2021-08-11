const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });
app.get('/played-games', (req, res) => {
    fs.readFile(__dirname + '/../data/played-games.json', 'utf8' , (err, data) => {
        res.send(data);
    });
});
app.get('/unplayed-games', (req, res) => {
    fs.readFile(__dirname + '/../data/unplayed-games.json', 'utf8' , (err, data) => {
        res.send(data);
    });
});
app.get('/', (req,res) => res.send("hello again"));
app.use('/assets', express.static('assets'));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
