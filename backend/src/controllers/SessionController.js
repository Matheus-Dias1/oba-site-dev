const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
    async create (request, response){
        const {email, password} = request.body;
        const user = await connection('users')
            .select('password', 'name', 'id', 'admin')
            .where('email', email)
            .first();

        if (!user){
            return response.status(400).json({
                error: 'E-mail não cadastrado.'
            });
        }
        
        bcrypt.compare(password, user.password, function(err, doesMatch){
            if (doesMatch){
                return response.json({
                    name: user.name,
                    id: user.id,
                    admin: user.admin,
                });
            }else{
                return response.status(400).json({
                    error: 'password is incorrect'
                });
            }
           });

    }
}