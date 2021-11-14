const { response } = require('express');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.static('src/public'));
function addGameToCollection(gameListId, req, res){
    fs.readFile(__dirname + '/../data/game-lists.json', 'utf8' , (err, data) => {
        const gameLists = JSON.parse(data);
        const gameList = gameLists.find((list) => list.id === gameListId);
        if(gameList.items.indexOf(req.body) < 0){
            gameList.items.push(req.body);
        }

        fs.writeFile(__dirname + '/../data/game-lists.json', JSON.stringify(gameLists), (err) => {
            res.json(gameList);
        });
    
    });
}
function removeGameFromCollection(gameListId, req, res){
    fs.readFile(__dirname + '/../data/game-lists.json', 'utf8' , (_err, data) => {
        const gameLists = JSON.parse(data);
        const gameList = gameLists.find((list) => list.id === gameListId);
        const itemIndex = parseInt(req.body);
        if(itemIndex > -1 && itemIndex < gameList.items.length){
            gameList.items.splice(itemIndex,1);
            fs.writeFile(__dirname + '/../data/game-lists.json', JSON.stringify(gameLists),(_err) => {
                res.json(gameList);
            });
        } else{
            res.json(gameList);
        }
    });
}
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.json());
app.use(express.text());
function getGameList(gameListId,res){
    fs.readFile(__dirname + '/../data/game-lists.json', 'utf8' , (err,data) => {
        const gameLists = JSON.parse(data);
        const gameList = gameLists.find((list) => list.id === gameListId);
        res.json(gameList);
    });
}
app.get('/played-games', (req, res) => {
    getGameList("0",res);
});

app.get('/unplayed-games', (req, res) => {
    getGameList("1",res);
});

app.post('/add-unplayed-game', (req, res) => {
    addGameToCollection('1', req, res);
});
app.post('/add-played-game', (req, res) => {
    addGameToCollection('0', req, res);
});
app.delete('/remove-played-game', (req, res) => {
    removeGameFromCollection('0', req, res);
});
app.delete('/remove-unplayed-game', (req, res) =>{
    removeGameFromCollection('1', req, res);
});
app.get('/', (req,res) => res.send("hello again"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
