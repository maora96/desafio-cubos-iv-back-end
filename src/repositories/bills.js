const database = require('../utils/database');

const addBill = async (bill) => {
	console.log(bill);
	const q = {
		text:
			'INSERT INTO bills (id, id_do_cliente, descricao, valor, vencimento, link_do_boleto, status, pagarmeId) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)',
		values: [
			bill.idDoCliente,
			bill.descricao,
			bill.valor,
			bill.vencimento,
			bill.linkDoBoleto,
			bill.status,
			bill.pagarmeId,
		],
	};
	const query = await database.query(q);
	return query.rows;
};

const getBill = async (id) => {
	const q = {
		text: 'SELECT * FROM bills where id = $1',
		values: [id],
	};

	const query = await database.query(q);
	return query.rows;
};

const getAllBills = async (cobrancasPorPagina, offset) => {
	const q = {
		text: 'SELECT * FROM bills limit $1 offset $2',
		values: [cobrancasPorPagina, offset],
	};
	const query = await database.query(q);
	return query.rows;
};

const getBills = async (userId) => {
	const q = {
		text:
			'SELECT * FROM bills INNER JOIN clients c on id_do_cliente = c.id WHERE c.userId = $1 ',
		values: [userId],
	};
	const query = await database.query(q);
	return query.rows;
};

module.exports = {
	addBill,
	getBill,
	getAllBills,
	getBills,
};
