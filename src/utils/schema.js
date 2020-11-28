const database = require('./database');

const schema = {
	1: `CREATE TABLE IF NOT EXISTS users (
			id SERIAL, 
			email TEXT NOT NULL,
			senha TEXT NOT NULL,
			nome TEXT  NOT NULL
    )`,
	2: `CREATE TABLE IF NOT EXISTS clients (
			id SERIAL, 
			userID INT NOT NULL, 
			nome TEXT NOT NULL,
			cpf TEXT NOT NULL,
			email TEXT  NOT NULL,
			tel TEXT  NOT NULL
	);`,
	3: `CREATE TABLE IF NOT EXISTS bills (
			id SERIAL,
			id_do_cliente INT NOT NULL, 
			descricao TEXT NOT NULL,
			valor INT NOT NULL, 
			vencimento DATE NOT NULL, 
			link_do_boleto TEXT NOT NULL, 
			status TEXT NOT NULL,
			pagarmeId INT NOT NULL
	);`,
};

const up = async (number = null) => {
	if (!number) {
		for (const value in schema) {
			await database.query({ text: schema[value] });
		}
	} else {
		await database.query({ text: schema[number] });
	}
	console.log('Sucesso na migração!');
};

up();
