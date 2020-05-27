const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();

app.use(cors({
    exposedHeaders: 'X-Total-Count'
}));
app.use(express.json());

app.use(routes);


app.listen(80);

