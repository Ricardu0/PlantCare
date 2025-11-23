const plantaModel = require('../models/plantaModel');


async function listPlantas(req, res) {
	try {
		const plantas = await plantaModel.getAllPlantas();
		res.json(plantas);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro ao listar plantas' });
	}
}


async function getPlanta(req, res) {
	try {
		const planta = await plantaModel.getPlantaById(req.params.id);
		if (!planta) return res.status(404).json({ error: 'Planta não encontrada' });
		res.json(planta);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro ao buscar planta' });
	}
}


async function createPlanta(req, res) {
	try {
		const data = req.body;
		if (!data.nome) return res.status(400).json({ error: 'nome é obrigatório' });
		const inserted = await plantaModel.createPlanta(data);
		res.status(201).json(inserted);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro ao criar planta' });
	}
}


async function updatePlanta(req, res) {
	try {
		const data = req.body;
		await plantaModel.updatePlanta(req.params.id, data);
		res.json({ ok: true });
	} catch (err) {
		console.error(err);
		if (err.message && err.message.includes('não encontrada')) {
			return res.status(404).json({ error: 'Planta não encontrada' });
		}
		res.status(500).json({ error: 'Erro ao atualizar planta' });
	}
}


async function deletePlanta(req, res) {
	try {
		await plantaModel.deletePlanta(req.params.id);
		res.json({ ok: true });
	} catch (err) {
		console.error(err);
		if (err.message && err.message.includes('não encontrada')) {
			return res.status(404).json({ error: 'Planta não encontrada' });
		}
		res.status(500).json({ error: 'Erro ao excluir planta' });
	}
}


module.exports = {
	listPlantas,
	getPlanta,
	createPlanta,
	updatePlanta,
	deletePlanta,
};