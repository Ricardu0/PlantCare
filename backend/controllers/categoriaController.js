const categoriaModel = require('../models/categoriaModel');


async function listCategorias(req, res) {
	try {
		const categorias = await categoriaModel.getAllCategorias();
		res.json(categorias);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro ao listar categorias' });
	}
}


async function getCategoria(req, res) {
	try {
		const categoria = await categoriaModel.getCategoriaById(req.params.id);
		if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
		res.json(categoria);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro ao buscar categoria' });
	}
}


async function createCategoria(req, res) {
	try {
		const { nome } = req.body;
		if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });
		const inserted = await categoriaModel.createCategoria({ nome });
		res.status(201).json({ id_categoria: inserted.id_categoria });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro ao criar categoria' });
	}
}


async function updateCategoria(req, res) {
	try {
		const { nome } = req.body;
		await categoriaModel.updateCategoria(req.params.id, { nome });
		res.json({ ok: true });
	} catch (err) {
		console.error(err);
		if (err.message && err.message.includes('não encontrada')) {
			return res.status(404).json({ error: 'Categoria não encontrada' });
		}
		res.status(500).json({ error: 'Erro ao atualizar categoria' });
	}
}


async function deleteCategoria(req, res) {
	try {
		await categoriaModel.deleteCategoria(req.params.id);
		res.json({ ok: true });
	} catch (err) {
		console.error(err);
		if (err.message && err.message.includes('não encontrada')) {
			return res.status(404).json({ error: 'Categoria não encontrada' });
		}
		res.status(500).json({ error: 'Erro ao excluir categoria' });
	}
}


module.exports = {
	listCategorias,
	getCategoria,
	createCategoria,
	updateCategoria,
	deleteCategoria,
};