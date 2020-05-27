const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        const { idP } = request.params;
        if (idP !== 'all') {
            try {
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
                })
                    .select({
                        id: 'p.id',
                        value: 'p.value',
                        payment_method: 'p.payment_method',
                        change: 'p.change',
                        observation: 'p.observation',
                        delivery_date: 'p.delivery_date',
                        delivery_period: 'p.delivery_period',
                        client: 'u.name',
                        client_phone: 'u.phone',
                        neighborhood: 'a.neighborhood',
                        city: 'a.city',
                        street: 'a.street',
                        number: 'a.number',
                        complement: 'a.complement'
                    })
                    .where('p.id', idP)
                    .whereRaw('p.id_user = u.id and p.id_address = a.id')
                    .first();

                const res = {
                    items: items,
                    data: data
                };
                return response.json(res);
            } catch (err) {
                console.log('\nUNEXPECTED ERROR ON INDEX PRODUCTSPURCHASES IDP="all": ', err)
                return response.sendStatus(422);
            }
        }
        try {
            const idsND = await connection('purchases')
                .select('id')
                .where('delivered', 0)
                .orderByRaw('date(delivery_date) asc, delivery_period asc');

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
                })
                    .select({
                        id: 'p.id',
                        value: 'p.value',
                        payment_method: 'p.payment_method',
                        change: 'p.change',
                        observation: 'p.observation',
                        delivery_date: 'p.delivery_date',
                        delivery_period: 'p.delivery_period',
                        client: 'u.name',
                        client_phone: 'u.phone',
                        neighborhood: 'a.neighborhood',
                        city: 'a.city',
                        street: 'a.street',
                        number: 'a.number',
                        complement: 'a.complement'
                    })
                    .where('p.id', arrID[idI])
                    .whereRaw('p.id_user = u.id and p.id_address = a.id')
                    .first();

                let resI = {
                    items: itemsI,
                    data: data
                };
                res.push(resI);

            }
            return response.json(res);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON INDEX PRODUCTSPURCHASES idP="number": ', err)
            return response.sendStatus(422);
        }
    }
}