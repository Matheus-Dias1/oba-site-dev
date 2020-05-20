const connection = require('../database/connection');
require('dotenv').config();


module.exports = {
    async dbQuery(request, response) {
        const {
            rawQuery,
            table,
            orderBy,
            order,
            page
        } = request.body;
        const dbKey = request.headers['dbkey'];
        if (dbKey !== process.env.DB_PASSWORD) {
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
                const [count] = await connection(table)
                    .count();
                response.header('X-Total-Count', count['count(*)']);

                if (!!orderBy) {

                    const res = await connection(table)
                        .select('*')
                        .orderBy(orderBy, order)
                        .limit(25)
                        .offset((page - 1) * 25);
                    return response.json(res);
                } else {
                    const res = await connection(table)
                        .select('*')
                        .limit(25)
                        .offset((page - 1) * 25);


                    return response.json(res);
                }
            }
        } catch (err) {
            return response.sendStatus(422);
        }
    },
}