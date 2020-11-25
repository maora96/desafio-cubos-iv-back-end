const axios = require('axios').default;
const Clients = require('../repositories/clients');

require('dotenv').config();

const pay = (bill) => {
	const {
		idDoCliente,
		descricao,
		valor,
		vencimento,
	} = data;

	const client = Clients.getClient(idDoCliente);

	// checar se cliente existe?


	try {
		const transaction = await axios
		.post('https://api.pagar.me/1/transactions', {
			amount: valor,
			boleto_expiration_date: vencimento,
			descricao,
			payment_method: 'boleto',
			customer: {

				name: client.nome,
				documents: [
					{
						type:`cpf`,
						number: client.cpf, 
					},
				],
				phone_numbers: [client.tel]
			},
			capture: true,
			api_key: process.env.PAGARME_KEY,
		});
		return transaction.data;
		// SEND EMAIL
		
	} catch(err) {
		console.log(err.response.data);
		//return response erro 
	}
	
};
