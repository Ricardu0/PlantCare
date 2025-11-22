const categoriaModel = require('../models/categoriaModel');


async function listCategorias(req, res) {
const categorias = await categoriaModel.getAllCategorias();
res.json(categorias);
}


async function getCategoria(req, res) {
const categoria = await categoriaModel.getCategoriaById(req.params.id);
if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
res.json(categoria);
}


async function createCategoria(req, res) {
const { nome } = req.body;
if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });
const inserted = await categoriaModel.createCategoria({ nome });
res.status(201).json({ id_categoria: inserted.id_categoria });
}


async function updateCategoria(req, res) {
const { nome } = req.body;
await categoriaModel.updateCategoria(req.params.id, { nome });
res.json({ ok: true });
}


async function deleteCategoria(req, res) {
await categoriaModel.deleteCategoria(req.params.id);
res.json({ ok: true });
}


module.exports = {
listCategorias,
getCategoria,
createCategoria,
updateCategoria,
deleteCategoria,
};