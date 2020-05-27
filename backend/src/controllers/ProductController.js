const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        const {
            product_name,
            available,
            description,
            measurement_unit,
            price,
            unit_price,
            category,
            delivers_to
        } = JSON.parse(request.body.data);

        const picture_path = request.file.filename;

        try {
            await connection('products').insert({
                product_name,
                available,
                category,
                description,
                measurement_unit,
                price,
                unit_price,
                picture_path,
                delivers_to,
            });
            return response.sendStatus(201);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON CREATE PRODUCT: ', err)
            return response.sendStatus(422);
        }

    },



    async index(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        try {
            const products = await connection('products')
                .select('*')
                .orderBy('available', 'desc');
            return response.json(products);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON PRODUCT INDEX: ', err)
            return response.sendStatus(422);
        }
    },

    async updateAvailability(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        const { id } = request.params;
        try {
            let { available } = await connection('products')
                .select('available')
                .where('id', id)
                .first();
            available = !available;

            await connection('products')
                .where('id', id)
                .update({ available: available });

            return response.sendStatus(201);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON UPDATEAVAILABILITY: ', err)
            return response.sendStatus(422);
        }

    },

};
