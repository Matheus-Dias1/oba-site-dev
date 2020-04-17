const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const dates = await connection('schedule')
            .select('date')
            .where('id_purchase', null)
            .distinct();

        const schedule = await connection('schedule')
            .select('*')
            .where('id_purchase', null)



        var res = [];
        var times = [];
        for (i in dates) {
            times = [];
            for (j in schedule){
                if(dates[i].date === schedule[j].date)
                    times.push(schedule[j].time);
            }
            res.push({
                date: dates[i].date,
                times: times
            })
        }


        return response.json(res);
    }
};