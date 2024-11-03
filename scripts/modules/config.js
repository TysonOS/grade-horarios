export default (function(){
    const defaultConfigs = {
        autosave: true,
        locked : false,
        selectedCourse:-1,
        hiddenTimes:[true, false, false],
        hideSaturday: true
    }

    let userConfigs = (()=>{
        let savedConfigs = localStorage.getItem("preferences");
        if(!savedConfigs){
            console.log("Nenhuma configuração salva, carregando configurações padrões");
            return {...defaultConfigs};
        }else{
            console.log("Carregando configurações salvas!!");
            return {...(JSON.parse(savedConfigs))};
        }
    })()

    let setConfig = function(key, value){
        if(userConfigs.hasOwnProperty(key)){
            userConfigs[key]=value;
            saveConfigs();    
        }
    }
    
    let getConfig = function(key = null){
        if(key){
            if(userConfigs.hasOwnProperty(key)){
                return userConfigs[key];
            }
        }
        return userConfigs;
    }
    
    let resetConfigs = ()=>{
        if(localStorage.getItem("preferences")){
            localStorage.removeItem("preferences");
        } 
        userConfigs = {...defaultConfigs}
    }

    let saveConfigs = ()=>{
        localStorage.setItem("preferences", JSON.stringify(userConfigs))
    }

    return {
        get: getConfig,
        set: setConfig,
        reset: resetConfigs
    }
})()