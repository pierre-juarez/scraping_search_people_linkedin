let tabSelected = null; //Mejorar con localstorage
let url = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    const {action} = request;
    if(action === 'scrapea'){
        sendResponse({message:'Escucha de la extensión activa!'});        
    }



    
    return true;
});

// chrome.tabs.onUpdated.addListener(function(tabId,changeInfo, tab){
//     if(tabId == tabSelected){
//         if(changeInfo.status == 'complete'){
//             scrapProfile();
//             tabSelected = null;
//             // port = chrome.tabs.connect(tabSelected);
//             // port.postMessage({action: 'scrapingProfile'});
//             // tabSelected = null;
//             // return;
//         }
//     }
//     return true;
// });

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo, tab){
    
    /** Url: https://www.linkedin.com/search/results/people/?keywords=developer , 57 cara */
    /*** Puedo crear una variable que guarde la primera url como null en url y luego recién se carga */
    url = null;
    if(changeInfo.status === 'complete'){        
        url = tab.url;        
        if(url !== null && (url).substr(0,56) === 'https://www.linkedin.com/search/results/people/?keywords'){        
                console.log('Iniciamos el scrap de perfiles');
                return;        
        }        
    }
    return
    url = null;
    return;
    // if(tabId == tabSelected){
    //     if(changeInfo.status == 'complete'){
    //         scrapProfile();
    //         tabSelected = null;
    //         // port = chrome.tabs.connect(tabSelected);
    //         // port.postMessage({action: 'scrapingProfile'});
    //         // tabSelected = null;
    //         // return;
    //     }
    // }
    // return true;
});    
// async function scrapProfile(){
//     const [tab] = await chrome.tabs.query({active:true, currentWindow: true});
//     const port = chrome.tabs.connect(tab.id);
//     port.postMessage({action: 'scrapingProfile'});
//     // port = chrome.tabs.connect(tabSelected);
// };