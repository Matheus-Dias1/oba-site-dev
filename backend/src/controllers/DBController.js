const connection = require('../database/connection');
require('dotenv').config();


module.exports = {
    async rawQuery(request, response) {
        const SQLquery = request.query.SQLquery;
        const dbPassword = request.query.key;

        if (dbPassword !== process.env.DB_PASSWORD)
            return response.sendStatus(403);
        
        const admin = request.data.admin;
        if (!admin)
            return response.sendStatus(403);

        const res = await connection.raw(SQLquery);
        response.json(res);
    },
}