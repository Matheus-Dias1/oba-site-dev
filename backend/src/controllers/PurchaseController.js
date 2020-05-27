const connection = require('../database/connection');
const knex = require('knex')



module.exports = {
    async create(request, response) {
        try {
            await connection.transaction(async connection => {
                const id_user = request.data.id;
                const {
                    value,
                    payment_method,
                    change,
                    id_address,
                    observation,
                    delivery_date,
                    delivery_period,
                    cupon,
                    pcity
                } = request.body;
                if (cupon !== 'NO_CUPON') {
                    const dbCupon = await connection('cupons')
                        .select('*')
                        .where('code', cupon.toUpperCase())
                        .first();

                    if (dbCupon == null || dbCupon.amount === 0 || dbCupon.expiration_date < (new Date).valueOf())
                        throw new Error('InvalidCupon');

                    if (dbCupon.amount > 1) {
                        await connection('cupons')
                            .update('amount', dbCupon.amount - 1)
                            .where('code', cupon.toUpperCase());
                    }
                    else {
                        await connection('cupons')
                            .where('code', cupon.toUpperCase())
                            .delete();
                    }


                }
                var city
                if (pcity == null) {
                    try {
                        var { city } = await connection('addresses')
                            .select('city')
                            .where('id', id_address)
                            .first();
                    } catch (err) {

                    }
                } else {
                    city = pcity
                }

                const selectedDate = await connection('schedule')
                    .select('*')
                    .where({
                        date: delivery_date,
                        city: ['uberlandia', 'uberlândia', 'udi'].includes(city.toLowerCase()) ? 'uberlandia' : 'araguari'
                    })
                    .first();



                if (selectedDate == null || (delivery_period === 'morning' && selectedDate.morning_deliveries === 0)) {
                    throw new Error('DateTaken');

                }
                if (selectedDate == null || (delivery_period === 'afternoon' && selectedDate.afternoon_deliveries === 0)) {
                    throw new Error('DateTaken');
                }
                if (selectedDate == null || (delivery_period === 'night' && selectedDate.night_deliveries === 0)) {
                    throw new Error('DateTaken');
                }

                if (delivery_period === 'morning') {
                    await connection('schedule')
                        .where('date', delivery_date)
                        .update('morning_deliveries', selectedDate.morning_deliveries - 1);
                } else if (delivery_period === 'afternoon') {
                    await connection('schedule')
                        .where('date', delivery_date)
                        .update('afternoon_deliveries', selectedDate.afternoon_deliveries - 1);
                } else if (delivery_period === 'night') {
                    await connection('schedule')
                        .where('date', delivery_date)
                        .update('night_deliveries', selectedDate.night_deliveries - 1);
                }

                const [size] = await connection('shopping_carts')
                    .where('id_user', id_user)
                    .count('*');
                if (size['count(*)'] < 1)
                    throw new Error('CartEmpty');

                await connection('purchases').insert({
                    value: Math.round(value * 100) / 100,
                    payment_method,
                    change: Math.round(change * 100) / 100,
                    id_user,
                    id_address,
                    observation,
                    delivery_period,
                    delivery_date,
                    cupon
                });

                const products = await connection('shopping_carts')
                    .select('id_product', 'amount', 'observation', 'unit')
                    .where('id_user', id_user);

                const id_purchase = await connection('purchases')
                    .select('id')
                    .orderBy('id', 'desc')
                    .first()
                let items = [];
                for (let product in products) {
                    let amount = products[product]['amount'];
                    let id_product = products[product]['id_product']
                    let observation = products[product]['observation']
                    let unit = products[product]['unit']
                    items.push({
                        id: String(products[product]['id_product']) + unit,
                        quantity: amount
                    })

                    await connection('productsPurchases').insert({
                        amount,
                        observation,
                        unit,
                        'id_purchase': id_purchase.id,
                        id_product
                    });
                }

                await connection('shopping_carts').where('id_user', id_user).delete();


                return response.json({
                    status: 'OK',
                    items,
                    orderID: id_purchase.id,
                });

            })
        } catch (error) {
            if (error.message === 'DateTaken')
                return response.json({
                    status: 'FAIL',
                    error: 'A data selecionada não está mais disponível'
                })
            else if (error.message === 'CartEmpty')
                return response.json({
                    status: 'FAIL',
                    error: 'O carrinho está vazio'
                })
            else if (error.message === 'InvalidCupon')
                return response.json({
                    status: 'FAIL',
                    error: 'O cupom expirou ou foi usado por outra pessoa'
                })
            else {
            console.log('\nUNEXPECTED ERROR ON PURCHASE CREATE: ', err)
            return response.sendStatus(422)
            }

        }

        return response.sendStatus(201);

    },

    async updateDelivery(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        const { id } = request.params;
        try {
            await connection('purchases')
                .where('id', id)
                .update({ delivered: true }); // Só mostra delivered: false no painel

            return response.sendStatus(200);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PURCHASE UPDATEDELIVERY: ', err)
            return response.sendStatus(422);
        }

    },

    async index(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        try {
            const purchases = await connection({
                p: 'purchases',
                u: 'users',
                a: 'addresses',
            })
                .select({
                    id: 'p.id',
                    delivered: 'p.delivered',
                    value: 'p.value',
                    payment_method: 'p.payment_method',
                    change: 'p.change',
                    observation: 'p.observation',
                    delivery_date: 'p.delivery_date',
                    delivery_period: 'p.delivery_period',
                    client: 'u.name',
                    client_phone: 'u.phone',
                    city: 'a.city',
                    neighborhood: 'a.neighborhood',
                    street: 'a.street',
                    number: 'a.number',
                    complement: 'a.complement'
                })
                .whereRaw('p.id_user = u.id and p.id_address = a.id and p.delivered = false')
                .orderByRaw('delivery_date, case delivery_period when "morning" then 1 when "afternoon" then 2 when "night" then 3 else 4 end');


            return response.json(purchases);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PURCHASE INDEX: ', err)
            return response.sendStatus(422);
        }
    }
};