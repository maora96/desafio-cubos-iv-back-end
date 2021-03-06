const database = require('../utils/database');

const addUser = async (user) => {
	const query = {
		text: `INSERT INTO users 
        (id, email, senha, nome)
        VALUES (DEFAULT, $1, $2, $3) RETURNING *`,
		values: [user.email, user.senha, user.nome],
	};

	return database.query(query);
};

const getUserByEmail = async (email) => {
	const query = {
		text: `SELECT * FROM users WHERE email = $1`,
		values: [email],
	};

	const result = await database.query(query);
	return result.rows[0];
};

module.exports = { addUser, getUserByEmail };
