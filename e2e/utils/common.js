const crypto = require('crypto');
const { argv } = require('yargs');
const { constants } = require('../constants');
const { readToken } = require('./config-utils');
const {
    getPrivateImages,
    removeImage,
    getPublicKeys,
    removePublicKey,
    updateUserProfile,
    getUserProfile,
    createLinode,
    getAPiData,
    deleteApiData,
    createVolume,
    getGlobalSettings,
    putGlobalSetting,
    getLinodeImage,
    createDomain,
    getMyStackScripts,
} = require('../setup/setup');

import ConfigureLinode from '../pageobjects/configure-linode';
import ListLinodes from '../pageobjects/list-linodes';
import Create from '../pageobjects/create';
import Settings from '../pageobjects/linode-detail/linode-detail-settings.page';
import LinodeDetail from '../pageobjects/linode-detail/linode-detail.page';
import NodeBalancers from '../pageobjects/nodebalancers.page';
import NodeBalancerDetail from '../pageobjects/nodebalancer-detail/details.page';

export const generatePassword = () => {
    return crypto.randomBytes(20).toString('hex');
}

export const timestamp = () => {
    if (argv.record || argv.replay) {
        global.timeCount++
        return `Unique${timeCount}`;
    }
    return `A${new Date().getTime()}`;
}

export const createGenericLinode = (label) => {
    Create.menuButton.click();
    Create.linode();
    ConfigureLinode.baseDisplay();
    ConfigureLinode.generic(label);
    ConfigureLinode.deploy.click();
    waitForLinodeStatus(label, 'running');
}

export const deleteLinode = (label) => {
    browser.url(constants.routes.linodes);
    browser.waitClick(`[data-qa-linode="${label}"] [data-qa-label]`);
    LinodeDetail.landingElemsDisplay();
    LinodeDetail.changeTab('Settings');
    Settings.remove();
}


export const createLinodeIfNone = () => {
    if (!ListLinodes.linodesDisplay()) {
        createGenericLinode(new Date().getTime());
    }
}

export const apiCreateLinode = (linodeLabel=false, privateIp=false, tags=[], type, region, group) => {
    const token = readToken(browser.options.testUser);
    const newLinodePass = crypto.randomBytes(20).toString('hex');
    const linode = createLinode(token, newLinodePass, linodeLabel, tags, type, region, group, privateIp);

    browser.url(constants.routes.linodes);
    $('[data-qa-add-new-menu-button]').waitForDisplayed(constants.wait.normal);
    waitForLinodeStatus(linodeLabel ? linodeLabel : linode.label, 'running');

    return linode;
}
 export const apiCreateMultipleLinodes = (arrayOfLinodeCreateObj) => {
    let linodes = [];
    const token = readToken(browser.options.testUser);

    arrayOfLinodeCreateObj.forEach((linodeObj) => {
        const newLinodePass = crypto.randomBytes(20).toString('hex');
        const linode = createLinode(token, newLinodePass, linodeObj.linodeLabel, linodeObj.tags, linodeObj.type, linodeObj.region, linodeObj.group, linodeObj.private_ip)
        linodes.push(linode);
    });

    browser.url(constants.routes.linodes);
    $('[data-qa-add-new-menu-button]').waitForDisplayed(constants.wait.normal);

    arrayOfLinodeCreateObj.forEach((linodeObj,i) => {
        waitForLinodeStatus(linodeObj.linodeLabel, 'running');
    });

    return linodes;
}

export const waitForLinodeStatus = (linodeLabel, status, timeout=constants.wait.minute) => {
    $(`[data-qa-linode="${linodeLabel}"]`).waitForDisplayed(timeout);
    $(`[data-qa-linode="${linodeLabel}"] [data-qa-status="${status}"]`).waitForDisplayed(timeout * 3);
}

export const apiDeleteAllLinodes = () => {
    deleteAll('/linode/instances');
}


export const apiDeleteAllVolumes = () => {
    deleteAll('/volumes');
}

export const apiDeleteAllDomains = () => {
    deleteAll('/domains');
}

export const apiDeleteMyStackScripts = () => {
    const token = readToken(browser.options.testUser);
    const createdStackScripts = getMyStackScripts(token).data;
    createdStackScripts.forEach((stackScript) => {
        deleteApiData(token,'/linode/stackscripts',stackScript.id);
    })
}

export const createNodeBalancer = () => {
    const linode = {
        linodeLabel: `AutoLinode${timestamp()}`,
        private_ip: true
    }
    apiCreateMultipleLinodes([linode]);
    browser.url(constants.routes.nodeBalancers);
    NodeBalancers.baseElemsDisplay(true);
    NodeBalancers.create();
    NodeBalancers.configure(linode.linodeLabel.toLowerCase());
    NodeBalancers.baseElemsDisplay();
}

export const apiDeleteAllNodeBalancers = () => {
    deleteAll('/nodebalancers');
}

export const apiDeletePrivateImages = token => {
    getPrivateImages(token).then((privateImages) => {
        privateImages.data.forEach(i => removeImage(token, i.id));
    });
}

export const apiRemoveSshKeys = () => {
    const token = readToken(browser.options.testUser);
    const userKeys = getPublicKeys(token).data;
    userKeys.forEach(key => removePublicKey(token, key.id));
}

export const getProfile = () => {
    const token = readToken(browser.options.testUser);
    const profile = getUserProfile(token);
    return profile;
}

export const updateProfile = (profileDate) => {
    const token = readToken(browser.options.testUser);
    const profile = updateUserProfile(token,profileDate);
    return profile;
}

export const updateGlobalSettings = (settingsData) => {
    const token = readToken(browser.options.testUser);
    const settings = putGlobalSetting(token,settingsData);
    return settings;
}

export const retrieveGlobalSettings = () => {
    const token = readToken(browser.options.testUser);
    const settings = getGlobalSettings(token);
    return settings;
}

export const checkEnvironment = () => {
    const environment = process.env.REACT_APP_API_ROOT;
    if (environment.includes('dev') || environment.includes('testing')) {
        pending('Feature not available in Testing or Dev environmnet');
    }
}

export const createVolumes = (volumeObjArray) => {
    let volumes = [];
    const token = readToken(browser.options.testUser);

    volumeObjArray.forEach((volumeObj) => {
        const volume = createVolume(token,volumeObj.label,volumeObj.region,volumeObj.size,volumeObj.tags,volumeObj.linode_id);
        volume.push(volume);
    });

    browser.url(constants.routes.volumes);
    $('[data-qa-add-new-menu-button]').waitForDisplayed(constants.wait.normal);

    volumeObjArray.forEach((volumeObj) => {
        $(`[data-qa-volume-cell-label="${volumeObj.label}"]`).waitForDisplayed(constants.wait.long);
    });
    $('[data-qa-toast]').waitForVisible(constants.wait.minute);
    $('[data-qa-toast]').waitForVisible(constants.wait.long, true);
    return volumes;
}

export const switchTab = () => {
    browser.waitUntil(() => {
        return browser.getWindowHandles().length === 2;
    }, constants.wait.normal);
    browser.pause(2000);
    const tabs = browser.getWindowHandles();
    const manager = tabs[0];
    const newTab = tabs[1];
    browser.switchToWindow(newTab);
}

export const managerTab = () => {
    browser.switchToWindow(browser.getWindowHandles()[0]);
}

export const getDistrobutionLabel = (distrobutionTags) => {
    const token = readToken(browser.options.testUser);
    let distrobutionLabel = [];
    distrobutionTags.forEach((distro) => {
        const distroDetails = getLinodeImage(token,distro.trim());
        distrobutionLabel.push(distroDetails.label);
    });
    return distrobutionLabel;
}

export const getLocalStorageValue = (key) => {
    return browser.getLocalStorageItem(key).value;
}

export const apiCreateDomains = (domainObjArray) => {
    const token = readToken(browser.options.testUser);
    let domains = []
    domainObjArray.forEach((domain) => {
        const newDomain = createDomain(token, domain.type,domain.domain,domain.tags,domain.group);
        domains.push(newDomain);
    });
    browser.url(constants.routes.domains);
    domainObjArray.forEach((domain) => $(`[data-qa-domain-cell="${domain.domain}"]`).waitForDisplayed(constants.wait.long));
    return domains;
}

export const parseLinodeIdFromUrl = () => {
    const firstParse = browser.getUrl().split('/linodes/');
    return firstParse[1].split('/')[0]
}

const deleteAll = (endpoint) => {
  const token = readToken(browser.options.testUser);
  const entities = getAPiData(token, endpoint).data;
  entities.forEach((entity) => {
      deleteApiData(token,endpoint,entity.id);
  });
}
