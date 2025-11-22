const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');


let db;


async function openDb() {
if (!db) {
db = await open({ filename: DB_PATH, driver: sqlite3.Database });
}
return db;
}


async function initDb() {
// garante folder
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });


const database = await openDb();


// aplicar migrations (executa arquivos SQL presentes em migrations)
const migrationsDir = path.join(__dirname, 'migrations');
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
for (const file of files) {
const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
await database.exec(sql);
}


console.log('Banco inicializado e migrations aplicadas.');
}


module.exports = {
openDb,
initDb,
};