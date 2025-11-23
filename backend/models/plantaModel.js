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
// get existing planta to preserve fields not provided in partial updates
const existing = await db.get('SELECT * FROM planta WHERE id = ?', id);
if (!existing) throw new Error('Planta não encontrada');

const nome = data.nome ?? existing.nome;
const especie = data.especie ?? existing.especie;
const frequencia_rega = data.frequencia_rega ?? existing.frequencia_rega;
const data_ultima_rega = data.data_ultima_rega ?? existing.data_ultima_rega;
const observacoes = data.observacoes ?? existing.observacoes;
const id_categoria = data.id_categoria ?? existing.id_categoria;

await db.run(
	`UPDATE planta SET nome = ?, especie = ?, frequencia_rega = ?, data_ultima_rega = ?, observacoes = ?, id_categoria = ? WHERE id = ?`,
	nome,
	especie,
	frequencia_rega,
	data_ultima_rega,
	observacoes,
	id_categoria,
	id
);
}


async function deletePlanta(id) {
const db = await openDb();
const result = await db.run('DELETE FROM planta WHERE id = ?', id);
// if no rows were deleted, inform caller
if (result && result.changes === 0) throw new Error('Planta não encontrada');
}


module.exports = {
getAllPlantas,
getPlantaById,
createPlanta,
updatePlanta,
deletePlanta,
};