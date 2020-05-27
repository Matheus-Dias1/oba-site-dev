const connection = require('../database/connection');

module.exports = {
    async create(request, response) {

        function haversineDistance(coords) {
            const lat1 = -18.903228;
            const lon1 = -48.285291;
            const lat2 = coords[0];
            const lon2 = coords[1];
            const R = 6371e3;
            const φ1 = lat1 * Math.PI / 180;
            const φ2 = lat2 * Math.PI / 180;
            const Δφ = (lat2 - lat1) * Math.PI / 180;
            const Δλ = (lon2 - lon1) * Math.PI / 180;

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const d = R * c;
            return d / 1000;
        }

        const {
            country,
            state,
            city,
            neighborhood,
            street,
            number,
            complement,
            lat,
            lng,
        } = request.body;

        const distance = haversineDistance([lat, lng]);
        const delivery_fee =
            city.toLowerCase() === 'araguari' ? 9
                : (distance <= 1 ? 5 : parseFloat(((distance - 1) + 5).toFixed(2)))

        const id_user = request.data.id;
        try {
            await connection('addresses').insert({
                country,
                state,
                city,
                neighborhood,
                street,
                number,
                complement,
                id_user,
                lat,
                lng,
                delivery_fee,
            });
            return response.sendStatus(201);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON CREATE ADDRESS: ', err)
            return response.sendStatus(422);
        }

    },

    async index(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);

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
            console.log('\nUNEXPECTED ERROR ON INDEX ADDRESSES: ', err)
            return response.sendStatus(422);
        }

    },

};