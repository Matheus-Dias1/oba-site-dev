const connection = require('../database/connection');

module.exports = {
    async update(request, response) {
        const { id } = request.params;
        const {
            product_name,
            description,
            measurement_unit,
            price,
            unit_price,
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
                })
            
                return response.status(201).send(); 
        } catch (err) {
            return response.status(400).send(); 
        }


    },

    async getData(request, response) {
        const { id } = request.params;
        const products = await connection('products')
            .where('id', id)
            .select(
                'id',
                'product_name',
                'description',
                'measurement_unit',
                'price',
                'unit_price'
            )
            .first();
        return response.json(products);
    }

};


