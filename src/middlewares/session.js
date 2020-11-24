const jwt = require('jsonwebtoken');

require('dotenv').config();

const verify = async (ctx, next) => {
	const [bearer, token] = ctx.headers.authorization.split(' ');
	try {
		const verification = await jwt.verify(token, process.env.JWT_SECRET);

        ctx.state.userId = verification.id;
        ctx.state.email = verification.email;
	} catch (err) {
        console.log('ação proibida');
        // return response erro 
	}
	return next();
};

module.exports = { verify };