const connection = require('../database/connection');

module.exports = {
    async index (request, response){
        const productsPurchases = await connection('productsPurchases').select('*');
        console.log(productsPurchases);
        return response.json(productsPurchases);
    }
}