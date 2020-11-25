const jwt = require('jsonwebtoken');
const Users = require('../repositories/users')
const Password = require('../utils/password')

const authenticate = (ctx) => {
    const { email = null, senha = null } = ctx.request.body; 

    if (!email || !senha) {
        ctx.body = "erro!";
    }

    const user = await Users.getUserByEmail(email);

    if (user) {
        const comparison = await Password.check(senha, autor.senha);
        if (comparison) {
            // sucesso 
            const token = await jwt.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET || 'riplaptop',
            {
                expiresIn: '1h'
            }
            );
            ctx.body = token; // return response 
        }
    }
}

module.exports = { authenticate }