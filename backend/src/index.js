var fs = require('fs');
var https = require('https');
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();

app.use(cors({
    exposedHeaders: 'X-Total-Count'
}));
app.use(express.json());
app.use(routes);

var options = {
    cert: fs.readFileSync(__dirname + '/certificado/eace8c61d26fe0ee.crt'),
    key: fs.readFileSync( __dirname + '/certificado/server.key'),
    ca: [
        fs.readFileSync(__dirname + '/certificado/gd_bundle01.crt'),
        fs.readFileSync(__dirname+ '/certificado/gd_bundle02.crt'),
        fs.readFileSync(__dirname + '/certificado/gd_bundle03.crt'),
    ]
};

https.createServer(options, app).listen(443);
