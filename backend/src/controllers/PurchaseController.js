const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const id_user = request.headers.authorization;
        const {
            value,
            payment_method,
            change,
            id_address,
            observation,
            date,
            time,
        } = request.body;

        const [id_schedule] = await connection('schedule')
            .where({
                date: date,
                time: time
            })
            .select('id');
        

        const [size] = await connection('shopping_carts')
            .where('id_user', id_user)
            .count('*');
        

        if (size['count(*)'] < 1) {

            return response.status(400).json({
                "error": "Não há nenhum item no carrinho"
            });
        }
        await connection('purchases').insert({
            value,
            payment_method,
            change,
            id_user,
            id_address,
            observation,
        });

        const idPurchase = await connection('purchases')
            .select('id')
            .orderBy('id', 'desc')
            .first();

        const id_purchase = idPurchase.id;
        
        await connection('schedule')
            .update('id_purchase', id_purchase)
            .where({
                date: date,
                time: time
            });

        const products = await connection('shopping_carts')
            .select('id_product', 'amount', 'observation', 'unit')
            .where('id_user', id_user);
        for (var product in products) {
            let amount = products[product]['amount'];
            let id_product = products[product]['id_product']
            let observation = products[product]['observation']
            let unit = products[product]['unit']

            await connection('productsPurchases').insert({
                amount,
                observation,
                unit,
                id_purchase,
                id_product
            });
        }

        await connection('shopping_carts').where('id_user', id_user).delete();

        return response.status(201).send();
    },

    async updateDelivery(request, response){
        const { id } = request.body;
        await connection('purchases')
            .where('id', id)
            .update({ delivered:  true}); // Só mostra delivered: false no painel

        return response.status(201).send();
    },

    async index(request, response) {

    
        const purchases = await connection({
            p: 'purchases',
            u: 'users',
            a: 'addresses',
            s: 'schedule'
         })
            .select({
                id: 'p.id',
                delivered: 'p.delivered',
                value: 'p.value',
                payment_method: 'p.payment_method',
                change: 'p.change',
                observation: 'p.observation',
                delivery_date: 's.date',
                delivery_time: 's.time',
                client: 'u.name',
                client_phone: 'u.phone',
                city: 'a.city',
                neighborhood: 'a.neighborhood',
                street: 'a.street',
                number: 'a.number',
                complement: 'a.complement'
            })
            .whereRaw('p.id_user = u.id and p.id_address = a.id and p.id = s.id_purchase and p.delivered = false')
            .orderByRaw('date(s.date) asc');
        

        return response.json(purchases);
    }
};