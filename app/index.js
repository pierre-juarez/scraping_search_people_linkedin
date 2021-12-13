const $btnScrap = document.querySelector("#btnScrap");
const $textResponse = document.querySelector("#textResponse");

$btnScrap.addEventListener('click', async () => {
    chrome.runtime.sendMessage({ action:'scrapea' },(response) => {
        const {message} = response;
        $textResponse.innerText = message;
    });
});