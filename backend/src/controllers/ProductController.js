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

        
        
        const picture_path = request.file.filename;
        await connection('products').insert({

            product_name,
            available,
            description,
            measurement_unit,
            price,
            unit_price,
            picture_path
        });
        return response.status(201).send();
    },

    async index(request,response){
        const products = await connection('products')
            .select('*')
            .orderBy('available', 'desc');
        return response.json(products);
    },

    async updateAvailability(request,response){
        
        const { id } = request.body;

        let {available} = await connection('products')
            .select('available')
            .where('id', id)
            .first();
        available = !available;

        await connection('products')
            .where('id', id)
            .update({ available: available });

        return response.status(201).send(); 
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
