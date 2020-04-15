const connection = require('../database/connection');

module.exports = {
    async index(request, response) {

        const { idP } = request.params;
        const items = await connection({
            pp: 'productsPurchases',
            prod: 'products'
        })
            .select({
                product: 'prod.product_name',
                amount: 'pp.amount',
                unit: 'pp.unit',
                observation: 'pp.observation',

            })
            .where('pp.id_purchase', idP)
            .whereRaw('pp.id_product = prod.id');

        const data = await connection({
            p: 'purchases',
            u: 'users',
            a: 'addresses',
            s: 'schedule'
        })
            .select({
                id: 'p.id',
                value: 'p.value',
                payment_method: 'p.payment_method',
                change: 'p.change',
                observation: 'p.observation',
                delivery_date: 's.date',
                delivery_time: 's.time',
                client: 'u.name',
                client_phone: 'u.phone',
                neighborhood: 'a.neighborhood',
                street: 'a.street',
                number: 'a.number',
                complement: 'a.complement'
            })
            .where('p.id', idP)
            .whereRaw('p.id_user = u.id and p.id_address = a.id and p.id = s.id_purchase')
            .orderBy(['s.date', { column: 's.time', order: 'asc' }])
            .first();

        const res = {
            items: items,
            data: data
        };
        return response.json(res);
    }
}