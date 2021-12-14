const sleep = (seconds) => {
  return new Promise((resolve) =>{
    setTimeout(function(){ resolve(); },seconds*1000);
  });
}

const createPopup = ()=>{
  const styleDiv = "position: fixed;z-index: 2000;width:100%; top: 0px;left: 0px;overflow: visible;display: flex;align-items: flex-end;background-color: lightgray;font-size: 10px;padding: 10px;";
  const stylePre = "position: relative;max-height: 400px;overflow: auto;width: 100%;"
  const div = document.createElement('div')
  div.id = "krowdy-message"
  div.style = styleDiv

  const pre = document.createElement('pre')
  pre.id = "krowdy-pre"
  pre.style = stylePre

  const button = document.createElement('button')
  
  button.id = "krowdy-button"
  button.style = "background: gray;border: 2px solid;padding: 8px;"
  button.innerText ="Aceptar"

  const bodyElement = document.querySelector('div.body')
  
  bodyElement.appendChild(div)

  pre.innerText = "Estamos extrayendo la información!!!!"
  div.appendChild(pre)
  div.appendChild(button)

  button.addEventListener("click",()=>{ div.remove(); });

  return {div,pre,button}
}

const scrapingProfile = async() => {  

    const selectorProfile = {
      name : '.text-heading-xlarge',
      pais : 'div.mt2>div.pb2>span.text-body-small',
      showContactInfo : '.pv-text-details__left-panel > .pv-text-details__separator > a',
      phone : 'section.ci-phone > ul > li > span',
      closeContacInfo: '.artdeco-modal__dismiss',
      experienceInformation:{
        list : '#experience-section > ul > li',        
        groupByCompany:{
            identify:'.pv-entity__position-group',
            company: 'div.pv-entity__company-summary-info > h3 > span:nth-child(2)',
            list: 'section > ul > li',
            title: 'div > div > div > div > div > div > h3 > span:nth-child(2)',
            date:'div > div > div > div > div > div > div > h4 > span:nth-child(2)',
            description: '.pv-entity__description'
        },
        information:{
            title: 'section > div > div > a > div.pv-entity__summary-info > h3',
            company:'section > div > div > a > div.pv-entity__summary-info > p.pv-entity__secondary-title',
            date: 'section > div > div > a > div.pv-entity__summary-info > div > h4.pv-entity__date-range > span:nth-child(2)',
            description: 'section > div > div > div > p'
        }
    },
    educationInformation:{
        list: '#education-section > ul > li',
        institution :'div > div > a > div.pv-entity__summary-info > div > h3',
        career : 'div > div > a > div.pv-entity__summary-info > div > p > span:nth-child(2)',
        date : 'div > div > a > div.pv-entity__summary-info > p > span:nth-child(2)'
    }    
    };
  
    let profile = {};
  
    const getContactInfo = async() => {
  
      const autoScrollToElement = async function(selectorCSS){
        var exists = document.querySelector(selectorCSS);        
        while(exists){
  
          let maxScrollTop = document.body.clientHeight - window.innerHeight;
          let elementScrollTop = document.querySelector(selectorCSS).offsetHeight;
          let currentScrollTop = window.scrollY;
  
          if(maxScrollTop <= currentScrollTop + 20 || elementScrollTop <= currentScrollTop){
            break;
          }
  
          await sleep(0.10);
  
          let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
          window.scrollTo(0, newScrollTop);
          
  
        }
        // console.log('Finish autoscroll to element %s',selectorCSS);
  
        return new Promise(function(resolve){          
          resolve();
        });
      }      

      const {name, pais, showContactInfo, phone, closeContacInfo, experienceInformation, educationInformation} = selectorProfile
      const nameElement =  document.querySelector(name);
      const paisElement =  document.querySelector(pais);
      const showContactInfoElement =  document.querySelector(showContactInfo);                  
      
      profile.name = nameElement.innerText;
      profile.pais = paisElement.innerText;    
      showContactInfoElement.click();    
  
      /*** scroll automático y scrap de experiencias */
      await autoScrollToElement('body');
      
      await sleep(5);      
  
      const phoneElement =  document.querySelector(phone);
      const closeContactInfoElement = document.querySelector(closeContacInfo);

      profile.phone = (phoneElement === null) ? null : phoneElement.innerText;

      /*** Obtención de información de Experiencias */
      const experiencesList = document.querySelectorAll(experienceInformation.list);
      let experiencesArray = Array.from(experiencesList);
      const uniqueExperienceList = experiencesArray.filter(elem => {
        let experienceItem = elem.querySelectorAll(experienceInformation.groupByCompany.identify);
        return experienceItem.length ==0;
      });

      const experiences = uniqueExperienceList.map( elem => {
        const title = elem.querySelector(experienceInformation.information.title)?.innerText;
        const date = elem.querySelector(experienceInformation.information.date)?.innerText;
        const company = elem.querySelector(experienceInformation.information.company)?.innerText;
        const description = elem.querySelector(experienceInformation.information.description)?.innerText;
        
        return {title,date,company,description}
      });

      const groupCompaniesList = experiencesArray.filter(elem => {
        let groupCompanyExperience = elem.querySelectorAll(experienceInformation.groupByCompany.identify)  
        return groupCompanyExperience.length >0
      });

      for(let i = 0; i< groupCompaniesList.length;i++){
        const item = groupCompaniesList[i]
        const company = item.querySelector(experienceInformation.groupByCompany.company)?.innerText
        const itemsCompanyGroupList = item.querySelectorAll(experienceInformation.groupByCompany.list)
        const itemsCompanyGroupArray = Array.from(itemsCompanyGroupList)

        const experiencesData = itemsCompanyGroupArray.map(elem => {
            const title = elem.querySelector(experienceInformation.groupByCompany.title)?.innerText
            const date = elem.querySelector(experienceInformation.groupByCompany.date)?.innerText
            const description = elem.querySelector(experienceInformation.groupByCompany.description)?.innerText
            
            return {title,date,company,description}
        });

        experiences.push(...experiencesData);        
      }

      profile.experiences = experiences;      

      /*** Obtención de Información de Educación */
      const educationList = document.querySelectorAll(educationInformation.list);
      const educationArray = Array.from(educationList);
      const educations = educationArray.map(elem => {
        const institution = elem.querySelector(educationInformation.institution)?.innerText
        const career = elem.querySelector(educationInformation.career)?.innerText
        const date = elem.querySelector(educationInformation.date)?.innerText
        return {institution,career,date}
      });

      profile.educations = educations;


      closeContactInfoElement.click(); //Cierra el modal de información      
  
    }
    
    const {div, pre, button} = createPopup();
    pre.innerText = 'Escaneando perfil';
    chrome.runtime.sendMessage({status:'Estamos analizando el perfil.🤓'});
    
    await getContactInfo();

    pre.innerText = 'Perfil escaneado con exito';
    
    await sleep(1);
    pre.innerText = JSON.stringify(profile,null,2);
    chrome.runtime.sendMessage({status:'Información guardada bajo llave.🤐'});

    let profilesSave = localStorage.getItem('profilesLinkedin');
    let dataProfilesSave = localStorage.getItem('dataProfiles');
    const profilesScrap = [];


    if(dataProfilesSave != null){      
      let dataProfilesArray = JSON.parse(dataProfilesSave);
      const dataProfileProcess = dataProfilesArray.map( (elem) => {
          if(elem.name === profile.name){ elem.scrap = true; }
          return elem;
      });
      localStorage.setItem('dataProfiles', JSON.stringify(dataProfileProcess));      
    }

    
    profilesScrap.push(profile);
    
  
    if(profilesSave == null){      
      localStorage.setItem('profilesLinkedin', JSON.stringify(profilesScrap));
    } else {        
      let data = JSON.parse(profilesSave);
      data.push(profile);      
      localStorage.setItem('profilesLinkedin', JSON.stringify(data));
    }    

    await sleep(3);
    chrome.runtime.sendMessage({action: 'return',status:'Volvamos a nuestra lista de resultados. 👀🚀'});
  
}

const viewProfiles = async() => {

    let dataProfilesSave = localStorage.getItem('dataProfiles');

    const resultsInformation = {
        list : 'ul.reusable-search__entity-result-list > li',
        profilesLink: '.entity-result__title-text a.app-aware-link',
        profilesName: 'span[aria-hidden="true"]'
    };
  
    let profiles = {};
  
    const getInformationProfile = async() => {  
  
      const {profilesLink, profilesName} = resultsInformation      
      const linksElement =  document.querySelectorAll(profilesLink);            
      
        /*** Obtención de Información de Educación */
        const linksArray = Array.from(linksElement);
        const dataProfiles = linksArray.map(elem => {          
          const link = elem.href;
          const name = elem.querySelector(profilesName).innerText;
          const scrap = false;          
          return {link, name, scrap}
        });
        
      profiles = dataProfiles;
    }
      
    await getInformationProfile();

    

    if(dataProfilesSave == null){      
      localStorage.setItem('dataProfiles', JSON.stringify(profiles));            
    }

    function saveDataProfiles(filename, content) {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
      element.setAttribute('download', filename);
  
      element.style.display = 'none';
      document.body.appendChild(element);
  
      element.click();
  
      document.body.removeChild(element);
  }
  
    
    chrome.runtime.sendMessage({action: 'processProfileStart',status:'Iniciando scrap de los perfiles😎...'}, async function(response){
          const {message} = response;
                    
          if(message === 'processProfile'){

              /**Recorrer el contenido del localstorage */

              let dataProfiles = JSON.parse(localStorage.getItem("dataProfiles")), contador = 0;

              for (let i = 0; i < dataProfiles.length; i++) {

                const elem = dataProfiles[i];

                if(!elem.scrap){
                    await sleep(5);
                    saveDataProfiles(`${elem.name}.txt`,elem);
                    chrome.runtime.sendMessage({action: 'sendProfile', url: elem.link, name: elem.name, status:`Abriendo el perfil de: ${elem.name}.😬`});
                    return;
                }else{
                    contador = contador + 1;                  
                }                
                
              }
              
              if(contador >=  10){
                  chrome.runtime.sendMessage({action: 'endScraping',status:'¡El scraping ha finalizado!🥳 Hemos guardado los datos por ti en un archivo ".txt"🧐'});           
                  return;
              }

              
          }
      }
  );   
  
}

(function(){
    chrome.runtime.onConnect.addListener(function(port){
        port.onMessage.addListener(async (message) => {
          const {action} = message;  

            if( action === 'startScrap' || action === 'viewProfiles'){
                if(action === 'startScrap'){ localStorage.removeItem("dataProfiles"); localStorage.removeItem("profilesLinkedin"); }
                await viewProfiles();                
            }else if(action === 'scrapingProfile'){                              
                await scrapingProfile();              
            }

        });
    })
})()
  

