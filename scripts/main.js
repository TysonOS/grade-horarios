import preferences from "./modules/config.js"
import db from "./modules/getDB.js"
import subjectList from "./modules/subjectList.js";
import search from "./modules/search.js";

const emptyTd = $(`<td class="empty text-center"> - </td>`);

$(document).ready(function(){
    $("body").css("user-select", "none") 
    preferenceRender();
    timeTableLoad();
    subjectList.render()
    dragNDropHandler();
    removeSubjectHandler();
    $("[draggable=true]").css("cursor","grab")
    $("#purgeDataBtn").on("click", function(){
        if(localStorage.class_timetable){
            $("#alertZone").html(`
                <div class="alert alert-danger alert-dismissible" role="alert">
                    <div>Deseja realmente limpar todos os dados?</div>
                    <button id="purgeConfirm" type="button" class="btn">Sim</button>
                    <button type="button" class="btn" data-bs-dismiss="alert">Não</button>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`
            )
            $("#optionsBtn").click();
            $("#purgeConfirm").one("click", function(){ purgeData()});
        }
    })
    $("#autoSaveSwitch, #lockEditSwitch").on("change", function(){
        configHandler();
    });
    
    const toastTrigger = document.getElementById('liveToastBtn')
    const usageTipsToast = document.getElementById('usageTipsToast')
    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(usageTipsToast)
        toastTrigger.addEventListener('click', () => {
            toastBootstrap.show();
        })
    }
    const courseSelect = $("#course-selector");
    subjectList.render()
    //timetable.draw()
    db.cursos.forEach((curso, i) => {
       //console.log(curso, i)
        courseSelect.append(`<option value="${i}">${curso.nome}</option>`);
    });
    courseSelect.val(String(preferences.get("selectedCourse")));
    courseSelect.change(function(){
        preferences.set("selectedCourse", Number($(this).val()));
        subjectList.render();
        if($(this).val() != -1) $("#search").removeClass("visually-hidden");
        
    })

    $("#search").keyup($.debounce(300, searchRender))
    window.DragDropTouch.enable(document, document, {dragScrollPercentage:90, isPressHoldMode:true})
})

function searchRender(ev){
    if(ev.target.value.length){
        subjectList.render(search.search(ev.target.value));
    }
    else{
        subjectList.render()
    }
}

function configHandler(){
    preferences.set("autosave", $("#autoSaveSwitch").prop("checked"));
    preferences.set("locked", $("#lockEditSwitch").prop("checked"));
    if(preferences.get("autosave")){
        $("#saveBtn").addClass("visually-hidden");
    }else{
        $("#saveBtn").removeClass("visually-hidden");
    }
    preferences.save();
}

function preferenceRender(){
        $("#autoSaveSwitch").prop("checked", preferences.get("autosave"));
        $("#lockEditSwitch").prop("checked", preferences.get("locked"));
        if(preferences.get("autosave")){
            $("#saveBtn").addClass("visually-hidden");
        }else{
            $("#saveBtn").removeClass("visually-hidden");
        }
}

const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const horarios = {
    1: ["13:15", "14:05"],
    2: ["14:05", "14:55"],
    3: ["15:10", "16:00"],
    4: ["16:00", "16:50"],
    5: ["16:50", "17:40"],
    6: ["17:40", "18:30"],
    7: ["18:40", "19:30"],
    8: ["19:30", "20:20"],
    9: ["20:20", "21:10"],
    10: ["21:10", "22:00"]
};

function dragNDropHandler(){
    let dragged=null;
    $("#class-schedule").delegate("td", "dragover", function(ev){
        ev.preventDefault();
    }).delegate("td","dragenter", function(){
        $(this).toggleClass("table-warning", true)
    }).delegate("td","dragleave", function(){
        $(this).toggleClass("table-warning", false)
    })
    $("#subject-list, #class-schedule").delegate("[draggable='true']","dragstart", function(ev){
        dragged = $(this);
        console.log(dragged, ev)
    })
    $("#class-schedule").delegate("td", "drop", function(ev){
        ev.preventDefault();
        $(this).toggleClass("table-warning", false);
        if(!(preferences.get("locked"))){
            if(dragged.is("li")){
                $(this).replaceWith(draggedHandler(dragged));
            }else{
                $(this).replaceWith(dragged.clone());
            }    
        }
        if(preferences.get("autosave")){
            save();
        }
    })
}

function timeTableLoad(){
    if(localStorage.class_timetable){
        loadData();
    }else{
        dias.forEach(dia => {
            $("#class-schedule thead tr").append(`<th scope="col">${dia}</th>`).addClass("text-center table-success");
        });
        for (let key in horarios) {
            $("#class-schedule tbody")
            .append(
                `<tr>
                    <th class="table-success text-truncate" scope="row">
                        <time>${horarios[key][0]}</time> - 
                        <time>${horarios[key][1]}</time>
                    </th>
                </tr>`
            ).addClass("text-center");
                        }
        dias.forEach(dia => {
            $("#class-schedule tbody tr").append(emptyTd.clone());
        });
    }
}

function draggedHandler(draggedEl){
    return($(`<td draggable="true">${draggedEl.text().trim()}</td>`).addClass((draggedEl.attr("id").replace(/\d+/g, ''))));
}

function save(){
    localStorage.setItem("class_timetable", $("#class-schedule").html().trim());
}
function loadData(){
    let timeTable = $(localStorage.getItem("class_timetable"));
    $("#class-schedule").html(timeTable)
}

function purgeData(){
    localStorage.removeItem("class_timetable");
    window.location.reload();
}

function removeSubjectHandler(){
    $("#class-schedule").on("dblclick","td[draggable=true]",function(ev){
        if(!(preferences.get("locked"))){
            $(this).replaceWith(emptyTd.clone());
            if(preferences.get("autosave")){
                save();
            }
        }
    });
}