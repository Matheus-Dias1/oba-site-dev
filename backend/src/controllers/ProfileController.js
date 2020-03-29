const connection = require('../database/connection');

module.exports = {
    async indexAddresses (request, response){
        const {page = 1} = request.query;
        const id_user = request.headers.authorization;
        const [count] = await connection('addresses').where('id_user',id_user).count();
        const addresses = await connection('addresses')
            .limit(5)
            .offset((page-1)*5)
            .select('*')
            .where('id_user', id_user); 

        response.header('X-Total-Count', count['count(*)']);
        return response.json(addresses);
    },

    async indexPurchases (request, response){
        const {page = 1} = request.query;
        const id_user = request.headers.authorization;
        const [count] = await connection('purchases').where('id_user',id_user).count();
        const purchases = await connection('purchases')
            .limit(5)
            .offset((page-1)*5)
            .select('*')
            .where('id_user', id_user); 

        response.header('X-Total-Count', count['count(*)']);
        return response.json(purchases);
    },

    async indexShoppingCarts (request, response){
        const {page = 1} = request.query;
        const id_user = request.headers.authorization;
        const [count] = await connection('shopping_carts').where('id_user',id_user).count();
        const shopping_carts = await connection('shopping_carts')
            .limit(5)
            .offset((page-1)*5)
            .select('*')
            .where('id_user', id_user); 

        response.header('X-Total-Count', count['count(*)']);
        return response.json(shopping_carts);
    },
}