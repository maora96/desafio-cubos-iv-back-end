const Clients = require('../repositories/clients');
const Bills = require('../repositories/bills');
const pagarme = require('../utils/pagarme');

const addBill = async (ctx) => {
	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null,
	} = ctx.request.body;

	if (!idDoCliente || !descricao || !valor || !vencimento) {
		// response mal formatado
	}

	const client = await Clients.getClient(idDoCliente);

	if (!client) {
		// erro nao ha cliente
	}

	// erro valor + data
	// criar boleto pagarme = linkDoBoleto

	const pay = await pagarme.pay(bill);
	const linkDoBoleto = pay.boleto_url;

	const billData = {
		idClient: idDoCliente,
		descricao,
		valor: Number(valor),
		vencimento,
		linkDoBoleto,
	};

	const bill = await Bills.addBill(billData);
	/// response success boleto
};

const getBills = async (ctx) => {
	const { cobrancasPorPagina = 10, offset = 0 } = ctx.query;

	const bills = await Bills.getAllBills(cobrancasPorPagina, offset);

	if (!bills) {
		// erro nao existem bills
	}

	const billsData = bills.map((bill) => {
		// ???? bills vao retornar desse jeito?? se sim, deletar map
		return {
			id: bill.id,
			idDoCliente: bill.idDoCliente,
			descricao: bill.descricao,
			valor: bill.valor,
			vencimento: bill.vencimento,
			linkDoBoleto: bill.linkDoBoleto,
			status: bill.status,
		};
	});

	// response sucesso clientdata
};

const payBill = async (ctx) => {
	/// rezar pro pagarme gods

	const { idDaCobranca } = ctx.request.body;

	const bill = await Bills.getBill(idDaCobranca);

	if (!bill) {
		/// erro bill n existe
	}

	// const pay = await pagarme.pay(bill);

	// return response sucesso
};

const getReport = async (ctx) => {
	// pegar todos os clientes, ver suas cobranças, ver se foram pagas ou não.
	// somar saldo de cobranças pagas
	// somar quantidade de cobranças pagas, previstas e nao pagas
	// somar quantidade de clientes inadimplentes e adimplentes
	// somar quantidade de cobrancas vencidas
	/// como pegar todos clientes? - pegar no banco de dados
	/// pegar todas as cobranças e fazer um join?
	// ?? profit
};

module.exports = { addBill, getBills, payBill, getReport };
