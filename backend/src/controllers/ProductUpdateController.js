const connection = require('../database/connection');

module.exports = {
    async update(request, response) {

        function string_to_slug(str) {
            str = str.replace(/^\s+|\s+$/g, '');
            str = str.toLowerCase();
            var from = "ãàáäâèéẽëêĩìíïîõòóöôũùúüûñç·/_,:;";
            var to = "aaaaaeeeeeiiiiiooooouuuuunc------";
            for (var i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }
            str = str.replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            return str;
        }

        const { id } = request.params;
        const {
            product_name,
            description,
            category,
            measurement_unit,
            price,
            unit_price,
        } = request.body;
        const slug = string_to_slug(product_name);
        try {
            await connection('products')
                .where({ id: id })
                .update({
                    "product_name": product_name,
                    "slug": slug,
                    "description": description,
                    "measurement_unit": measurement_unit,
                    "price": price,
                    "unit_price": unit_price,
                    "category": category,
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
                    'category'
                )
                .first();
            return response.json(products);
        } catch (err) {
            return response.status(422).send();
        }
    }
};


