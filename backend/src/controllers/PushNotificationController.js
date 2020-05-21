const connection = require('../database/connection');

module.exports = {
    async updateExpoToken(request, response) {
        const id = request.data.id;
        const {token} = request.body;

        try{
            await connection('users')
                .update('push_token', token)
                .where('id', id);
            return response.sendStatus(200);
        } catch (err){
            return response.sendStatus(422);
        }
    },
}