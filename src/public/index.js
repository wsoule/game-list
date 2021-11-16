const environment = {
    urls: {
        api: 'http://localhost:3000'
    }
};
function askPrompt(){
    return prompt("Game Name");
}
/**
 * 
 * @param {string} listName name of the list that is wanted to await ex. played or unplayed
 * @param {variable} gameList the HTML UL item (unplayedList or playedList)
 * @param {variable} gameTitle the game from the backend that is being sent to the back end and added to the /add-played-games page. gameTitle is usually the prompt
 */
async function addGamePromise(listName, gameList, gameTitle){
    const promisedGames= await postText(`${environment.urls.api}/add-${listName}-game`, gameTitle);
    gameList.innerHTML = '';
    makeListofGames(gameList, listName, await promisedGames.json());
}
/**
 * 
 * @param {*} list 
 * @param {*} listName 
 * @param {*} gameIndex 
 */
async function deleteElement(list, listName, gameIndex){
    const gameResponse = await deleteText(`${environment.urls.api}/remove-${listName}-game`, gameIndex);
    list.innerHTML = '';
    makeListofGames(list, listName, await gameResponse.json());
}
/**
 * 
 */
async function addNewGameUnplayed(){
    const gameTitle = askPrompt();
    if(gameTitle != ''){
        addGamePromise("unplayed", unplayedList, gameTitle);
    }
}
/**
 * 
 */
async function addNewGamePlayed(){
    const gameTitle = askPrompt();
    if(gameTitle != ''){
        await addGamePromise("played", playedList, gameTitle);
        const index = Array.from(unplayedList.children).findIndex(unplayedGame => {
            return unplayedGame.childNodes[0].textContent === gameTitle;
        });
        await deleteElement(unplayedList,"unplayed", index);
    }
}
/**
 * 
 * @param {*} list 
 * @param {*} listName 
 * @param {*} gamesList 
 */
function makeListofGames(list,listName, gamesList){
    gamesList.items.forEach((gameName, gameIndex) => {
        addGame(list,listName, gameName, gameIndex);
    }); 
}
/**
 * 
 * @param {*} list 
 * @param {*} listName 
 * @param {*} gameName 
 * @param {*} gameIndex 
 * @returns 
 */
function addGame(list, listName, gameName, gameIndex){
    if(!gameName || !gameName.trim()){
        return;
    }
    const listItem = document.createElement('li');
    const textNode = document.createTextNode(gameName);
    const buttonList = document.createElement('button');
    buttonList.innerText = 'X';
    buttonList.classList.add('delete-button');
    buttonList.addEventListener("click", function(){
        deleteElement(list, listName, gameIndex);
    });
    listItem.appendChild(textNode);
    listItem.appendChild(buttonList)
    list.appendChild(listItem); 

}
/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @returns 
 */
function postText(url, body){
    return fetch(url, {
        body: body,
        headers: {
            'Content-Type':'text/plain'
        },
        method: 'POST'
    });
}
/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @returns 
 */
function deleteText(url, body){
    return fetch(url, {
        body: body,
        headers: {
            'Content-Type':'text/plain'
        },
        method: 'DELETE'
    });
}
/**
 * 
 */
const playedList = document.getElementById('played-list');
const unplayedList = document.getElementById('unplayed');

/**
 * 
 * @param {*} url 
 * @returns 
 */
async function getJson(url){
    return (await fetch(url)).json();
}
/**
 * 
 * @param {*} url 
 * @returns 
 */
async function getString(url){
    return (await fetch(url)).toString();
}
/**
 * 
 */
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