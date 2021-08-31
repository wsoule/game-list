const environment = {
    urls: {
        api: 'http://localhost:3001'
    }
};
function askPrompt(){
    gameTitle = prompt("Game Name");
}

async function deleteElement(webAddress, list){
    const gameArray = await deleteText(webAddress, gameTitle);
    list.innerHTML = '';
    makeListofGames(list, await gameArray.json());
}
async function addNewGameUnplayed(){
    askPrompt();
    if(gameTitle != ''){
        const unplayedGames= await postText(`${environment.urls.api}/add-unplayed-game`, gameTitle);
        unplayedList.innerHTML = '';
        makeListofGames(unplayedList, await unplayedGames.json());
    }
}
async function addNewGamePlayed(){
    askPrompt();
    if(gameTitle != ''){
        const playedGames= await postText(`${environment.urls.api}/add-played-game`, gameTitle);
        playedList.innerHTML = '';
        makeListofGames(playedList, await playedGames.json());
        removeGame(unplayedList, gameTitle);
        } 
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
function deleteText(url, body){
    return fetch(url, {
        body: body,
        headers: {
            'Content-Type':'text/plain'
        },
        method: 'DELETE'
    });
}
async function deletePlayedGame(){
    askPrompt();
    deleteElement(`${environment.urls.api}/remove-played-game`, playedList);
}
async function deleteUnplayedGame(){
    askPrompt();
    deleteElement(`${environment.urls.api}/remove-unplayed-game`, unplayedList);
}
async function removeGame(list, gameTitle){
    Array.from(list.children).forEach((listItem) => {
        if(listItem.innerText === gameTitle){
            deleteElement(`${environment.urls.api}/remove-unplayed-game`, unplayedList);
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