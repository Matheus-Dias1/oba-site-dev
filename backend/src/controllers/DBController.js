const connection = require('../database/connection');
require('dotenv').config();


module.exports = {
    async dbQuery(request, response) {
        const {
            rawQuery,
            table,
            orderBy,
            order
        } = request.body;
        const dbKey = request.headers['dbkey'];
            if (dbKey !== process.env.DB_PASSWORD){
            return response.sendStatus(403);

        }
        const admin = request.data.admin;
        if (!admin)
            return response.sendStatus(403);

        try {
            if (!!rawQuery) {
                const res = await connection.raw(rawQuery);
                return response.json(res);
            } else {
                if (!!orderBy) {
                    const res = await connection(table)
                        .select('*')
                        .orderBy(orderBy, order);
                    return response.json(res);
                } else {
                    const res = await connection(table)
                        .select('*');
                    return response.json(res);
                }
            }
        } catch (err) {
            return response.sendStatus(422);
        }
    },
}