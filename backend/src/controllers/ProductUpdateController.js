const connection = require('../database/connection');

module.exports = {
    async update(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.status(401).send();

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

            return response.status(201).send();
        } catch (err) {
            return response.status(422).send();
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
            return response.status(422).send();
        }
    }
};


