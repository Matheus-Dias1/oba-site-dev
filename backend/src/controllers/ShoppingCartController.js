const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const { id_product,amount, unit, observation } = request.body;
        const id_user = request.headers.authorization;
        await connection('shopping_carts').insert({
            id_user,
            id_product,
            amount,
            unit,
            observation,
        });
        return response.status(201).send();
    },

    async index(request,response){

        const shopping_carts = await connection('shopping_carts').select('*');
        return response.json(shopping_carts);
    },

    async delete(request,response){

    },

    async update(request,response){


    }
};
