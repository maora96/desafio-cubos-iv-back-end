const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new Koa();
const router = require('./src/routes');

server.use(bodyparser());

server.use(router.routes());

server.listen(8081, () => console.log('no ar'));

// como fazer para pagar o boleto pelo endpoint, se o cliente é que recebe o link do boleto para pagar?
// por que o nome LIKE $1 não funciona no repositories clients.js?
// por onde começar com o relatório?
