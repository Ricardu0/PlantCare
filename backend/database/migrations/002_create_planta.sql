CREATE TABLE IF NOT EXISTS planta (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
especie TEXT,
frequencia_rega INTEGER,
data_ultima_rega TEXT,
observacoes TEXT,
id_categoria INTEGER,
FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);