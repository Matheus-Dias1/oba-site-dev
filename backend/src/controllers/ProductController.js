const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const {
            product_name,
            available,
            description,
            measurement_unit,
            price,
            picture_path
        } = request.body;
        const table_size = await connection('products').count('id');
        const id = (table_size[0]['count(`id`)'] + 1).toString();
        await connection('products').insert({
            id,
            product_name,
            available,
            description,
            measurement_unit,
            price,
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
