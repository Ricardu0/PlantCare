const plantaModel = require('../models/plantaModel');


async function listPlantas(req, res) {
const plantas = await plantaModel.getAllPlantas();
res.json(plantas);
}


async function getPlanta(req, res) {
const planta = await plantaModel.getPlantaById(req.params.id);
if (!planta) return res.status(404).json({ error: 'Planta não encontrada' });
res.json(planta);
}


async function createPlanta(req, res) {
const data = req.body;
if (!data.nome) return res.status(400).json({ error: 'nome é obrigatório' });
const inserted = await plantaModel.createPlanta(data);
res.status(201).json(inserted);
}


async function updatePlanta(req, res) {
const data = req.body;
await plantaModel.updatePlanta(req.params.id, data);
res.json({ ok: true });
}


async function deletePlanta(req, res) {
await plantaModel.deletePlanta(req.params.id);
res.json({ ok: true });
}


module.exports = {
listPlantas,
getPlanta,
createPlanta,
updatePlanta,
deletePlanta,
};