const database = require('./database');

const schema = {
	1: `CREATE TABLE IF NOT EXISTS cobrancas (
			//content
	);`,
	2: `CREATE TABLE IF NOT EXISTS clientes (
			//content
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
