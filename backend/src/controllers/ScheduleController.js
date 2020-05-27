const connection = require('../database/connection');


module.exports = {
    async index(request, response) {
        const { city } = request.query;
        try {
            const dates = await connection('schedule')
                .select('*')
                .whereRaw("(morning_deliveries > 0 or afternoon_deliveries > 0 or night_deliveries > 0)")
                .where('city', city)
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
                    cDate = new Date(dates[i].date);
                    if (dates[i].night_deliveries > 0) {
                        if (now.valueOf() < cDate.setHours(14, 0, 0, 0).valueOf()) {
                            res.push({
                                date: dates[i].date,
                                period: 'night'
                            })
                        }
                    }
                }
            }
            return response.json(res);
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON SCHEDULE INDEXING: ', err)
            return response.sendStatus(422);
        }
    },
    async create(request, response) {
        const admin = request.data.admin;
        if (admin !== 1) return response.sendStatus(403);
        const {
            date,
            afternoon_deliveries,
            morning_deliveries,
            night_deliveries,
            city
        } = request.body;

        try {
            await connection('schedule')
                .where({
                    morning_deliveries: 0,
                    afternoon_deliveries: 0,
                    night_deliveries: 0,
                })
                .orWhere('date', '<', (new Date().setHours(0, 0, 0, 0)))
                .delete();
        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON SCHEDULE CREATE DELETE OLD DATES: ', err)
        }
        var curSche;
        try {
            curSche = await connection('schedule')
                .select('*')
                .where({
                    date,
                    city
                })
                .first();

        } catch (err) {
            console.log('\nUNEXPECTED ERROR ON SCHEDULE CREATE GET CURSHE: ', err)
            return response.sendStatus(422);
        }
        if (curSche == null) {
            try {
                await connection('schedule')
                    .insert({
                        date,
                        afternoon_deliveries,
                        morning_deliveries,
                        night_deliveries,
                        city
                    })
                return response.sendStatus(201);
            } catch (err) {
                console.log('\nUNEXPECTED ERROR ON SCHEDULE CREATE CURSHE=null: ', err)
                return response.sendStatus(422);
            }
        } else {
            try {
                await connection('schedule')
                    .update({
                        afternoon_deliveries: afternoon_deliveries + curSche.afternoon_deliveries,
                        morning_deliveries: morning_deliveries + curSche.morning_deliveries,
                        night_deliveries: night_deliveries + curSche.night_deliveries,
                    })
                    .where({
                        date,
                        city
                    });
                return response.sendStatus(200);
            } catch (err) {
                console.log('\nUNEXPECTED ERROR ON SCHEDULE CREATE CURSHE!=null: ', err)
                return response.sendStatus(422);
            }
        }
    }
};