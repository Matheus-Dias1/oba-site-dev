const connection = require('../database/connection');

module.exports = {
    async create (request, response){
        const {email, password} = request.body;
        const user = await connection('users')
            .select('password', 'name')
            .where('email', email)
            .first();

        if (!user){
            return response.status(400).json({error: 'email not found'});
        }

        if(user.password!= password){
            return response.status(400).json({error: 'password is incorrect'});
        }

        const name = user.name;
        return response.json({'name': name});

    }
}