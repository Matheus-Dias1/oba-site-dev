const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
        await sleep(2000)
        const {
            id_product,
            amount,
            unit,
            observation
        } = request.body;
        const id_user = request.data.id;
        var curCart;
        try {
            curCart = await connection('shopping_carts')
                .select('*')
                .where({
                    id_product,
                    unit,
                    observation,
                    id_user
                })
                .first();
        } catch (err) {

        }
        try {
            if (curCart == null) {
                await connection('shopping_carts').insert({
                    id_user,
                    id_product,
                    amount,
                    unit,
                    observation,
                });
            }else{
                await connection('shopping_carts')
                .update('amount', curCart.amount+amount)
                .where({
                    id_user,
                    id_product,
                    unit,
                    observation, 
                });
            }

            const data = await connection('products')
                .select('price', 'unit_price')
                .where('id', id_product)
                .first();

            let value;
            if (unit === 'UN' && data.unit_price !== null)
                value = amount * data.unit_price;
            else value = amount * data.price;
            return response.json({ value: value });
        } catch (err) {
            console.log(err);
            return response.status(422).send();
        }
    },

    async index(request, response) {
        const admin = request.data.admin;
        if (!admin)
            return response.sendStatus(403);
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
                .whereRaw('sc.id_product = p.id')

            return response.json(shopping_carts);
        } catch (err) {
            console.log(err)
            return response.status(422).send();
        }
    },

    async delete(request, response) {
        const id_user = request.data.id;
        try {
            await connection('shopping_carts')
                .where('id_user', id_user)
                .delete();

            response.status(200).send();
        } catch (err) {
            return response.status(422).send();
        }
    },

};
