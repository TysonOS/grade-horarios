async function getDB(path){
    let dbIndex = await fetch(path).then(res => res.json());
    let cursos = await dbIndex.cursos
    let promises = []
    console.log(dbIndex)
    for(let curso of cursos){
        curso.disciplinas = await populateDisciplinas(curso);
    }
    return dbIndex
}

async function populateDisciplinas(curso){
    curso.disciplinas = new Array();
    for(let lista of curso.dPath){
        let disciplinas = await fetch("db/"+lista).then(res => res.json());
        curso.disciplinas.push(disciplinas);
    } 
    return curso.disciplinas
}

export default await (getDB("db/index.json"));