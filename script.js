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
    $("#class-schedule tbody tr").append(`<td draggable="true">Vazio</td>`).addClass("text-center hover");
});

$.getJSON("materias.json", (subjects) => {
    $.each(subjects, (sem, subjs) => {
        tmpSemID = `s${sem}`;
        divSubjectList.append(`
            <buttton data-bs-target="#${tmpSemID}" class="btn" type="button" data-bs-toggle="collapse">
                <h5>Semestre ${sem}</h5>
            </button>`);

        divSubjectList.append(`<div class="collapse" id="${tmpSemID}"></div>`);
        let tmpSem = $(`#${tmpSemID}`);
        $.each(subjs, (cod, subject) => {
            tmpSem.append(`
                <li draggable="true" class="list-group-item list-group-item-action"> 
                ${subject.title}
                </li>`
            );
        })
    })
})