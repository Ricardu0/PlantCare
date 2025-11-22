require('dotenv').config();
const express = require('express');
const cors = require('cors');


const plantaRoutes = require('./routes/plantaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');


const app = express();


app.use(cors());
app.use(express.json());


// rotas
app.use('/api/plantas', plantaRoutes);
app.use('/api/categorias', categoriaRoutes);


// rota raiz
app.get('/', (req, res) => {
res.json({ ok: true, message: 'PlantCare API - backend rodando' });
});


module.exports = app;