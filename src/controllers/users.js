const Users = require('../repositories/users');

const addUser = async (ctx) => {
	const { email = null, nome = null } = ctx.request.body;
	const { hash } = ctx.state;

	if (!email || !nome || !hash) {
		// erro
	}

	const userExists = await Users.getUserByEmail(email);

	if (userExists) {
		// cadastrado
	}

	const user = {
		nome,
		email,
		senha: hash,
	};

	const result = await users.addUser(user);
	// return response
};

module.exports = { addUser };
