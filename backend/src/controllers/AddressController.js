const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const {
            zip_code,
            country,
            state,
            city,
            neighborhood,
            street,
            number,
            complement
        } = request.body;


        const id_user = request.headers.authorization;
        try {
            await connection('addresses').insert({
                zip_code,
                country,
                state,
                city,
                neighborhood,
                street,
                number,
                complement,
                id_user
            });
            return response.status(201).send();
        } catch (err) {
            
            response.status(422).send();
        }

    },

    async index(request, response) {
        const [count] = await connection('addresses').count();

        const { page = 1 } = request.query;

        try {
            const addresses = await connection('addresses')
                .limit(5)
                .offset((page - 1) * 5)
                .select('*');

            response.header('X-Total-Count', count['count(*)']);
            return response.json(addresses);
        } catch (err) {
            
            response.status(422).send();
        }

    },

    async delete(request, response) {
        const { id } = request.params;
        const id_user = request.headers.authorization;

        try {
            const address = await connection('addresses')
                .select('*')
                .where('id', id)
                .first();

            if (address.id_user != id_user) {
                return response.status(401).json({ error: 'Operation not permitted' });
            }

            await connection('addresses').where('id', id).delete();

            return response.status(201).send();
        } catch (err) {
            response.status(422).send();
        }

    },
};