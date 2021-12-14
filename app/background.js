 //Mejorar con localstorage
let enlace = null, activeTabID, urlCurrent, urlHome, scrap = false;


/** Implementé esta función porque el "tabActiveId" no me aparece en el chrome.tabs.query:( */
chrome.tabs.onActivated.addListener(function(activeInfo) {
    activeTabID = activeInfo.tabId;
});


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){

    const {action, url} = request;    
    if(action === 'startScraping'){

        scrap = true;
        port = chrome.tabs.connect(activeTabID);
        port.postMessage({action: 'startScrap'});                    
        sendResponse({message:'¡Listo! En breve empezaremos a scrapear.🚀'});               

    }else if(action === 'processProfileStart'){         
        sendResponse({message: 'processProfile'});    
    }else if(action === 'sendProfile'){        
        chrome.tabs.update(activeTabID, {url: url }).then(() =>{  urlCurrent = url; });    
    }else if(action === 'return'){            
        chrome.tabs.update(activeTabID, {url: urlHome });
    }else if(action === 'endScraping'){        
        scrap = false; urlHome = null; enlace = null;
        console.log('El scraping ha finalizado');                
    }else if(action === 'stopScrap'){
        scrap = false; urlHome = null; enlace = null;
        sendResponse({message:'🚀 El scrap ha sido detenido, terminaremos esto, y aquí lo dejaremos.💀'});      
    }
    return true;
});


chrome.tabs.onUpdated.addListener( function(tabId,changeInfo, tab){
        
    
    enlace = tab.url;               

    if(changeInfo.status === 'complete'){        
        if(enlace !== null && enlace !== undefined){
            port = chrome.tabs.connect(tab.id);
            if((enlace).substr(0,56) === 'https://www.linkedin.com/search/results/people/?keywords'){                
                urlHome = enlace;
                if(scrap){
                    port.postMessage({action: 'viewProfiles'});                 
                    console.log('scrap de perfiles desde updatedOn'); 
                }              
            }else if((enlace).substr(0,28) === 'https://www.linkedin.com/in/'){                                
                
                const enlace_formated = enlace.replace('/?','?');
                                                 
                if(enlace_formated == urlCurrent){  port.postMessage({action: 'scrapingProfile'}); }                                                      
                
            }
            urlCurrent = null;
        }
        enlace = null;      
        return true;        
    }    
   
});    

