const moment = require('moment');
const https = require('https');
const axios = require('axios');
const { existsSync, statSync, writeFileSync, readFileSync } = require('fs');
const { constants } = require('../constants');
const {
    getAPiData,
    deleteApiData,
    getMyStackScripts,
} = require('../setup/setup');

/*
* Get localStorage after landing on homepage
* and write them out to a file for use in other tests
* @returns { String } stringified local storage object
*/
exports.storeToken = (credFilePath, username) => {
    let credCollection = JSON.parse(readFileSync(credFilePath));

    const getTokenFromLocalStorage = () => {
        const browserLocalStorage = browser.execute(function() {
            return JSON.stringify(localStorage);
        });
        const parsedLocalStorage = JSON.parse(browserLocalStorage.value);
        return parsedLocalStorage['authentication/oauth-token'];
    }

    let currentUser = credCollection.find( cred => cred.username === username );

    if ( !currentUser.isPresetToken ){
        currentUser.token = getTokenFromLocalStorage();
    }

    writeFileSync(credFilePath, JSON.stringify(credCollection));
}

exports.readToken = (username) => {
    const credCollection = JSON.parse(readFileSync('./e2e/creds.js'));
    const currentUserCreds = credCollection.find(cred => cred.username === username);
    return currentUserCreds['token'];
}

/*
* Navigates to baseUrl, inputs username and password
* And attempts to login
* @param { String } username
* @param { String } password
* @returns {null} returns nothing
*/
exports.login = (username, password, credFilePath) => {
    let letsGoButton;

    browser.url(constants.routes.linodes);
    try {
        $('#username').waitForDisplayed(constants.wait.long, false, 'Username field did not display');
    } catch (err) {
        console.log(browser.getPageSource());

    }

    browser.trySetValue('#username', username);
    browser.trySetValue('#password', password);
    $('.btn#submit').click();

    letsGoButton = browser.getUrl().includes('dev') ? '.btn#submit' : '[data-qa-welcome-button]';


    try {
        browser.waitUntil(function() {
            return $('[data-qa-add-new-menu-button]').isExisting() || browser.getUrl().includes('oauth/authorize');
        }, constants.wait.normal);
    } catch (err) {
        console.log('failed to login!');
        console.log(browser.getPageSource());
        if ($('.alert').getText().includes('This field is required.')) {
            $('#password').setValue(password);
            $(loginButton).click();
        }
    }

    if(process.env.REACT_APP_APP_ROOT.includes('local')){
        if($$('.oauthauthorize-page').length > 0 && browser.getUrl().includes('login')){
          $('.form-actions>.btn').click();
        }
    }

    $('[data-qa-add-new-menu-button]').waitForDisplayed(constants.wait.long, false, 'Create Button did not display');

    if ($('[role="dialog"]').isExisting()) {
        $(letsGoButton).click();
        $('[role="dialog"]').waitForDisplayed(constants.wait.long, true, 'Did not dismiss welcome modal')
    }

    if (credFilePath) {
        exports.storeToken(credFilePath, username);
    }
}

exports.checkoutCreds = (credFilePath, specFile) => {
    let credCollection = JSON.parse(readFileSync(credFilePath));
    return credCollection.find((cred, i) => {
        if (!cred.inUse) {
            credCollection[i].inUse = true;
            credCollection[i].spec = specFile;
            browser.options.testUser = credCollection[i].username;
            writeFileSync(credFilePath, JSON.stringify(credCollection));
            return cred;
        }
    });
}

exports.checkInCreds = (credFilePath, specFile) => {
    let credCollection = JSON.parse(readFileSync(credFilePath));
    return credCollection.find((cred, i) => {
        if (cred.spec === specFile) {
            credCollection[i].inUse = false;
            credCollection[i].spec = '';
            // credCollection[i].token = '';
            writeFileSync(credFilePath, JSON.stringify(credCollection));
            return cred;
        }
        return;
    });
}

exports.generateCreds = (credFilePath, config, userCount) => {
    const credCollection = [];

    const setCredCollection = (userKey, userIndex) => {
        const setEnvToken = process.env[`MANAGER_OAUTH${userIndex}`];
        const token = !!setEnvToken ? setEnvToken : '';
        const tokenFlag = !!token
        credCollection.push({username: process.env[`${userKey}${userIndex}`], password: process.env[`MANAGER_PASS${userIndex}`], inUse: false, token: token, spec: '', isPresetToken: tokenFlag});
    }

    setCredCollection('MANAGER_USER', '');
    if ( userCount > 1 ) {
        for( i = 2; i <= userCount; i++ ){
            setCredCollection('MANAGER_USER', `_${i}`);
        }
    }

    writeFileSync(credFilePath, JSON.stringify(credCollection));
}

exports.cleanupAccounts = (credFilePath) => {
    const credCollection = JSON.parse(readFileSync(credFilePath));
    credCollection.forEach(cred => {
        return deleteAll(cred.token).then(() => {});
    });
}

exports.deleteAllData = (token,user) => {
    const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        baseURL: process.env.REACT_APP_API_ROOT,
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
        axiosInstance.get(entityEndpoint).then((response) => {
            console.log(response);
            const data = entityEndpoint.includes('images')
                ? response.data.data.filter( image => image.is_public) : response.data.data;
            console.log(data);
            if(data.length > 0){
                const deleteId = entityEndpoint.includes('users') ? entityInstance.username : entityInstance.id;
                response.data.data.forEach((entityInstance) => {
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
        console.log(response);
        if(response.data.data.length > 0){
            response.data.data.forEach((myStackScript) => {
                axiosInstance.delete(`${stackScriptEndPoint}/${myStackScript.id}`).then(res => console.log(res));
            })
        }
    });

    return;
}
