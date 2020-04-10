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
        } = JSON.parse(request.body.data);

        
        const table_size = await connection('products').count("id").first();
        const num = table_size['count(`id`)'];
        var id = 1;
        if (num > 0){
            const lastID = await connection('products')
                .select('id', 'product_name')
                .offset(num-1)
                .first();  
                id = parseInt(lastID['id'])+1;
        }
        const picture_path = request.file.filename;
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
        const products = await connection('products').select('*');
        return response.json(products);
    },

    async delete(request, response){
        const {id} = request.params;
        const id_user = request.headers.authorization;
        const adm = await connection('users')
            .select('admin')
            .where('id', id_user)
            .first();


        if (!adm){
            return response.status(401).json({ error: 'Operation not permitted'});
        }

        await connection('products').where('id', id).delete();

        return response.status(201).send(); 
    }
};
