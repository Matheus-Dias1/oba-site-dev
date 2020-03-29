const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const {name, email, password, phone} = request.body;
        const table_size = await connection('users').count('id');
        id = (table_size[0]['count(`id`)'] + 1).toString();
        await connection('users').insert({
            id,
            name,
            email,
            password,
            phone,
        });
        return response.json({ id });
    },

    async index(request,response){
        const users = await connection('users').select('*');
        return response.json(users);
    }
};