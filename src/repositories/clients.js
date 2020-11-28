const database = require('../utils/database');

const addClient = async (client, userId) => {
	const q = {
		text:
			'INSERT INTO clients (id, userID, nome, cpf, email, tel) VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING *',
		values: [userId, client.nome, client.cpf, client.email, client.tel],
	};
	const query = await database.query(q);
	return query.rows;
};

const updateClient = async (id, nome, cpf, email, tel, userId) => {
	const q = {
		text:
			'UPDATE clients WHERE userId = $1 set nome = $2, cpf = $3, email  = $4, tel = $5 where id = $6 returning *',
		values: [userId, nome, cpf, email, tel, id],
	};
	const query = await database.query(q);
	return query.rows.shift();
};

const getClient = async (id, userId) => {
	const q = {
		text: 'SELECT * FROM clients where id = $1 AND userId = $2',
		values: [id, userId],
		//text: `SELECT * FROM clients where ${field} = ${value}`,
	};

	const query = await database.query(q);
	return query.rows;
};

const getAllClients = async (clientesPorPagina, offset, userId) => {
	const q = {
		text: 'SELECT * FROM clients where userId = $1 limit $2 offset $3',
		values: [userId, clientesPorPagina, offset],
	};
	const query = await database.query(q);
	return query.rows;
};

const searchClients = async (clientesPorPagina, offset, busca, userId) => {
	const q = {
		text: `SELECT * FROM clients WHERE nome LIKE '%${busca}%' and userId = ${userId} limit ${clientesPorPagina} offset ${offset}`,
	};
	const query = await database.query(q);
	return query.rows;
};

const getClientsAndBills = async (userId) => {
	const q = {
		text:
			'SELECT * FROM clients c WHERE userId = $1 INNER JOIN bills ON c.id = id_do_cliente',
		values: [userId],
	};

	const query = await database.query(q);
	return query.rows;
};

module.exports = {
	addClient,
	updateClient,
	getAllClients,
	getClient,
	searchClients,
	getClientsAndBills,
};
