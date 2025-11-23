const { openDb } = require('../database/db');


async function getAllCategorias() {
const db = await openDb();
return db.all('SELECT * FROM categoria');
}


async function getCategoriaById(id) {
const db = await openDb();
return db.get('SELECT * FROM categoria WHERE id_categoria = ?', id);
}


async function createCategoria(data) {
const db = await openDb();
const result = await db.run('INSERT INTO categoria (nome) VALUES (?)', data.nome);
return { id_categoria: result.lastID };
}


async function updateCategoria(id, data) {
const db = await openDb();
// preserve existing values for partial updates to avoid NOT NULL violations
const existing = await db.get('SELECT * FROM categoria WHERE id_categoria = ?', id);
if (!existing) throw new Error('Categoria não encontrada');
const nome = data.nome ?? existing.nome;
await db.run('UPDATE categoria SET nome = ? WHERE id_categoria = ?', nome, id);
}


async function deleteCategoria(id) {
const db = await openDb();
const result = await db.run('DELETE FROM categoria WHERE id_categoria = ?', id);
if (result && result.changes === 0) throw new Error('Categoria não encontrada');
}


module.exports = {
getAllCategorias,
getCategoriaById,
createCategoria,
updateCategoria,
deleteCategoria,
};