let locked = false;
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

let divSubjectList = $("#subject-list");

dias.forEach(dia => {
    $("#class-schedule thead tr").append(`<th scope="col">${dia}</th>`).addClass("text-center table-success");
});

for (key in horarios) {
    $("#class-schedule tbody")
        .append(`<tr>
                    <th class="table-success" scope="row">
                        <time>${horarios[key][0]}</time> - 
                        <time>${horarios[key][1]}</time>
                    </th>
                </tr>`);
}
dias.forEach(dia => {
    $("#class-schedule tbody tr").append(`<td> - </td>`).addClass("text-center");
});

$.getJSON("materias.json", (subjects) => {
    $.each(subjects, (sem, subjs) => {
        tmpSemID = `s${sem}`;
        $(` <buttton data-bs-target="#${tmpSemID}" class="btn" type="button" data-bs-toggle="collapse">
                <h5>${!isNaN(sem)?"Semestre":""} ${sem}</h5>
             </button>`).appendTo(divSubjectList)

        $(`<div class="collapse" id="${tmpSemID}"></div>`).appendTo(divSubjectList);
        let tmpSem = $(`#${tmpSemID}`);
        $.each(subjs, (cod, subject) => {
            $(`
                <li id=${cod} draggable="true" class="list-group-item list-group-item-action"> 
                ${subject.title}
                </li>`
            ).appendTo(tmpSem);
        })
    })
})

let dragged=null;

$("#class-schedule").delegate("td", "drop", function(ev){
    ev.preventDefault();
    console.log("dropzone:", $(this))
    if(!locked){
        if(dragged.is("li")){
            $(this).replaceWith(draggedHandler(dragged));
        }else{
            $(this).replaceWith(dragged.clone());
        }    
    }
    $(this).toggleClass("table-warning", false)
})

$("#class-schedule").delegate("td", "dragover", function(ev){
    ev.preventDefault();
    console.log($(this));
}).delegate("td","dragenter", function(){
    $(this).toggleClass("table-warning", true)
}).delegate("td","dragleave", function(){
    $(this).toggleClass("table-warning", false)
})
    
$("#subject-list, #class-schedule").delegate("[draggable='true']","dragstart", function(){
        dragged = $(this);
})

function draggedHandler(draggedEl){
    return($(`<td draggable="true">${draggedEl.text().trim()}</td>`).addClass((draggedEl.attr("id").replace(/\d+/g, ''))));
}