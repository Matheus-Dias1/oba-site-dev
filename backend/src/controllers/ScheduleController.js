const connection = require('../database/connection');


module.exports = {
    async index(request, response) {
        try {
            const dates = await connection('schedule')
                .select('*')
                .whereRaw("morning_deliveries > 0 or afternoon_deliveries > 0")
                .orderByRaw('date(date) asc')
            var res = [];
            for (i in dates) {
                if (Date.parse(dates[i].date) >= new Date().setHours(0, 0, 0, 0)) {
                    if (dates[i].morning_deliveries > 0) {
                        res.push({
                            date: dates[i].date,
                            period: 'morning'
                        })
                    }
                    if (dates[i].afternoon_deliveries > 0) {
                        res.push({
                            date: dates[i].date,
                            period: 'afternoon'
                        })
                    }
                }
            }
            return response.json(res);
        } catch (err) {
            console.log(err)
            return response.status(422).send();
        }
    },
    async create(request, response) {
        const admin = request.data.admin;
        if (admin!==1) return response.status(401).send();
        const {
            date,
            afternoon_deliveries,
            morning_deliveries,
        } = request.body;


        try {
            await connection('schedule')
                .insert({
                    date,
                    afternoon_deliveries,
                    morning_deliveries,
                })
            return response.status(201).send();
        } catch (err) {
            return response.status(422).send();
        }
    }


};