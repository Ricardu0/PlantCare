const { openDb } = require('../database/db');


async function getAllPlantas() {
const db = await openDb();
return db.all('SELECT p.*, c.nome as categoria_nome FROM planta p LEFT JOIN categoria c ON p.id_categoria = c.id_categoria');
}


async function getPlantaById(id) {
const db = await openDb();
return db.get('SELECT p.*, c.nome as categoria_nome FROM planta p LEFT JOIN categoria c ON p.id_categoria = c.id_categoria WHERE p.id = ?', id);
}


async function createPlanta(data) {
const db = await openDb();
const result = await db.run(
`INSERT INTO planta (nome, especie, frequencia_rega, data_ultima_rega, observacoes, id_categoria)
VALUES (?, ?, ?, ?, ?, ?)`,
data.nome,
data.especie || null,
data.frequencia_rega || null,
data.data_ultima_rega || null,
data.observacoes || null,
data.id_categoria || null
);
return { id: result.lastID };
}


async function updatePlanta(id, data) {
const db = await openDb();
await db.run(
`UPDATE planta SET nome = ?, especie = ?, frequencia_rega = ?, data_ultima_rega = ?, observacoes = ?, id_categoria = ? WHERE id = ?`,
data.nome,
data.especie || null,
data.frequencia_rega || null,
data.data_ultima_rega || null,
data.observacoes || null,
data.id_categoria || null,
id
);
}


async function deletePlanta(id) {
const db = await openDb();
await db.run('DELETE FROM planta WHERE id = ?', id);
}


module.exports = {
getAllPlantas,
getPlantaById,
createPlanta,
updatePlanta,
deletePlanta,
};