const Users = require('../repositories/users');
const response = require('../controllers/response');

const addUser = async (ctx) => {
	const { email = null, nome = null } = ctx.request.body;
	const { hash } = ctx.state;

	if (!email || !nome || !hash) {
		response(ctx, 404, {
			mensagem: 'Pedido mal-formatado!',
		});
	}

	const userExists = await Users.getUserByEmail(email);

	if (userExists) {
		response(ctx, 404, {
			mensagem: 'Usuário com esse e-mail já cadastrado.',
		});
	}

	const user = {
		nome,
		email,
		senha: hash,
	};

	const result = await Users.addUser(user);
	const newUser = await Users.getUserByEmail(email);
	response(ctx, 201, { id: newUser.id });
};

module.exports = { addUser };
