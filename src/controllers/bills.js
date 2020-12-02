/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
const Clients = require('../repositories/clients');
const Bills = require('../repositories/bills');
const pagarme = require('../utils/pagarme');
const axios = require('axios').default;
const response = require('../controllers/response');

const { sendEmail } = require('../utils/email');

const addBill = async (ctx) => {
	const userId = ctx.state.userId;

	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null,
	} = ctx.request.body;

	if (!idDoCliente || !descricao || !valor || !vencimento) {
		response(ctx, 404, {
			mensagem: 'Pedido mal-formatado!',
		});
	}

	const client = await Clients.getClient(idDoCliente, userId);

	if (!client) {
		response(ctx, 404, {
			mensagem: 'Cliente não encontrado.',
		});
	}

	const bill = {
		idDoCliente: idDoCliente,
		descricao,
		valor: Number(valor),
		vencimento,
	};

	const pay = await pagarme.pay(bill, userId);
	console.log({ pay });
	const linkDoBoleto = pay.boleto_url;
	const pagarmeStatus = pay.status;
	const pagarmeId = pay.id;

	const billData = {
		idDoCliente,
		descricao,
		valor: Number(valor),
		vencimento,
		linkDoBoleto,
		status: pagarmeStatus,
		pagarmeId,
	};

	const actualBill = await Bills.addBill(billData);

	await sendEmail(
		client[0].email,
		'Seu boleto chegou!',
		`Pague seu boleto clicando <a href="${linkDoBoleto}">aqui</a>.`
	);

	let status =
		pagarmeStatus === 'paid'
			? 'PAGO'
			: pagarmeStatus === 'waiting_payment'
			? 'AGUARDANDO'
			: 'VENCIDO';

	response(ctx, 201, {
		cobranca: {
			idDoCliente,
			descricao,
			valor: Number(valor),
			vencimento,
			linkDoBoleto,
			status,
		},
	});
};

const getBills = async (ctx) => {
	const { cobrancasPorPagina = null, offset = null } = ctx.query;

	let bills;

	if (cobrancasPorPagina === null && offset === null) {
		bills = await Bills.getAllBillsForReal();
	} else {
		bills = await Bills.getAllBills(cobrancasPorPagina, offset);
	}

	if (!bills) {
		response(ctx, 404, {
			mensagem: 'Nenhuma cobrança encontrada.',
		});
	}

	const billsData = bills.map((bill) => {
		let status =
			bill.status === 'paid'
				? 'PAGO'
				: bill.status === 'waiting_payment'
				? 'AGUARDANDO'
				: 'VENCIDO';

		return {
			id: bill.id,
			idDoCliente: bill.id_do_cliente,
			descricao: bill.descricao,
			valor: bill.valor,
			vencimento: bill.vencimento,
			linkDoBoleto: bill.link_do_boleto,
			status,
		};
	});

	const numberOfBills = bills.length;

	const calculatePageCount = (pageSize, totalClients) => {
		return totalClients < pageSize ? 1 : Math.ceil(totalClients / pageSize);
	};

	const totalPages = calculatePageCount(10, numberOfBills);
	const currentPage = totalPages - Math.ceil(offset / cobrancasPorPagina);

	let dados = {
		paginaAtual: currentPage,
		totalDePaginas: totalPages,
		cobrancas: billsData,
	};

	response(ctx, 200, dados);
};

const payBill = async (ctx) => {
	const { idDaCobranca } = ctx.request.body;

	const bill = await Bills.getBill(idDaCobranca);

	if (!bill) {
		response(ctx, 404, {
			mensagem: 'Nenhuma cobrança encontrada.',
		});
	}

	const pagar = await axios.put(
		`https://api.pagar.me/1/transactions/${bill[0].pagarmeid}`,
		{
			api_key: `${process.env.PAGARME_KEY}`,
			status: 'paid',
		}
	);

	response(ctx, 200, {
		mensagem: 'Cobrança paga com sucesso',
	});
};

const getReport = async (ctx) => {
	const userId = ctx.state.userId;
	const clientsAndBills = await Clients.getClientsAndBills(userId);

	let saldo = 0;
	let cobrancasPagas = 0;
	let cobrancasVencidas = 0;
	let cobrancasPrevistas = 0;

	const today = new Date().getTime();

	let inRed = [];
	let inBlue = [];

	console.log({ clientsAndBills });
	for (const bill of clientsAndBills) {
		if (bill.status === 'paid') {
			saldo += bill.valor;
			cobrancasPagas++;
		} else if (bill.status === 'waiting_payment') {
			cobrancasPrevistas++;
		} else {
			cobrancasVencidas++;
		}

		const vencimento = new Date(bill.vencimento).getTime();
		if (vencimento - today < 0) {
			// inadimplemente
			if (!inRed.find((nome) => nome === bill.nome)) {
				inRed.push(bill.nome);
			}
		} else {
			if (!inBlue.find((nome) => nome === bill.nome)) {
				inBlue.push(bill.nome);
			}
		}
	}

	const data = {
		relatorio: {
			qtdClientesAdimplentes: inBlue.length,
			qtdClientesInadimplentes: inRed.length,
			qtdCobrancasPrevistas: cobrancasPrevistas,
			qtdCobrancasPagas: cobrancasPagas,
			qtdCobrancasVencidas: cobrancasVencidas,
			saldoEmConta: saldo,
		},
	};

	response(ctx, 200, data);
};

module.exports = { addBill, getBills, payBill, getReport };
