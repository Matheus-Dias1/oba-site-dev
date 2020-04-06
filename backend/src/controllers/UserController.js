const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
    async create(request, response) {
        try {
            
            const { name, email, password, phone } = request.body;
            const table_size = await connection('users').count('id');
            id = (table_size[0]['count(`id`)'] + 1).toString();
            
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            await connection('users').insert({
                id,
                name,
                email,
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
        }
    },

    async index(request, response) {
        const users = await connection('users').select('*');
        return response.json(users);
    }
};