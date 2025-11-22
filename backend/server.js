const app = require('./app');
const { initDb } = require('./database/db');


const PORT = process.env.PORT || 3000;


(async () => {
// inicializa o DB (cria arquivo + tabelas caso necessário)
await initDb();


app.listen(PORT, () => {
console.log(`Servidor rodando em http://localhost:${PORT}`);
});
})();