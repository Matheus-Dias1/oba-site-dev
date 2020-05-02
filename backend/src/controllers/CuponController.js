const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async create(request, response) {
        const admin = request.data.admin;
        if (!admin)
            return response.sendStatus(403);
        function validUntil(hours) {
            const now = (new Date).getTime();
            return now + hours * 60 * 60 * 1000
        }

        const {
            amount,
            expiration,
            discount_type,
            discount,
            min_value,
        } = request.body;
        const exp = validUntil(expiration);
        const code = crypto.randomBytes(4).toString('HEX').toUpperCase();
        try {
            await connection('cupons')
                .insert({
                    code,
                    amount,
                    expiration_date: exp,
                    discount_type,
                    discount,
                    min_value,
                })
            return response.json({
                code: code
            })
        } catch (err) {
            return response.status(422).send();
        }
    },
    async getCupon(request, response) {
        const { code } = request.params;
        try {
            const res = await connection('cupons')
                .select('*')
                .where('code', code.toUpperCase())
                .first();
            if (res == null)
                return response.json({
                    status: 'FAIL',
                    message: 'O cupom informado não foi encontrado.'
                })

            if (res.expiration_date < (new Date).getTime())
                try {
                    await connection('cupons')
                        .where('code', code.toUpperCase())
                        .delete();

                    return response.json({
                        status: 'FAIL',
                        message: 'O cupom informado expirou.'
                    })
                } catch (err) {
                    console.log(err);
                }


            return response.json(res);

        } catch (err) {
            console.log(err)
            return response.status(422).send();
        }
    },
}