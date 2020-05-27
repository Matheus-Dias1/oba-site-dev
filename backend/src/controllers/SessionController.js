const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = {
    async create(request, response) {
        const { email, password } = request.body;
        try {
            const user = await connection('users')
                .select('password', 'name', 'id', 'admin')
                .where('email', email)
                .first();

            if (!user) {
                return response.status(400).json({
                    error: 'E-mail não cadastradado ou senha incorreta'
                });
            }

            bcrypt.compare(password, user.password, function (err, doesMatch) {
                if (doesMatch) {
                    data = {
                        name: user.name,
                        id: user.id,
                        admin: user.admin,
                    };
                    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '365d' })
                    try {
                        connection('shopping_carts')
                            .where('id_user', user.id)
                            .delete().then(() => {
                                return response.json({ name: user.name, accessToken: accessToken, admin: user.admin });
                            });
                    } catch (err) {
                        throw err;
                    }
                    
                } else {
                    return response.status(400).json({
                        error: 'E-mail não cadastradado ou senha incorreta'
                    });
                }
            });
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON SESSION: ', err)
            return response.sendStatus(422);
        }
    }
}