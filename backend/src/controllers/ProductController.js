const connection = require('../database/connection');
const multer = require('multer');

module.exports = {
    async create(request, response){
        const {
            product_name,
            available,
            description,
            measurement_unit,
            price,
            unit_price,
            file
        } = request.body;


        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
              cb(null, "../assets/");
            },
            filename: (req, file, cb) => {
              cb(null, `${file.fieldname}_${+new Date()}.jpg`);
            }
          });
          const upload = multer({
            storage
        });

        upload.single(file);


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
        const picture_path = 'ok';
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
