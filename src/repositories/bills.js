/// addbill(bill) criar uma cobrança no banco de dados ADICIONAR ID
// getbills(cobrancasporpagina, offset)
// getbill SINGLE BILL

const database = require('../utils/database');

const addBill = async (bill) => {
	const q = {
		text:
			'INSERT INTO bills (id, idCliente, descricao, valor, vencimento, linkDoBoleto) VALUES (DEFAULT, $1, $2, $3, $4)',
		values: [
			bill.idDoCliente,
			bill.descricao,
			bill.valor,
			bill.vencimento,
			bill.linkDoBoleto,
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

module.exports = {
	addBill,
	getBill,
	getAllBills,
};
