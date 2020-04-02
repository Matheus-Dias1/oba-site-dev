const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const {
            product_name,
            available,
            description,
            measurement_unit,
            price,
            unit_price,
            picture_path
        } = request.body;

        const table_size = await connection('products').count("id").first();
        const num = table_size['count(`id`)'];
        var id = 1;
        if (num > 0){
            const lastID = await connection('products')
                .select('id')
                .offset(num-1)
                .first();               
                id = parseInt(lastID['id'])+1;
        }
        await connection('products').insert({
            id,
            product_name,
            available,
            description,
            measurement_unit,
            price,
            unit_price,
            picture_path
        });
        return response.json({ id });
    },

    async index(request,response){
        const {page = 1} = request.query;
        const [count] = await connection('products').count();
        const products = await connection('products')
            .limit(5)
            .offset((page-1)*5)
            .select('*');

        response.header('X-Total-Count', count['count(*)']);
        return response.json(products);
    }
};
