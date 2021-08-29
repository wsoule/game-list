const environment = {
    urls: {
        api: 'http://localhost:3001'
    }
};
async function addNewGameUnplayed(){
    let gameTitle = prompt('Game Title');
    const unplayedGames= await postText(`${environment.urls.api}/add-unplayed-game`, gameTitle);
    unplayedList.innerHTML = '';
    makeListofGames(unplayedList, await unplayedGames.json());
}
async function addNewGamePlayed(){
    let gameTitle = prompt('Game Title');
    const playedGames= await postText(`${environment.urls.api}/add-played-game`, gameTitle);
    playedList.innerHTML = '';
    makeListofGames(playedList, await playedGames.json());
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
function postText(url, body){
    return fetch(url, {
        body: body,
        headers: {
            'Content-Type':'text/plain'
        },
        method: 'POST'
    });
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
async function getString(url){
    return (await fetch(url)).toString();
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