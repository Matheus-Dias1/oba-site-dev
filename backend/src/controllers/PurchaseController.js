const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const {
            value,
            payment_method,
            change,
            id_address,
            observation,
        } = request.body;
        const table_size = await connection('purchases').count('id');
        const id = (table_size[0]['count(`id`)'] + 1).toString();
        const id_user = request.headers.authorization;
        const products = await connection('shopping_carts').select('id_product','amount').where('id_user',id_user);
        for (var product in products){
            const amount = products[product]['amount'];
            const id_product = products[product]['id_product']
            const id_purchase = id;
            await connection('productsPurchases').insert({
                amount,
                id_purchase,
                id_product
            });
        }

        await connection('purchases').insert({
            id,
            value,
            payment_method,
            change,
            id_user,
            id_address,
            observation
        });

        await connection('shopping_carts').where('id_user', id_user).delete();

        /*

            CADASTRAR ENTREGAS

        */

        
        return response.json({ id });
    },

    async index(request,response){
        const {page = 1} = request.query;
        const [count] = await connection('purchases').count();
        const purchases = await connection('purchases')
            .limit(5)
            .offset((page-1)*5)
            .select('*');

        response.header('X-Total-Count', count['count(*)']);
        return response.json(purchases);
    }
};