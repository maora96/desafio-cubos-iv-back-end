const Router = require('koa-router');
const router = new Router();

const Auth = require('./controllers/auth');
const Users = require('./controllers/users');
const Clients = require('./controllers/clients');
const Bills = require('./controllers/bills');

const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/session');

// auth

router.post('/auth', Auth.authenticate);

// users

router.post('/usuarios', Password.encrypt, Users.addUser);

// clients

router.post('/clientes', Session.verify, Clients.addClient);
router.put('/clientes', Session.verify, Clients.editClient);
router.get(
	'/clientes?clientesPorPagina=:page&offset=:offset',
	Session.verify,
	Clients.getClients
);
router.get(
	'/clientes?busca=:texto&clientesPorPagina=:page&offset=:offset',
	Session.verify,
	Clients.searchClients
);

// bills

router.post('/cobrancas', Session.verify, Bills.addBill);
router.get(
	'/cobrancas?cobrancasPorPagina=:page&offset=:offset',
	Session.verify,
	Bills.getBills
);
router.put('/cobrancas', Session.verify, Bills.payBill);
router.get('/relatorios', Session.verify, Bills.getReport);

module.exports = router;
