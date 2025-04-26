import preferences from "./config.js"
import db from "./getDB.js"

export default (()=>{
    function searchInSelectedCourse(searchTerm){    
        let selectedCourse = db.cursos[(preferences.get("selectedCourse"))];
        let res = searchInLista(selectedCourse.disciplinas, searchTerm);
        return res;
    }

    function searchInLista(arrDisciplinas, searchTerm){
        let res = [];
        searchTerm = searchTerm.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, ""); 
        arrDisciplinas.forEach(lista => {
            let tmp = Object.entries(lista);
            let tmpRes = tmp.filter((d)=>{
                let dName = d[1].disciplina.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "");
                if(dName.includes(searchTerm)){
                    return d;
                }
            })
            res.push(tmpRes);
        });
        res = res[0].concat(res[1]);
        return Object.fromEntries(res)
    }

    return{
        search: searchInSelectedCourse,
    }
})()

