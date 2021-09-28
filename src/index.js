const environment = {
    urls: {
        api: 'http://localhost:3001'
    }
};
function askPrompt(){
    return prompt("Game Name");
}

async function deleteElement(list, listName, gameIndex){
    const gameResponse = await deleteText(`${environment.urls.api}/remove-${listName}-game`, gameIndex);
    list.innerHTML = '';
    makeListofGames(list, listName, await gameResponse.json());
}
async function addNewGameUnplayed(){
    const gameTitle = askPrompt();
    if(gameTitle != ''){
        const unplayedGames= await postText(`${environment.urls.api}/add-unplayed-game`, gameTitle);
        unplayedList.innerHTML = '';
        makeListofGames(unplayedList, "unplayed", await unplayedGames.json());
    }
}
async function addNewGamePlayed(){
    const gameTitle = askPrompt();
    if(gameTitle != ''){
        const playedGames= await postText(`${environment.urls.api}/add-played-game`, gameTitle);
        playedList.innerHTML = '';
        makeListofGames(playedList, "played" ,await playedGames.json());
        removeGame(unplayedList, gameTitle);
        } 
    }

function makeListofGames(list,listName, games){
    games.forEach((gameName, gameIndex) => {
        addGame(list,listName, gameName, gameIndex);
    }); 

}
function addGame(list, listName, gameName, gameIndex){
    if(!gameName || !gameName.trim()){
        return;
    }
    const listItem = document.createElement('li');
    const textNode = document.createTextNode(gameName);
    const buttonList = document.createElement('button');
    buttonList.innerText = 'Delete';
    buttonList.classList.add('delete-button');
    buttonList.addEventListener("click", function(){
        deleteElement(list, listName, gameIndex);
    });
    listItem.appendChild(textNode);
    listItem.appendChild(buttonList)
    //console.log(listItem);
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
// async function deletePlayedGame(){
//     //askPrompt();
//     deleteElement(`${environment.urls.api}/remove-played-game`, playedList);
//     //console.log("deletePlayedGame");
// }
// async function deleteUnplayedGame(){
//     //askPrompt();
//     deleteElement(`${environment.urls.api}/remove-unplayed-game`, unplayedList);
// }
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
    makeListofGames(unplayedList, "unplayed", unplayedGames);
    makeListofGames(playedList, "played", playedGames);
}
main();