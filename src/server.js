
const { response } = require('express');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;
function addGameToCollection(webAddress, req, res){
    fs.readFile(__dirname + webAddress, 'utf8' , (err, data) => {
        const dataArray = JSON.parse(data);
        if(dataArray.indexOf(req.body) < 0){
            dataArray.push(req.body);
        }
        const dataString = JSON.stringify(dataArray);
        fs.writeFile(__dirname + webAddress, dataString, (err) => {
            res.send(dataString);
        });
    
    });
}
function removeGameFromCollection(webAddress, req, res){
    fs.readFile(__dirname + webAddress, 'utf8' , (_err, data) => {
        const dataArray = JSON.parse(data);
        const itemIndex = parseInt(req.body);
        console.log("itemIndex", itemIndex, typeof itemIndex);
        if(itemIndex > -1 && itemIndex<dataArray.length){
            dataArray.splice(itemIndex,1);
            const dataString = JSON.stringify(dataArray);
            fs.writeFile(__dirname + webAddress, dataString,(_err) => {
                res.send(dataString);
            });
        } else{
            res.send(data);
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
app.use('/assets', express.static('assets'));

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
app.post('/add-unplayed-game', (req, res) => {
    addGameToCollection('/../data/unplayed-games.json', req, res);
});
app.post('/add-played-game', (req, res) => {
    addGameToCollection('/../data/played-games.json', req, res);
});
app.delete('/remove-played-game', (req, res) => {
    removeGameFromCollection('/../data/played-games.json', req, res);
});
app.delete('/remove-unplayed-game', (req, res) =>{
    removeGameFromCollection('/../data/unplayed-games.json', req, res);
});
app.get('/', (req,res) => res.send("hello again"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
