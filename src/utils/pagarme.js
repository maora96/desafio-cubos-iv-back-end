const axios = require('axios').default;
const Clients = require('../repositories/clients');
const response = require('../controllers/response');

require('dotenv').config();

const pay = async (bill, userId) => {
	const { idDoCliente, descricao, valor, vencimento } = bill;

	const client = await Clients.getClient(idDoCliente, userId);

	try {
		const transaction = await axios.post(
			'https://api.pagar.me/1/transactions',
			{
				amount: valor,
				boleto_expiration_date: vencimento,
				descricao,
				payment_method: 'boleto',
				customer: {
					name: client[0].nome,
					type: 'individual',
					documents: [
						{
							type: 'cpf',
							number: '04667799501',
						},
					],
					phone_numbers: [client[0].tel],
				},
				capture: true,
				api_key: process.env.PAGARME_KEY,
			}
		);
		return transaction.data;
	} catch (err) {
		console.log(err);
	}
};

module.exports = { pay };
