import preferences from "./config.js"
import db from "./getDB.js"

export default (()=>{    
    function listaTodas(){
        let selectedCourse = preferences.get("selectedCourse");
        if(selectedCourse<0){
            $("#subject-list").append(`<li>Selecione um curso para ver a lista de disciplinas</li>`);
        }else{
            let course = db.cursos[selectedCourse]
            for(let listaDisciplinas of course.disciplinas){
                for(let materia in listaDisciplinas){
                    $("#subject-list")
                    .append(`<li id="${materia}" class="list-group-item list-group-item-action" draggable="true">
                                ${listaDisciplinas[materia].disciplina}</li>`)
                }
            }
        }
    }
    
    function listaDisciplinasSel(lista){
        for(let cod in lista){
            let disciplina = lista[cod];
            $("#subject-list")
                .append(`<li id="${cod}" class="list-group-item list-group-item-action" draggable="true">            
                            ${disciplina.disciplina}
                        </li>`);
        }
    }

    let renderList = (list=null)=>{
        $("#subject-list").children().replaceWith();
        if(list){
            if((Object.keys(list).length == 0)){
                $("#subject-list")
                .append(`<li" class="list-group-item list-group-item-action" draggable="false">            
                            Nenhuma disciplina encontrada !
                        </li>`);
            }
            listaDisciplinasSel(list)
        }else{
            listaTodas()
        }
    }

    return {
        render: renderList
    }
})()