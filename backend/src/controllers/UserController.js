const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
    async create(request, response) {
        try {
            const { name, email, password, phone } = request.body;

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            await connection('users').insert({
                name,
                email: email.toLowerCase(),
                password: hash,
                phone
            });
            return response.json({
                status: "success",
            });
        } catch (e) {
            if (e.errno === 19) {
                return response.json({
                    status: "fail",
                    error: "E-mail já cadastrado!"
                });
            }
            else {
                console.log('\nUNEXPECTED ERROR ON USER CREATE: ', e)
                return response.sendStatus(422);
            }
        }
    },

    async index(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        try {
            const users = await connection('users').select('*');
            return response.json(users);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON SHOPPINGCART INDEX: ', err)
            return response.sendStatus(422);
        }
    }
};