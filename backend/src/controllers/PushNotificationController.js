const connection = require('../database/connection');
const axios = require('axios');


module.exports = {
    async updateExpoToken(request, response) {
        const id = request.data.id;
        const { token } = request.body;

        try {
            await connection('users')
                .update('push_token', token)
                .where('id', id);
            return response.sendStatus(200);
        } catch (err) {
            return response.sendStatus(422);
        }
    },

    async sendPush(request, response) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const admin = request.data.admin;
        if (!admin) return response.sendStatus(403);
        const {
            sendTo,
            title,
            body
        } = request.body;

        let errors = []
        try {
            const res = sendTo === 'all'
                ? await connection('users')
                    .select('push_token')
                    .whereNot('push_token', '')
                : await connection('users')
                    .select('push_token')
                    .whereNot('push_token', '')
                    .whereIn('id', sendTo);

            let rescpy = res;
            let groupedTokens = []
            let tempList = []
            let tempList2 = []
            while (rescpy.length) {
                tempList2 = []
                tempList = rescpy.splice(0, 100);
                for (i in tempList) {
                    tempList2.push(tempList[i].push_token)
                }
                groupedTokens.push(tempList2);
            }
            let ticketsList = {
                data: [],
            };
            let push_tickets = [];
            for (i in groupedTokens) {
                push_tickets = await axios.post('https://exp.host/--/api/v2/push/send', {
                    to: groupedTokens[i],
                    title,
                    body,
                    sound: 'default'
                })
                if (push_tickets.data.data != null) {
                    try {
                        ticketsList.data = [...ticketsList.data, ...push_tickets.data.data];
                    } catch (err) {
                        ticketsList.data.push(push_tickets.data.data);
                    }

                }

            }

            let idsList = []
            let notRegisteredList = []
            for (i in ticketsList.data) {
                if (ticketsList.data[i].status === 'ok')
                    idsList.push(ticketsList.data[i].id)
                if (ticketsList.data[i].status === 'error')
                    if (ticketsList.data[i].details.error === 'DeviceNotRegistered')
                        notRegisteredList.push(ticketsList.data[i].message.split('\"')[1])

            }


            let idsLists = []
            while (idsList.length) {
                idsLists.push(idsList.splice(0, 1000))
            }

            await sleep(15000);

            let errorList = [];

            for (i in idsLists) {
                const res = await axios.post('https://exp.host/--/api/v2/push/getReceipts', {
                    ids: idsLists[i]
                })

                for (j in idsLists[i]) {
                    if (res.data.data[idsLists[i][j]] == null) {
                        errorList.push(idsLists[i][j] + ' not checked')
                    } else {
                        if (res.data.data[idsLists[i][j]].status === 'error') {
                            if (res.data.data[idsLists[i][j]].details.error === 'DeviceNotRegistered')
                                notRegisteredList.push(res.data.data[idsLists[i][j]].message.split('\"')[1])
                            else {
                                errorList.push(res.data.data[idsLists[i][j]])
                            }

                        }
                    }
                }
            }
            try {
                await connection('users')
                    .update('push_token', '')
                    .whereIn('push_token', notRegisteredList);
            } catch (err) {
                errors.push('OnNotRegisteredDevicesUpdate');
            }
            errors = [...errors, ...errorList]


            return response.json({ errors });
        } catch (err) {
            return response.sendStatus(422);
        }
    },
}