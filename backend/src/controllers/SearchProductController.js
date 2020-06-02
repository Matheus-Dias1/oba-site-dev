const connection = require('../database/connection');

module.exports = {
    async search(request, response) {
        function slugify(string) {
            let str = string.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' '); // trim
            str = str.toLowerCase();

            var from = "àáãäâẽèéëêìĩíïîòóõöôùúüũûñç·/_,:;";
            var to = "aaaaaeeeeeiiiiiooooouuuuunc------";
            for (var i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }

            str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes

            return str;
        }

        const {
            query,
            page = 1
        } = request.query;
        try {
            const [count] = await connection('products')
                .select('*')
                .where('available', 1)
                .where('slug', 'like', `%${slugify(query)}%`)
                .count();
            const products = await connection('products')
                .select('*')
                .where('slug', 'like', `%${slugify(query)}%`)
                .where('available', 1)
                .limit(8)
                .offset((page - 1) * 8)

            response.header('X-Total-Count', count['count(*)']);
            return response.json(products)
        } catch (err) {
            console.log('UNEXPECTED ERROR ON PRODUCT SEARCH: ', err);
            return response.sendStatus(422);
        }
    }
};