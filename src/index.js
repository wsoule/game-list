const environment = {
    urls: {
        api: 'http://localhost:3000'
    }
};
function addNewGameUnplayed(){
    let gameTitle = prompt('Game Title');
    addGame(unplayedList,gameTitle);
}
function addNewGamePlayed(){
    let gameTitle = prompt('Game Title');
    addGame(playedList,gameTitle);
    removeGame(unplayedList, gameTitle);
}
function makeListofGames(list, games){
    games.forEach((game) => addGame(list,game)); 
}
function addGame(list, gameName){
    const listItem = document.createElement('li');
    listItem.innerText = gameName;
    list.appendChild(listItem);
}
function removeGame(list, gameName){
    Array.from(list.children).forEach((listItem) => {
        if(listItem.innerText === gameName){
            list.removeChild(listItem);
        }
    });
}
const playedList = document.getElementById('played-list');
const unplayedList = document.getElementById('unplayed');

function getJson(url){
    return fetch(url).then((res) => res.json());
}
function main(){
    getJson(`${environment.urls.api}/unplayed-games`).then((unplayedGames) => {
        makeListofGames(unplayedList, unplayedGames);
    });
    getJson(`${environment.urls.api}/played-games`).then((playedGames) => {
        makeListofGames(playedList, playedGames);
    });
}
main();