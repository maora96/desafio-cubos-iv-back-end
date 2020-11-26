// add client
// update client
// get client - um client baseado em id
// get clients - varios clients baseado em keyword searchs
// get all clients - todos clients

const database = require('../utils/database');

const addClient = async (client) => {
	const q = {
		text:
			'INSERT INTO clients (id, nome, cpf, email, tel) VALUES (DEFAULT, $1, $2, $3, $4)',
		values: [client.nome, client.cpf, client.email, client.tel],
	};
	const query = await database.query(q);
	return query.rows;
};

const updateClient = async (id, nome, cpf, email, tel) => {
	const q = {
		text:
			'UPDATE clients set nome = $1, cpf = $2, email  = $3, tel = $4 where id = $5 returning *',
		values: [nome, cpf, email, tel, id],
	};
	const query = await database.query(q);
	return query.rows.shift();
};

const getClient = async (id) => {
	const q = {
		text: 'SELECT * FROM clients where id = $1',
		values: [id],
	};

	const query = await database.query(q);
	return query.rows;
};

const getAllClients = async (clientesPorPagina, offset) => {
	const q = {
		text: 'SELECT * FROM clients limit $1 offset $2',
		values: [clientesPorPagina, offset],
	};
	const query = await database.query(q);
	return query.rows;
};

module.exports = { addClient, updateClient, getAllClients, getClient };
