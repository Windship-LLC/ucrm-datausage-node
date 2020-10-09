const fetch = require('node-fetch');
const dayjs = require('dayjs')
const config = require('./config')
const readHeaders = {
    "X-Auth-App-Key": config.apiKeys.read
}

function check_data_usage() {
    var requestOptions = {
        method: 'GET',
        headers: readHeaders,
        redirect: 'follow'
    }

    fetch(`https://${config.unmsDomain}/crm/api/v1.0/clients`, requestOptions)
        .then(response => response.json())
        .then(result => {
            result.forEach(client => {
                var requestOptions = {
                    method: 'GET',
                    headers: readHeaders,
                    redirect: 'follow'
                };

                fetch(`https://${config.unmsDomain}/crm/api/v1.0/clients/services?clientId=${client.id}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        result.forEach(service => {
                            if (config.servicesWithLimits.indexOf(service.name) > -1) {
                                let date = dayjs().startOf('month')
                                // https://unms.windship.net/crm/api/v1.0/clients/services/152/data-usage/2020-10-01T00:00:00+0000
                                let dateString = date.format("YYYY-MM-DDT00:00:00+0000");

                                var requestOptions = {
                                    method: 'GET',
                                    headers: readHeaders,
                                    redirect: 'follow'
                                };

                                fetch(`https://${config.unmsDomain}/crm/api/v1.0/clients/services/${service.id}/data-usage/${dateString}`, requestOptions)
                                    .then(response => response.json())
                                    .then(result => console.log(result))
                                    .catch(error => console.log('error', error));


                            }
                        })
                    })
                    .catch(error => console.log('error', error));
                    //.catch(error => console.log(""));
            })
        })
        .catch(error => console.log('error', error))
        //.catch(error => console.log(""));

}

check_data_usage()