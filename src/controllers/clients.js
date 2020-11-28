const Clients = require('../repositories/clients');
const Bills = require('../repositories/bills');
const response = require('../controllers/response');

const addClient = async (ctx) => {
	const {
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	if (!nome || !cpf || !email || !tel) {
		response(ctx, 404, {
			mensagem: 'Pedido mal-formatado!',
		});
	}

	const client = {
		nome,
		cpf,
		email,
		tel,
	};

	const userId = ctx.state.userId;
	const result = await Clients.addClient(client, userId);
	response(ctx, 201, {
		id: result[0].id,
	});
};

const updateClient = async (ctx) => {
	const {
		id = null,
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	const userId = ctx.state.userId;

	if (id) {
		const client = await Clients.getClient(id);
		if (client) {
			const update = await Clients.updateClient(
				id,
				nome,
				cpf,
				email,
				tel,
				userId
			);
			response(ctx, 200, update);
		} else {
			response(ctx, 404, {
				mensagem: 'Cliente não cadastrado.',
			});
		}
	} else {
		response(ctx, 404, {
			mensagem: 'Pedido mal-formatado!',
		});
	}
};

const getAllClients = async (ctx) => {
	const { clientesPorPagina = 10, offset = 0, busca = null } = ctx.query;
	let clients;
	const userId = ctx.state.userId;
	if (busca === null) {
		clients = await Clients.getAllClients(
			clientesPorPagina,
			offset,
			userId
		);
	} else {
		clients = await Clients.searchClients(
			clientesPorPagina,
			offset,
			busca,
			userId
		);
	}

	if (!clients) {
		response(ctx, 404, {
			mensagem: 'Não existem clientes cadastrados.',
		});
	}

	const bills = await Bills.getBills();

	const clientData = clients.map((client) => {
		const today = new Date().getTime();
		let done = 0;
		let received = 0;
		let inRed = false;
		for (bill of bills) {
			const vencimento = new Date(bill.vencimento).getTime();
			if (bill.id_do_cliente === client.id) {
				done += bill.valor;
				if (bill.status === 'paid') {
					received += bill.valor;
				}
				if (vencimento - today < 0) {
					inRed = true;
				}
			}
		}
		return {
			nome: client.nome,
			cpf: client.cpf,
			email: client.email,
			tel: client.tel,
			cobrancasFeitas: done,
			cobrancasRecebidas: received,
			estaInadimplente: inRed,
		};
	});

	const numberOfClientes = clients.length;

	const totalPages = Math.ceil(numberOfClientes / clientesPorPagina);
	const currentPage = totalPages - Math.ceil(offset / clientesPorPagina);

	const dados = {
		paginaAtual: currentPage,
		totalDePaginas: totalPages,
		clientes: clientData,
	};
	response(ctx, 200, dados);
};

module.exports = { addClient, updateClient, getAllClients };
