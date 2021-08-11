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
    if(!gameName || !gameName.trim()){
        return;
    }
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

async function getJson(url){
    return (await fetch(url)).json();
}
async function main(){
    const controller = document.getElementById('controller');
    controller.src = `${environment.urls.api}/assets/smile.png`;
    const [unplayedGames, playedGames] = await Promise.all([
        getJson(`${environment.urls.api}/unplayed-games`), 
        getJson(`${environment.urls.api}/played-games`)
    ]);
    makeListofGames(unplayedList,unplayedGames);
    makeListofGames(playedList, playedGames);
}
main();