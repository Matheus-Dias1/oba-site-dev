const axios = require('axios');
require('dotenv').config();

module.exports = {
    async getAddress(req, res) {
        const coords = JSON.parse(req.query.coords);
        const geocode = axios.create({
            baseURL: 'https://maps.googleapis.com/maps/api/geocode/'
        });

        let addressInfo;
        try {
            addressInfo = (await geocode.get(`json?language=pt-BR&latlng=${coords.latitude},${coords.longitude}&key=${process.env.GEOCODE_API_KEY}`))
        } catch (err) {
            //console.log(err)
        }




        var componets_list = [];
        var data = {
            "status": 'OK',
            "result": {
                "country": {
                    "long_name": '',
                    "short_name": '',
                },
                "state": {
                    "long_name": '',
                    "short_name": '',
                },
                "city": {
                    "long_name": '',
                    "short_name": '',
                },
                "neighborhood": {
                    "long_name": '',
                    "short_name": '',
                },
                "street": {
                    "long_name": '',
                    "short_name": '',
                },
                "number": {
                    "long_name": '',
                    "short_name": '',
                },
                "geometry": {
                    "lat": '',
                    "lng": '',
                    "location_type": ''
                }
            }
        }
        if (addressInfo.data.status !== 'OK') {
            if (addressInfo.data.status === 'ZERO_RESULTS') {
                //console.log('zero_results')
                return res.json({
                    "status": 'ZERO_RESULTS',
                    "result": {}
                });
            } else {
                //console.log('error')

                return res.json({
                    "status": 'ERROR',
                    "result": {}
                });
            }


        }
        for (i in addressInfo.data.results[0].address_components)
            componets_list.push(addressInfo.data.results[0].address_components[i])
        for (i in componets_list) {
            try {
                if (componets_list[i].types.includes('street_number')) {
                    data.result.number.short_name = componets_list[i].short_name;
                    data.result.number.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('route')) {
                    data.result.street.short_name = componets_list[i].short_name;
                    data.result.street.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('sublocality_level_1')) {
                    data.result.neighborhood.short_name = componets_list[i].short_name;
                    data.result.neighborhood.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('administrative_area_level_2')) {
                    data.result.city.short_name = componets_list[i].short_name;
                    data.result.city.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('administrative_area_level_1')) {
                    data.result.state.short_name = componets_list[i].short_name;
                    data.result.state.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('country')) {
                    data.result.country.short_name = componets_list[i].short_name;
                    data.result.country.long_name = componets_list[i].long_name;
                }
            } catch (err) {
                //console.log(err)
            }
        }
        try {
            data.result.geometry.lat = addressInfo.data.results[0].geometry.location.lat;
            data.result.geometry.lng = addressInfo.data.results[0].geometry.location.lng;
            data.result.geometry.location_type = addressInfo.data.results[0].geometry.location_type;
        } catch (err) {

        }
        //console.log(data)
        return res.json(data);
    },
    async getCoordinates(req, res) {
        const {
            state,
            city,
            neighborhood,
            street,
            number,
        } = req.query;

        const geocode = axios.create({
            baseURL: 'https://maps.googleapis.com/maps/api/geocode/'
        });

        const str = (
            `json?` +
            `language=pt-BR` +
            `&address=${street.replace(' ', '%20')}` +
            `,${number}` +
            `%20${neighborhood.replace(' ', '%20')}` +
            `%20${city}` +
            `%20${state}` +
            `&key=${process.env.GEOCODE_API_KEY}`
        );
        const parsed = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let addressInfo;
        try {
            addressInfo = await geocode.get(parsed)
        } catch (err) {

        }

        var componets_list = [];
        var data = {
            "status": 'OK',
            "result": {
                "country": {
                    "long_name": '',
                    "short_name": '',
                },
                "state": {
                    "long_name": '',
                    "short_name": '',
                },
                "city": {
                    "long_name": '',
                    "short_name": '',
                },
                "neighborhood": {
                    "long_name": '',
                    "short_name": '',
                },
                "street": {
                    "long_name": '',
                    "short_name": '',
                },
                "number": {
                    "long_name": '',
                    "short_name": '',
                },
                "geometry": {
                    "lat": '',
                    "lng": '',
                    "location_type": ''
                }
            }
        }
        if (addressInfo.data.status !== 'OK') {
            if (addressInfo.data.status === 'ZERO_RESULTS') {
                return res.json({
                    "status": 'ZERO_RESULTS',
                    "result": {}
                });
            } else {
                return res.json({
                    "status": 'ERROR',
                    "result": {}
                });
            }


        }
        for (i in addressInfo.data.results[0].address_components)
            componets_list.push(addressInfo.data.results[0].address_components[i])
        for (i in componets_list) {
            try {
                if (componets_list[i].types.includes('street_number')) {
                    data.result.number.short_name = componets_list[i].short_name;
                    data.result.number.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('route')) {
                    data.result.street.short_name = componets_list[i].short_name;
                    data.result.street.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('sublocality_level_1')) {
                    data.result.neighborhood.short_name = componets_list[i].short_name;
                    data.result.neighborhood.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('administrative_area_level_2')) {
                    data.result.city.short_name = componets_list[i].short_name;
                    data.result.city.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('administrative_area_level_1')) {
                    data.result.state.short_name = componets_list[i].short_name;
                    data.result.state.long_name = componets_list[i].long_name;
                } else if (componets_list[i].types.includes('country')) {
                    data.result.country.short_name = componets_list[i].short_name;
                    data.result.country.long_name = componets_list[i].long_name;
                }
            } catch (err) {
                //console.log(err)
            }
        }
        try {
            data.result.geometry.lat = addressInfo.data.results[0].geometry.location.lat;
            data.result.geometry.lng = addressInfo.data.results[0].geometry.location.lng;
            data.result.geometry.location_type = addressInfo.data.results[0].geometry.location_type;
        } catch (err) {

        }
        //console.log(data)
        return res.json(data)
    }
};