const connection = require('../database/connection');

module.exports = {
    async index(request, response) {

        const { idP } = request.params;
        if (idP !== '-1') {
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
                .first();

            const res = {
                items: items,
                data: data
            };
            return response.json(res);
        }
        const idsND = await connection({
            p: 'purchases',
            s: 'schedule'
        })
            .select('p.id')
            .where('p.delivered', 0)
            .whereRaw('p.id = s.id_purchase')
            .orderBy('s.id')
        let arrID = []
        for (id in idsND) {
            arrID.push(idsND[id].id);
        }

        const res = []
        for (idI in arrID) {
            let itemsI = await connection({
                pp: 'productsPurchases',
                prod: 'products',
            })
                .select({
                    product: 'prod.product_name',
                    amount: 'pp.amount',
                    unit: 'pp.unit',
                    observation: 'pp.observation',

                })
                .where('pp.id_purchase', arrID[idI])
                .whereRaw('pp.id_product = prod.id');
            let data = await connection({
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
                .where('p.id', arrID[idI])
                .whereRaw('p.id_user = u.id and p.id_address = a.id and p.id = s.id_purchase')
                .first();

            let resI = {
                items: itemsI,
                data: data
            };
            res.push(resI);

        }





        return response.json(res);

    }
}