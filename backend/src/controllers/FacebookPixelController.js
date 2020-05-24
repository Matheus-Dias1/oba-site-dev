'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');

module.exports = {
    async CompleteRegistration(request, response) {
    const {
            platform,
            name,
            phone,
            email
        } = request.body;
        try {
            const ServerEvent = bizSdk.ServerEvent;
            const EventRequest = bizSdk.EventRequest;
            const UserData = bizSdk.UserData;
            const CustomData = bizSdk.CustomData;

            const access_token = process.env.FB_ACCESS_TOKEN;
            const pixel_id = process.env.PIXEL_ID;

            let current_timestamp = Math.floor(new Date() / 1000);


            //PARSE NAME
            let sendLastName = null;
            const nameList = name.split(' ');
            const sendFirstName = name[0].toLowerCase();
            if (nameList > 1)
                sendLastName = name[nameList.length - 1].toLowerCase();

            //PARSE EMAIL
            const sendEmail = email.toLowerCase()

            //PARSE PHONE
            const sendPhone = '55' + phone.replace(/\D/g, '')

            const userData = (new UserData())
                .setEmail(sendEmail)
                .setFirstName(sendFirstName)
                .setPhone(sendPhone)
                .setClientIpAddress(request.ip)

            if (sendLastName)
                userData.setLastName(sendLastName)

            const customData = (new CustomData())
                .add_custom_property('platform', platform.toLowerCase())

            const serverEvent = (new ServerEvent())
                .setEventName('CompleteRegistration')
                .setEventTime(current_timestamp)
                .setUserData(userData)
                .setCustomData(customData);

            const eventsData = [serverEvent];
            const eventRequest = (new EventRequest(access_token, pixel_id))
                .setEvents(eventsData)
                .setTestEventCode('TEST66833')

            const res = await eventRequest.execute();
            console.log(res)

        } catch (err) {

            //LOGAR OS ERROS DE ALGUM JEITO
            console.log(err) // LOGAR LOGAR LOGAR
        }
        return response.sendStatus(200);

    }, async InitiateCheckout(request, response) {
        const {
            email,
            name,
            numItems
        } = request.body
        try {
            const ServerEvent = bizSdk.ServerEvent;
            const UserData = bizSdk.UserData;
            const CustomData = bizSdk.CustomData;
            const EventRequest = bizSdk.EventRequest;

            const access_token = process.env.FB_ACCESS_TOKEN;
            const pixel_id = process.env.PIXEL_ID;

            let current_timestamp = Math.floor(new Date() / 1000);

            //PARSE NAME
            let sendLastName = null;
            const nameList = name.split(' ');
            const sendFirstName = name[0].toLowerCase();
            if (nameList > 1)
                sendLastName = name[nameList.length - 1].toLowerCase();

            //PARSE EMAIL
            const sendEmail = email.toLowerCase()

            const userData = (new UserData())
                .setEmail(sendEmail)
                .setClientIpAddress(request.ip)
                .setFirstName(sendFirstName)

            if (sendLastName)
                userData.setLastName(sendLastName)

            const customData = (new CustomData())
                .setNumItems(numItems)

            const serverEvent = (new ServerEvent())
                .setEventName('InitiateCheckout')
                .setEventTime(current_timestamp)
                .setUserData(userData)
                .setCustomData(customData)

            const eventsData = [serverEvent];
            const eventRequest = (new EventRequest(access_token, pixel_id))
                .setEvents(eventsData)
                .setTestEventCode('TEST66833')

            const res = await eventRequest.execute();
            console.log(res)
            return response.sendStatus(200);

        } catch (err) {
            console.log(err)
            return response.sendStatus(422);
        }
    },
    async Contact(request, response) {
        const {
            method,
            email,
            name
        } = request.body;
        try {
            const ServerEvent = bizSdk.ServerEvent;
            const EventRequest = bizSdk.EventRequest;
            const UserData = bizSdk.UserData;
            const CustomData = bizSdk.CustomData;

            const access_token = process.env.FB_ACCESS_TOKEN;
            const pixel_id = process.env.PIXEL_ID;

            let current_timestamp = Math.floor(new Date() / 1000);

            //PARSE NAME
            let sendLastName = null;
            const nameList = name.split(' ');
            const sendFirstName = name[0].toLowerCase();
            if (nameList > 1)
                sendLastName = name[nameList.length - 1].toLowerCase();

            //PARSE EMAIL
            const sendEmail = email.toLowerCase()

            const userData = (new UserData())
                .setEmail(sendEmail)
                .setFirstName(sendFirstName)
                .setClientIpAddress(request.ip)

            if (sendLastName)
                userData.setLastName(sendLastName)

            const customData = (new CustomData())
                .add_custom_property('method', method.toLowerCase())

            const serverEvent = (new ServerEvent())
                .setEventName('Contact')
                .setEventTime(current_timestamp)
                .setUserData(userData)
                .setCustomData(customData);

            const eventsData = [serverEvent];
            const eventRequest = (new EventRequest(access_token, pixel_id))
                .setEvents(eventsData)
                .setTestEventCode('TEST66833')

            const res = await eventRequest.execute();
            console.log(res)
            return response.sendStatus(200);

        } catch (err) {
            console.log(err)
            return response.sendStatus(422);
        }
    },
    async FinalizeCheckout(request, response) {
        const {
            email,
            name,
            value,
            address,
            items,
            orderID
        } = request.body;
        try {
            const ServerEvent = bizSdk.ServerEvent;
            const EventRequest = bizSdk.EventRequest;
            const UserData = bizSdk.UserData;
            const CustomData = bizSdk.CustomData;
            const Content = bizSdk.Content;

            const access_token = process.env.FB_ACCESS_TOKEN;
            const pixel_id = process.env.PIXEL_ID;

            let current_timestamp = Math.floor(new Date() / 1000);

            //PARSE NAME
            let sendLastName = null;
            const nameList = name.split(' ');
            const sendFirstName = name[0].toLowerCase();
            if (nameList > 1)
                sendLastName = name[nameList.length - 1].toLowerCase();

            //PARSE EMAIL
            const sendEmail = email.toLowerCase()

            //PARSE ADDRESS
            const sendState = address.state.toLowerCase()
            const sendCity = address.city.toLowerCase()

            //CREATING CONTENTS
            let contentsList = []
            let newContent;
            for (let i in items) {
                newContent = (new Content())
                    .setId(items[i].id)
                    .setQuantity(items[i].quantity)
                contentsList.push(newContent)
            }

            const userData = (new UserData())
                .setEmail(sendEmail)
                .setFirstName(sendFirstName)
                .setClientIpAddress(request.ip)
                .setCity(sendCity)
                .setState(sendState)

            if (sendLastName)
                userData.setLastName(sendLastName)

            console.log(contentsList)
            const customData = (new CustomData())
                .setContentType('product')
                .setOrderId(orderID)
                .setCurrency('brl')
                .setValue(value)
                .setContents(contentsList)

            const serverEvent = (new ServerEvent())
                .setEventName('Purchase')
                .setEventTime(current_timestamp)
                .setUserData(userData)
                .setCustomData(customData);

            const eventsData = [serverEvent];
            const eventRequest = (new EventRequest(access_token, pixel_id))
                .setEvents(eventsData)
                .setTestEventCode('TEST66833')

            const res = await eventRequest.execute();
            console.log(res)
            return response.sendStatus(200);

        } catch (err) {
            console.log(err)
            return response.sendStatus(422);
        }
    },

}