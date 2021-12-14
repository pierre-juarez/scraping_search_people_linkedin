const $btnScrap = document.querySelector("#btnScrap");
const $btnStopScrap = document.querySelector("#btnStopScrap");
const $textResponse = document.querySelector("#textResponse");

$btnScrap.addEventListener('click', async () => {
    chrome.runtime.sendMessage({ action:'startScraping' },(response) => {
        const {message} = response;
        $textResponse.innerText = message;
    });    
    $textResponse.classList.remove('d-none');
    $textResponse.classList.add('d-flex');
    $btnStopScrap.classList.remove('d-none');
    $btnStopScrap.classList.add('d-flex');
    $btnScrap.classList.add('d-none');
    $btnScrap.classList.remove('d-flex');

});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){
    const {status} = request;
    if(status){
        $textResponse.innerText = status;
    }

});

$btnStopScrap.addEventListener('click', async () => {
    chrome.runtime.sendMessage({ action:'stopScrap' },(response) => {
        const {message} = response;
        $textResponse.innerText = message;
    });    
    $btnScrap.classList.remove('d-none');
    $btnScrap.classList.add('d-flex');
    $btnStopScrap.classList.add('d-none');
    $btnStopScrap.classList.remove('d-flex');
});
