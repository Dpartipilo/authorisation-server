//Main starting point off the application
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true, useUnifiedTopology: true });

//App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

//Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);

console.log('server listening on:', port );