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
                .where({
                    id_user: id_user,
                    visible: 1
                });

            response.header('X-Total-Count', count['count(*)']);
            return response.json(addresses);
        } catch (err) {
            return response.status(422).send();
        }

    },
    async indexShoppingCart(request, response) {
        const id_user = request.data.id;
        try {
            const shopping_carts = await connection({
                sc: 'shopping_carts',
                p: 'products'
            }).select({
                id: 'p.id',
                price: 'p.price',
                name: 'p.product_name',
                unit_price: 'p.unit_price',
                unit: 'sc.unit',
                amount: 'sc.amount',
                observation: 'sc.observation'
            })
                .where('sc.id_user', id_user)
                .whereRaw('sc.id_product = p.id')

            return response.json(shopping_carts);
        } catch (err) {
            return response.status(422).send();
        }
    },
    async deleteItemFromCart(request, response) {
        const id_user = request.data.id;
        const {
            id,
            amount,
            observation,
            unit,
        } = request.query;
        try {
            await connection('shopping_carts')
                .where({
                    id_user: id_user,
                    id_product: id,
                    amount,
                    observation,
                    unit,
                })
                .delete()
            return response.sendStatus(200);
        } catch (err) {
            return response.status(422).send();
        }
    },
    async hideAddress(request, response) {
        const { id } = request.params;
        try {
            const addresses = await connection('addresses')
                .update('visible', 0)
                .where('id', parseInt(id));

            return response.sendStatus(200);
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