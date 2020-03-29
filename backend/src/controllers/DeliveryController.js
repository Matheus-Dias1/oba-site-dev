const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        
    },

    async index(request,response){
        const {page = 1} = request.query;
        const [count] = await connection('deliveries').count();
        const deliveries = await connection('deliveries')
            .limit(5)
            .offset((page - 1) * 5)
            .select('*');

        response.header('X-Total-Count', count['count(*)']);
        return response.json(deliveries);
    }
};