const connection = require('../database/connection');

module.exports = {
    async create(request, response) {

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
        const admin = request.data.admin;
        if (admin !== 1) return response.status(401).send();
        const {
            product_name,
            available,
            description,
            measurement_unit,
            price,
            unit_price,
            category,
        } = JSON.parse(request.body.data);

        const slug = string_to_slug(product_name);
        const picture_path = request.file.filename;

        try {
            await connection('products').insert({
                product_name,
                slug,
                available,
                category,
                description,
                measurement_unit,
                price,
                unit_price,
                picture_path
            });
            return response.status(201).send();
        } catch (err) {
            response.status(422).send();
        }

    },

    async index(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.status(401).send();
        try {
            const products = await connection('products')
                .select('*')
                .orderBy('available', 'desc');
            return response.json(products);
        } catch (err) {
            response.status(422).send();
        }
    },

    async updateAvailability(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.status(401).send();
        const { id } = request.body;
        try {
            let { available } = await connection('products')
                .select('available')
                .where('id', id)
                .first();
            available = !available;

            await connection('products')
                .where('id', id)
                .update({ available: available });

            return response.status(201).send();
        } catch (err) {
            response.status(422).send();
        }

    },

};
