const connection = require('../database/connection');

module.exports = {
    async index(request, response) {

        const {idP} = request.params;
        const purchases = await connection({
            p: 'purchases',
            u: 'users',
            a: 'addresses',
            s: 'schedule',
            pp: 'productsPurchases',
            prod: 'products'
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
                complement: 'a.complement',
                product: 'prod.product_name',
                amount: 'pp.amount',
                unit: 'pp.unit',
                pObservation: 'pp.observation',

            })
            .where('p.id', idP)
            .whereRaw('p.id_user = u.id and p.id_address = a.id and p.id = s.id_purchase and p.delivered = false and pp.id_product = prod.id')
            .orderBy(['s.date', {column:'s.time', order: 'asc'}]);
        

        return response.json(purchases);
    }
}