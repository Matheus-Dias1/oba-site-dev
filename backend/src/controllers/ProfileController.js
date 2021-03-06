const connection = require('../database/connection');

module.exports = {
    async indexAddresses(request, response) {

        const id_user = request.data.id;
        try {
            const addresses = await connection('addresses')
                .select('*')
                .where({
                    id_user: id_user,
                    visible: 1
                });

            return response.json(addresses);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PROFILE INDEXADDRESSES: ', err)
            return response.sendStatus(422);
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
            console.log('\nUNEXPECTED ERROR ON PROFILE INDEXSHOPPINGCART: ', err)
            return response.sendStatus(422);
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
            console.log('\nUNEXPECTED ERROR ON PROFILE DELETEFROMCART: ', err)
            return response.sendStatus(422);
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
            console.log('\nUNEXPECTED ERROR ON PROFILE HIDEADDRESS: ', err)
            return response.sendStatus(422);
        }

    },
    async getCartTotal(request, response) {
        const id_user = request.data.id;
        try {
            const cartItems = await connection({
                sc: 'shopping_carts',
                p: 'products'
            }).select({
                price: 'p.price',
                unit_price: 'p.unit_price',
                unit: 'sc.unit',
                amount: 'sc.amount',
            })
                .where('sc.id_user', id_user)
                .whereRaw('sc.id_product = p.id')

            var sum = 0;

            for (i in cartItems) {

                if (cartItems[i].unit === 'UN' && cartItems[i].unit_price !== null)
                    sum = sum + cartItems[i].unit_price * cartItems[i].amount;
                else
                    sum = sum + cartItems[i].price * cartItems[i].amount;
            }
            return response.json({ cartValue: sum });
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PROFILE GETCARTTOTAL: ', err)
            return response.sendStatus(422);
        }

    },

    async indexProducts(request, response) {
        const {
            page = 1,
            category = '',
            city
        } = request.query;
        try {
            const [count] = await connection('products')
                .where('available', true)
                .where('category', 'like', `%${category}%`)
                .where('delivers_to', 'like', `%${city}%`)
                .count();
            const addresses = await connection('products')
                .limit(10)
                .offset((page - 1) * 10)
                .select('*')
                .where('available', true)
                .where('delivers_to', 'like', `%${city}%`)
                .where('category', 'like', `%${category}%`)

            response.header('X-Total-Count', count['count(*)']);
            return response.json(addresses);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PROFILE INDEXPRODUCTS: ', err)
            return response.sendStatus(422);
        }

    },

    async indexPurchases(request, response) {
        const { page = 1 } = request.query;
        const id_user = request.data.id;
        try {
            const [count] = await connection('purchases')
                .where('id_user', id_user)
                .count();
            const purchases = await connection({
                p: 'purchases',
                a: 'addresses'
            })
                .select({
                    change: 'p.change',
                    id: 'p.id',
                    street: 'a.street',
                    number: 'a.number',
                    neighborhood: 'a.neighborhood',
                    city: 'a.city',
                    state: 'a.state',
                    complement: 'a.complement',
                    value: 'p.value',
                    payment_method: 'p.payment_method',
                    observation: 'p.observation',
                    delivered: 'p.delivered',
                    delivery_date: 'p.delivery_date',
                    delivery_period: 'p.delivery_period'
                })
                .limit(8)
                .offset((page - 1) * 8)
                .where('p.id_user', id_user)
                .whereRaw('a.id = p.id_address')
                .orderBy('p.id', 'desc');

            response.header('X-Total-Count', count['count(*)']);
            return response.json(purchases);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PROFILE INDEXPURCHASES: ', err)
            return response.sendStatus(422);
        }

    },

    async indexProductsPurchase(request, response) {
        const { id_purchase } = request.params;
        try {
            const items = await connection({
                p: 'products',
                pp: 'productsPurchases'
            })
                .select({
                    amount: 'pp.amount',
                    observation: 'pp.observation',
                    unit: 'pp.unit',
                    name: 'p.product_name'
                })
                .where('pp.id_purchase', id_purchase)
                .whereRaw('pp.id_product = p.id');


            return response.json(items);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PROFILE INDEXPRODUCTSPURCHASES: ', err)
            return response.sendStatus(422);
        }

    },


}