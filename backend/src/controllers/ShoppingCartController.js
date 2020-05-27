const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
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
            } else {
                await connection('shopping_carts')
                    .update('amount', curCart.amount + amount)
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
            console.log('\nUNEXPECTED ERROR ON SHOPPINGCART CREATE: ', err)
            return response.sendStatus(422);
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
            console.log('\nUNEXPECTED ERROR ON SHOPPINGCART INDEX: ', err)
            return response.sendStatus(422);
        }
    },

    async checkForCity(request, response) {
        const id = request.data.id;
        const { city } = request.query;
        try {
            const products = await connection({
                sc: 'shopping_carts',
                p: 'products'
            })
                .select({
                    name: 'p.product_name',
                })
                .whereRaw('sc.id_product = p.id')
                .whereNot('delivers_to', 'like', `%${city}%`)
                .where('sc.id_user', id);

            if (products.length === 0)
                return response.json({
                    status: 'OK',
                    products: []
                })
            var resProds = [];
            for (i in products){
                resProds.push(products[i].name);
            }
            return response.json({
                status: 'FAIL',
                products: resProds
            });
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON SHOPPINGCART CHECKFORCITY: ', err)
            return response.sendStatus(422);
        }
    },

    async delete(request, response) {
        const id_user = request.data.id;
        try {
            await connection('shopping_carts')
                .where('id_user', id_user)
                .delete();

            response.sendStatus(200);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON SHOPPINGCART DELETE: ', err)
            return response.sendStatus(422);
        }
    },

};
