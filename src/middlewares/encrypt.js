const Password = require('../utils/password');

const encrypt = async (ctx, next) => {
	const { senha = null } = ctx.request.body;

	if (!senha) {
		//erro
	}

	const hash = await Password.encrypt(senha);
	ctx.state.hash = hash;
	return next();
};

module.exports = { encrypt };
