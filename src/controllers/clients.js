const Clients = require('../repositories/clients');

const addClient = async (ctx) => {
	const {
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	if (!nome || !cpf || !email || !tel) {
		// response pedido mal-formatado
	}

	const client = {
		nome,
		cpf,
		email,
		tel,
	};

	const result = await Clients.addClient(client);
	// return response success
};

const updateClient = async (ctx) => {
	const {
		id = null,
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	if (id) {
		const client = await Clients.getClient(id);
		if (client) {
			const update = await Clients.updateClient(
				id,
				nome,
				cpf,
				email,
				tel
			);
			// return response success update como parametro
			ctx.body = update;
		} else {
			// return response cliente n existe
		}
	} else {
		// return response mal formatado
	}
};

const getAllClients = async (ctx) => {
	const { clientesPorPagina = 10, offset = 0 } = ctx.query;

	const clients = await Clients.getAllClients(clientesPorPagina, offset);

	if (!clients) {
		// erro nao existem clientes
	}

	const clientData = clients.map((client) => {
		// coisar cobranças aqui
		return {
			nome: client.nome,
			cpf: client.cpf,
			email: client.email,
			tel: client.tel,
			billsSent: 0,
			billsPaid: 0,
			inRed: false,
		};
	});

	ctx.body = clients;
};

const searchClients = async (ctx) => {
	const { busca, clientesPorPagina = 10, offset = 0 } = ctx.query;

	const clients = await Clients.getClients(busca, clientesPorPagina, offset);

	if (!clients) {
		// erro nao existem clientes
	}

	const clientData = clients.map((client) => {
		// coisar cobranças aqui
		return {
			nome: client.nome,
			cpf: client.cpf,
			email: client.email,
			tel: client.tel,
			billsSent: 0,
			billsPaid: 0,
			inRed: false,
		};
	});

	// response sucesso clientdata
};

module.exports = { addClient, updateClient, getAllClients, searchClients };
