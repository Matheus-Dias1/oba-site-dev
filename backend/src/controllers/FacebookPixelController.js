'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');

module.exports = {
    async FBPixelTest(request, response) {
        try{
            const ServerEvent = bizSdk.ServerEvent;
        const EventRequest = bizSdk.EventRequest;
        const UserData = bizSdk.UserData;
        const CustomData = bizSdk.CustomData;
        const Content = bizSdk.Content;

        const access_token = process.env.FB_ACCESS_TOKEN;
        const pixel_id = process.env.PIXEL_ID;
        const api = bizSdk.FacebookAdsApi.init(access_token);

        let current_timestamp = Math.floor(new Date() / 1000);

        
        const userData = (new UserData())
            .setEmail('teste@teste.com'.toLowerCase())
            .setCity('Uberlândia'.toLowerCase())
            .setState('MG'.toLowerCase())
            .setCountry('br'.toLowerCase())
            .setLastName('Dias'.toLowerCase())
            .setFirstName('Matheus'.toLowerCase())
            .setPhone('55' + '34984207764')
            .setClientIpAddress(request.ip)

        const customData = (new CustomData())
            .setCurrency('brl')
            .setValue(123.45);

        const serverEvent = (new ServerEvent())
            .setEventName('Purchase')
            .setEventTime(current_timestamp)
            .setUserData(userData)
            .setCustomData(customData);

        const eventsData = [serverEvent];
        const eventRequest = (new EventRequest(access_token, pixel_id))
            .setEvents(eventsData)
            .setTestEventCode('TEST21943')

        const res = await eventRequest.execute();
        console.log(res)
        return response.sendStatus(200);
        
        }catch(err){
            console.log(err)
            return response.sendStatus(422);
        }
    }
}