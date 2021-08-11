const express = require('express');
const app = express();
const port = 3000;

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

// app.get('/played-list',(req,res));
// app.get('/unplayed',(req,res));
// res.json();

app.get('/played-games', (req, res) => {
    res.json([
        'Death Stranding',
        'Days Gone',
        'Minecraft',
        'Call of Duty: Cold War',
        'GTA 5'
    ]);
});

app.get('/unplayed-games', (req, res) => {
    res.send([
        'Hot Wheels Unleashed',
        'Deathloop',
        'Hot Wheels Unleashed',
        'Deathloop',
        'Fallout: New Vegas',
        'Minecraft 2',
        'Star Wars: Knights of the Old Republic'
    ]);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});