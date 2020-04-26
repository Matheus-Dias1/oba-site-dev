const connection = require('../database/connection');

module.exports = {
    async indexAddresses(request, response) {
        const { page = 1 } = request.query;
        const id_user = request.data.id;
        try {
            const [count] = await connection('addresses').where('id_user', id_user).count();
            const addresses = await connection('addresses')
                .limit(5)
                .offset((page - 1) * 5)
                .select('*')
                .where('id_user', id_user);

            response.header('X-Total-Count', count['count(*)']);
            return response.json(addresses);
        } catch (err) {
            return response.status(422).send();
        }

    },

    async indexProducts(request, response) {
        const { page = 1 } = request.query;
        try {
            const [count] = await connection('products')
            .where('available', true)
            .count();
            const addresses = await connection('products')
                .limit(5)
                .offset((page - 1) * 5)
                .select('*')
                .where('available', true);

            response.header('X-Total-Count', count['count(*)']);
            return response.json(addresses);
        } catch (err) {
            return response.status(422).send();
        }

    },

    async indexPurchases(request, response) {
        const { page = 1 } = request.query;
        const id_user = request.data.id;
        try {
            const [count] = await connection('purchases').where('id_user', id_user).count();
            const purchases = await connection('purchases')
                .limit(5)
                .offset((page - 1) * 5)
                .select('*')
                .where('id_user', id_user);

            response.header('X-Total-Count', count['count(*)']);
            return response.json(purchases);
        } catch (err) {
            return response.status(422).send();
        }

    },


}