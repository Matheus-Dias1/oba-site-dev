const connection = require('../database/connection');
const bcrypt = require('bcrypt');


module.exports = {
    async update(request, response) {
        const id = request.data.id;
        try {
            const {
                name,
                phone
            } = request.body;
            await connection('users')
                .update({
                    name,
                    phone
                })
                .where('id', id);
            return response.sendStatus(201);
        } catch (err) {
            return response.sendStatus(422);
        }
    },

    async updatePassword(request, response) {
        const id = request.data.id;
        const {
            oldPassword,
            newPassword
        } = request.body;
        try {

            const user = await connection('users')
                .select('password')
                .where('id', id)
                .first();

            bcrypt.compare(oldPassword, user.password, async function (err, doesMatch) {
                if (doesMatch) {

                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(newPassword, salt);

                    await connection('users')
                        .update('password', hash)
                        .where('id', id);
                        
                    return response.json({
                        status: 'OK'
                    })

                } else {
                    return response.json({
                        status: 'FAIL',
                        error: 'Senha incorreta'
                    });
                }
            });
        } catch (err) {
            return response.sendStatus(422);
        }
    },

    async getData(request, response) {
        const id = request.data.id;
        try {
            const res = await connection('users')
                .select('name', 'email', 'phone')
                .where('id', id)
                .first();
            return response.json(res);
        } catch (err) {
            return response.status(422).send();
        }
    }
};


