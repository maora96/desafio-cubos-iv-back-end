const Router = require('koa-router');
const router = new Router();

const Auth = require('./controllers/auth');
const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/session');

// get
router.get();

// post
router.post();

router.post('/auth', Auth.autenticar)
router.post('/usuarios',) // adicionar função para controller que criar usuário
router.post('/clintes, Session.verify, ') // adicionar função para controller que cria cliente. só usuários cadastrados podem criar clientes, então usar session
router.post('/cobrancas', Session.verify, ) // adicionar função para controller que cria cobrança. só usuários cadastrados podem criar cobranças, então usar session

// put
router.put();

// delete
router.delete();

module.exports = router;