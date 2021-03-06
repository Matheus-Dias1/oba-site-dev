const connection = require('../database/connection');

module.exports = {
    async update(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);

        const { id } = request.params;
        const {
            product_name,
            description,
            category,
            measurement_unit,
            price,
            unit_price,
            delivers_to
        } = request.body;

        try {
            await connection('products')
                .where({ id: id })
                .update({
                    "product_name": product_name,
                    "description": description,
                    "measurement_unit": measurement_unit,
                    "price": price,
                    "unit_price": unit_price,
                    "category": category,
                    "delivers_to": delivers_to
                })

            return response.sendStatus(200);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PRODUCTUPDATE UPDATE: ', err)
            return response.sendStatus(422);
        }
    },

    async getData(request, response) {
        const { id } = request.params;
        try {
            const products = await connection('products')
                .where('id', id)
                .select(
                    'id',
                    'product_name',
                    'description',
                    'measurement_unit',
                    'price',
                    'unit_price',
                    'category',
                    'delivers_to'
                )
                .first();
            return response.json(products);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PRODUCTUPDATE GETDATA: ', err)
            return response.sendStatus(422);
        }
    },
    async createDeal(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        const {
            dealUnitPrice,
            unitPrice,
            dealPrice,
            price,
            category
        } = request.body;
        const { id } = request.params;

        try {
            await connection('products')
                .update({
                    'price': dealPrice ? dealPrice : price,
                    'unit_price': dealUnitPrice ? dealUnitPrice : unitPrice,
                    'full_price': dealPrice ? price : null,
                    'full_unit_price': dealUnitPrice ? unitPrice : null,
                    'category': category + ',ofertas'
                })
                .where('id', id);

            return response.sendStatus(200);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PRODUCTUPDATE CREATEDEAL: ', err)
            return response.sendStatus(422);
        }

    },
    async removeDeal(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        const {
            unitPrice,
            price,
            category
        } = request.body;
        const { id } = request.params;
        try {
            await connection('products')
                .update({
                    'price': price,
                    'unit_price': unitPrice,
                    'full_price': null,
                    'full_unit_price': null,
                    'category': category.replace(',ofertas', '')
                })
                .where('id', id);

            return response.sendStatus(200);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PRODUCTUPDATE REMOVEDEAL: ', err)
            return response.sendStatus(422);
        }

    },
};


