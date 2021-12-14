 //Mejorar con localstorage
let enlace = null, activeTabID, urlCurrent, estado = false, urlHome;


/** Implementé esta función porque el "tabActiveId" no me aparece en el chrome.tabs.query:( */
chrome.tabs.onActivated.addListener(function(activeInfo) {
    activeTabID = activeInfo.tabId;
    console.log("🚀 ~ file: background.js ~ line 7 ~ chrome.tabs.onActivated.addListener ~ activeTabID", activeTabID)
});


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){
    // console.log("🚀 ~ file: background.js ~ line 12 ~ chrome.tabs.onActivated.addListener ~ activeTabID", activeTabID)
    // console.log("🚀 ~ file: background.js ~ line 5 ~ chrome.runtime.onMessage.addListener ~ request", request)
    // console.log("🚀 ~ file: background.js ~ line 5 ~ chrome.runtime.onMessage.addListener ~ sender", sender)        

    const {action, url} = request;
    // console.log("🚀 ~ file: background.js ~ line 7 ~ chrome.runtime.onMessage.addListener ~ action", action)
    if(action === 'scrapea'){
        sendResponse({message:'Escucha de la extensión activa!'});        
    }else if(action === 'processProfileStart'){         
        sendResponse({message: 'processProfile'});    
    }else if(action === 'sendProfile'){
        console.log('Ingresó send profile');

        chrome.tabs.update(activeTabID, {url: url }).then(() =>{
            // sendResponse({message:'Abriendo perfil'});  
            urlCurrent = url;              
            console.log('Open profile');
           
        });
        // chrome.tabs.query({ active:true, currentWindow:true}).then((tabs) => {
        //     const [tab] = tabs;                                  
        //     console.log('Procesando...');   
        //     console.log("🚀 ~ file: background.js ~ line 14 ~ chrome.tabs.query ~ tab", tab)
        //     console.log("🚀 ~ file: background.js ~ line 10 ~ chrome.runtime.onMessage.addListener ~ url", url)
            
        // });
    }else if(action === 'return'){
        console.log("🚀 ~ file: background.js ~ line 40 ~ chrome.runtime.onMessage.addListener ~ action", action)
        
        chrome.tabs.update(activeTabID, {url: urlHome }).then(() =>{                                
            console.log('Open url home...');           
        });
    }else if(action === 'endScraping'){
        /** Mostrar mensaje */
        console.log('El scraping ha finalizado');
        
    }
    return true;
});


chrome.tabs.onUpdated.addListener( function(tabId,changeInfo, tab){
    
    /** Url: https://www.linkedin.com/search/results/people/?keywords=developer , 57 cara */
    /*** Puedo crear una variable que guarde la primera url como null en url y luego recién se carga */
    enlace = tab.url;               

    // console.log("🚀 ~ file: background.js ~ line 57 ~ chrome.tabs.onUpdated.addListener ~ enlace", enlace)                
    // console.log("🚀 ~ file: background.js ~ line 57 ~ chrome.tabs.onUpdated.addListener ~ urlCurrent", urlCurrent)
    // console.log("🚀 ~ file: background.js ~ line 3 ~ false", false)

    if(changeInfo.status === 'complete'){        
        console.log("🚀 ~ file: background.js ~ line 34 ~ chrome.tabs.onUpdated.addListener ~ enlace", enlace)
        if(enlace !== null && enlace !== undefined){
            port = chrome.tabs.connect(tab.id);
            if((enlace).substr(0,56) === 'https://www.linkedin.com/search/results/people/?keywords'){
                urlHome = enlace;
                port.postMessage({action: 'viewProfiles'});            
                console.log('Iniciamos el scrap de perfiles');
            }else if((enlace).substr(0,28) === 'https://www.linkedin.com/in/'){                
                console.log(`Enlace: ${enlace} ->  urlcurrent: ${urlCurrent}`);
                const enlace_formated = enlace.replace('/?','?');
                console.log('enlc = url',enlace_formated == urlCurrent);
                let first;
                                 
                if(enlace_formated == urlCurrent){
                   
                    port.postMessage({action: 'scrapingProfile'});    
                    console.log('Iniciamos el scrap de un solo perfil');                    
                    // return true;
                }                                      
                first = false;
                urlCurrent = null;
                // return true;
            }
        }
        enlace = null;      
        return true;        
    }    
   
});    

