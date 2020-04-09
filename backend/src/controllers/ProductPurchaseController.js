const connection = require('../database/connection');

module.exports = {
    async index (request, response){
        const productsPurchases = await connection('productsPurchases').select('*');
        return response.json(productsPurchases);
    }
}