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
            code
        } = request.body;
        const exp = validUntil(expiration);
        let rCode;
        if (code === '')
            rCode = crypto.randomBytes(3).toString('HEX').toUpperCase();
        try {
            await connection('cupons')
                .where('expiration_date', '<', new Date().valueOf())
                .orWhere('amount', '<=', 0)
                .delete();
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON CUPON DELETING OLD CUPONS CREATE: ', err)
        }
        try {
            let oldAmount;
            if (code) {
                oldAmount = await connection('cupons')
                    .select('amount')
                    .where({
                        'code': code,
                        'discount_type': discount_type,
                        'discount': discount,
                        'min_value': min_value,
                    })
                    .first();
            }

            if (oldAmount)
                await connection('cupons')
                    .where('code', code.toUpperCase())
                    .update({
                        amount: oldAmount ? oldAmount.amount + amount : amount,
                        expiration_date: exp,
                    });
            else
                await connection('cupons')
                    .insert({
                        code: code === '' ? rCode : code.toUpperCase(),
                        amount: oldAmount ? oldAmount + amount : amount,
                        expiration_date: exp,
                        discount_type,
                        discount,
                        min_value,
                    });
            return response.json({
                status: 'OK',
                code: code === '' ? rCode : code.toUpperCase()
            })
        } catch (err) {
            if (err.errno === 19)
                return response.json({
                    status: 'ERROR',
                    message: 'Já existe um cupom com esse código'
                })
            console.log('\nUNEXPECTED ERROR ON CUPON CREATION: ', err);
            return response.sendStatus(422);
        }
    },
    async getCupon(request, response) {
        const { code } = request.params;
        try {
            const res = await connection('cupons')
                .select('discount_type', 'discount', 'min_value')
                .where('code', code.toUpperCase())
                .first();
            if (res == null)
                return response.json({
                    status: 'FAIL',
                    message: 'O cupom informado não foi encontrado.'
                })

            if (res.expiration_date < (new Date).getTime()) {
                try {
                    await connection('cupons')
                        .where('code', code.toUpperCase())
                        .delete();

                } catch (err) {
                    console.log('UNEXPECTED ERROR ON GETCUPON/DELETE EXPIRED CUPON: ', err)
                }
                return response.json({
                    status: 'FAIL',
                    message: 'O cupom informado expirou.'
                })
            }

            return response.json({
                status: 'OK',
                result: res
            });

        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON GETCUPON: ', err)
            return response.sendStatus(422);
        }
    },
}