let tabSelected = null; //Mejorar con localstorage
let enlace = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    
    console.log("🚀 ~ file: background.js ~ line 5 ~ chrome.runtime.onMessage.addListener ~ request", request)
    console.log("🚀 ~ file: background.js ~ line 5 ~ chrome.runtime.onMessage.addListener ~ sender", sender)        

    const {action, url} = request;
    console.log("🚀 ~ file: background.js ~ line 7 ~ chrome.runtime.onMessage.addListener ~ action", action)
    if(action === 'scrapea'){
        sendResponse({message:'Escucha de la extensión activa!'});        
    }else if(action === 'processProfileStart'){         
        sendResponse({message: 'processProfile'});    
    }else if(action === 'sendProfile'){
        console.log('Ingresó send profile');
        // chrome.tabs.query({ active:true, currentWindow:true}).then((tabs) => {
        //     const [tab] = tabs;                                  
        //     console.log('Procesando...');   
        //     console.log("🚀 ~ file: background.js ~ line 14 ~ chrome.tabs.query ~ tab", tab)
        //     console.log("🚀 ~ file: background.js ~ line 10 ~ chrome.runtime.onMessage.addListener ~ url", url)
            
        //     // chrome.tabs.update(tab.id, {url: url }).then(() =>{
        //     //     sendResponse({message:'Abriendo perfil'});                
        //     //     console.log('Open profile');
        //     //     // port = chrome.tabs.connect(tab.id);
        //     //     // port.postMessage({action: 'scrapingProfile'});            
        //     //     console.log('Iniciamos el scrap de un solo perfil');
        //     // });
        // });
    }
    return true;
});


chrome.tabs.onUpdated.addListener(function(tabId,changeInfo, tab){
    
    /** Url: https://www.linkedin.com/search/results/people/?keywords=developer , 57 cara */
    /*** Puedo crear una variable que guarde la primera url como null en url y luego recién se carga */
    enlace = tab.url;           
    if(changeInfo.status === 'complete'){        
        console.log("🚀 ~ file: background.js ~ line 34 ~ chrome.tabs.onUpdated.addListener ~ enlace", enlace)
        if(enlace !== null && enlace !== undefined && (enlace).substr(0,56) === 'https://www.linkedin.com/search/results/people/?keywords'){        
            // viewProfiles();
            port = chrome.tabs.connect(tab.id);
            port.postMessage({action: 'viewProfiles'});            
            console.log('Iniciamos el scrap de perfiles');
        }        
        enlace = null;      
    }
    return true;
   
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

// async function viewProfiles(){
//     const [tab] = await chrome.tabs.query({active:true, currentWindow: true});
//     console.log("🚀 ~ file: background.js ~ line 57 ~ viewProfiles ~ tab", tab)
    
//     // port = chrome.tabs.connect(tabSelected);
// };