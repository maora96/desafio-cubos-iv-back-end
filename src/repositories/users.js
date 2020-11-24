const database = require('../utils/database');

const addUser = async (user) => {
	const query = {
		text: `INSERT INTO users 
        (id, email, senha, nome)
        VALUES ($1, $2, $3, $4) RETURNING *`,
		values: [user.id, user.email, user.senha, user.nome],
	};

	return database.query(query);
};

const getUserByEmail = async (email = null) => {
	// checar se email é nulo

	const query = {
		text: `SELECT * FROM users where email = $1`,
		values: [email],
	};

	const result = await database.query(query);
	return result.rows[0];
};

module.exports = { addUser, getUserByEmail };
