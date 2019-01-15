const https = require('https');
const axios = require('axios');
const { readFileSync } = require('fs');

const deleteAllData = (token,user) => {
    const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        baseURL: 'https://api.linode.com/v4',
        timeout: 10000,
        headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'WebdriverIO',
        },
    });

    const endpoints = [
        '/linode/instances',
        '/volumes',
        '/domains',
        '/nodebalancers',
        '/account/users',
        '/images',
    ];

    endpoints.forEach((entityEndpoint) => {
        console.log(entityEndpoint);
        axiosInstance.get(entityEndpoint).then((response) => {
            const data = entityEndpoint.includes('images')
                ? response.data.data.filter( image => !image.is_public) : response.data.data;
            if(data.length > 0){
                data.forEach((entityInstance) => {
                    const deleteId = entityEndpoint.includes('users') ? entityInstance.username : entityInstance.id;
                    axiosInstance.delete(`${entityEndpoint}/${deleteId}`).then(res => console.log(res));
                });
            }
        });
    });

    const stackScriptEndPoint = '/linode/stackscripts';
    axiosInstance.get(stackScriptEndPoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Filter': `{"username":"${user}","+order_by":"deployments_total","+order":"desc"}`,
        'User-Agent': 'WebdriverIO',
      }
    }).then((response) => {
        if(response.data.data.length > 0){
            response.data.data.forEach((myStackScript) => {
                axiosInstance.delete(`${stackScriptEndPoint}/${myStackScript.id}`).then(res => console.log(res));
            })
        }
    });
}

JSON.parse(readFileSync('./e2e/creds.js')).forEach(cred => {
    deleteAllData(cred.token,cred.username);
});
