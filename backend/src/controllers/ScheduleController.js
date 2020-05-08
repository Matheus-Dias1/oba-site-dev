const connection = require('../database/connection');


module.exports = {
    async index(request, response) {
        try {
            const dates = await connection('schedule')
                .select('*')
                .whereRaw("morning_deliveries > 0 or afternoon_deliveries > 0")
                .orderByRaw('date(date) asc')
            var res = [];
            var cDate;
            const now = new Date();
            const today = new Date().setHours(0, 0, 0, 0);
            for (i in dates) {
                cDate = new Date(dates[i].date);
                if (dates[i].date >= today) {
                    if (dates[i].morning_deliveries > 0) {
                        if (cDate.getUTCDay() === 1) {
                            if (now.valueOf() < cDate.setHours(-5, 0, 0, 0).valueOf()) {
                                res.push({
                                    date: dates[i].date,
                                    period: 'morning'
                                })
                            }

                        } else if (cDate.getUTCDay() === 6) {
                            if (now.valueOf() < cDate.setHours(10, 30, 0, 0).valueOf()) {
                                res.push({
                                    date: dates[i].date,
                                    period: 'morning'
                                })
                            }
                        } else {
                            if (now.valueOf() < cDate.setHours(-2, 0, 0, 0).valueOf()) {
                                res.push({
                                    date: dates[i].date,
                                    period: 'morning'
                                })
                            }
                        }

                    }
                    cDate = new Date(dates[i].date);
                    if (dates[i].afternoon_deliveries > 0) {
                        if (now.valueOf() < cDate.setHours(13, 0, 0, 0).valueOf()) {
                            res.push({
                                date: dates[i].date,
                                period: 'afternoon'
                            })
                        }
                    }
                }
            }
            return response.json(res);
        } catch (err) {
            return response.status(422).send();
        }
    },
    async create(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.status(401).send();
        const {
            date,
            afternoon_deliveries,
            morning_deliveries,
        } = request.body;

        try {
            await connection('schedule')
                .where({
                    morning_deliveries: 0,
                    afternoon_deliveries: 0
                })
                .orWhere('date', '<', (new Date().setHours(0, 0, 0, 0)))
                .delete();
        } catch (err) {

        }
        var curSche;
        try {
            curSche = await connection('schedule')
                .where('date', date)
                .first();

        } catch (err) {

        }
        if (curSche == null) {
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
        } else {
            try {
                await connection('schedule')
                    .update({
                        afternoon_deliveries: afternoon_deliveries + curSche.afternoon_deliveries,
                        morning_deliveries: morning_deliveries + curSche.morning_deliveries,
                    })
                    .where('date', date);
                return response.status(201).send();
            } catch (err) {
                return response.status(422).send();
            }
        }

    }


};