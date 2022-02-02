const express = require('express'); // importing a CommonJS module
const cors = require('cors'); // middleware installed from NPM
const morgan = require('morgan'); // another middleware
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json()); // this NEEDS to come before any endpoint that might want to read req.body

// middleware is just a function that takes in req, res, next
// middleware MUST eaither (A) call next() or (B) respond to the client
// NEVER shoot 2 repsonses!
function logger(req, res, next) { // this is a custom middleware
  console.log('this is happening!');
  console.log(`it is a ${req.method} request`);
  next();
}

server.use(cors()); // using the middleware
server.use(morgan('dev')); // using another middleware
server.use(logger);
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Hubs API</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
