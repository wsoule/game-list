const { response } = require('express');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.json());
app.use(express.text());
app.use(express.static('src/public'));

/**
 * 
 * @param {string} gameListId ID number that represents the list that is wanted
 * @param {*} request 
 * @param {*} response 
 */

function addGameToCollection(gameListId, request, response){
    fs.readFile(__dirname + '/../data/game-lists.json', 'utf8' , (err, data) => {
        const gameLists = JSON.parse(data);
        const gameList = gameLists.find((list) => list.id === gameListId);
        if(gameList.items.indexOf(request.body) < 0){
            gameList.items.push(request.body);
        }
        fs.writeFile(__dirname + '/../data/game-lists.json', JSON.stringify(gameLists), (err) => {
            response.json(gameList);
        });
    
    });
}
/**
 * 
 * @param {*} gameListId 
 * @param {*} request 
 * @param {*} response 
 */
function removeGameFromCollection(gameListId, request, response){
    fs.readFile(__dirname + '/../data/game-lists.json', 'utf8' , (_err, data) => {
        const gameLists = JSON.parse(data);
        const gameList = gameLists.find((list) => list.id === gameListId);
        const itemIndex = parseInt(request.body);
        if(itemIndex > -1 && itemIndex < gameList.items.length){
            gameList.items.splice(itemIndex,1);
            fs.writeFile(__dirname + '/../data/game-lists.json', JSON.stringify(gameLists),(_err) => {
                response.json(gameList);
            });
        } else{
            response.json(gameList);
        }
    });
}
/**
 * 
 * @param {*} gameListId 
 * @param {*} response 
 */
function getGameList(gameListId,response){
    fs.readFile(__dirname + '/../data/game-lists.json', 'utf8' , (err,data) => {
        const gameLists = JSON.parse(data);
        const gameList = gameLists.find((list) => list.id === gameListId);
        response.json(gameList);
    });
}
/**
 * 
 */
app.get('/played-games', (request, response) => {
    getGameList("0",response);
});

app.get('/unplayed-games', (request, response) => {
    getGameList("1",response);
});
/**
 * 
 */
app.post('/add-unplayed-game', (request, response) => {
    addGameToCollection('1', request, response);
});
app.post('/add-played-game', (request, response) => {
    addGameToCollection('0', request, response);
});
/**
 * 
 */
app.delete('/remove-played-game', (request, response) => {
    removeGameFromCollection('0', request, response);
});
app.delete('/remove-unplayed-game', (request, response) =>{
    removeGameFromCollection('1', request, response);
});
app.get('/', (request,response) => response.send("hello again"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
