const https = require('https');
const axios = require('axios');
const API_ROOT = process.env.REACT_APP_API_ROOT;
const { isEmpty } = require('lodash');

const getAxiosInstance = function(token) {
  let axiosInstance;
  return function(token) {
    if (token && axiosInstance === undefined) {
      axiosInstance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        baseURL: API_ROOT,
        timeout: 10000,
        headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'WebdriverIO',
        },
      });
    } else if (!token && axiosInstance === undefined) {
       throw new Error("getting axiosInstance without having initialized it");
    }
    return axiosInstance;
  }
}()

exports.createLinode = (token, password, linodeLabel, tags, type, region, group, privateIp) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const linodesEndpoint = '/linode/instances';

            const linodeConfig = {
                backups_enabled: false,
                booted: true,
                image: 'linode/debian9',
                region: !region ? 'us-east' : region,
                root_pass: password,
                type: !type ? 'g6-nanode-1' : type
            }

            if (linodeLabel !== false) {
                linodeConfig['label'] = linodeLabel;
            }

            if (!isEmpty(tags)) {
                linodeConfig['tags'] = tags;
            }

            if(group) {
                linodeConfig['group'] = group;
            }

            if (privateIp) {
                linodeConfig['private_ip'] = true;
            }

            return getAxiosInstance(token).post(linodesEndpoint, linodeConfig)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.getAPiData = (token, endpoint) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            return getAxiosInstance(token).get(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.deleteApiData = (token, endpoint, id) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            return getAxiosInstance(token).delete(`${endpoint}/${id}`)
                .then(response => resolve(response))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.createVolume = (token,label,region,size,tags,linode_id) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const volumesEndpoint = '/volumes';

            const volumesConfig = {
                size: size ? size : 20,
                region: region ? region : 'us-east',
                label: label
            }

            if(tags){
                volumesConfig['tags'] = tags;
            }

            if(linode_id){
                volumesConfig['linode_id'] = linode_id;
            }

            return getAxiosInstance(token).post(volumesEndpoint, volumesConfig)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.allocatePrivateIp = (token, linodeId) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const ipsEndpoint = `/linode/instances/${linodeId}/ips`;
            const requestPrivate = {
                public: false,
                type: 'ipv4',
            }

            return getAxiosInstance(token).post(ipsEndpoint, requestPrivate)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.getNodebalancers = token => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/nodebalancers';

            return getAxiosInstance(token).get(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.removeNodebalancer = (token, nodeBalancerId) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = `/nodebalancers/${nodeBalancerId}`;

            return getAxiosInstance(token).delete(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.removeAllVolumes = token => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/volumes';

            const removeVolume = (res, endpoint) => {
                return getAxiosInstance(token).delete(`${endpoint}/${res.id}`)
                    .then(response => response.status)
                    .catch(error => {
                        reject(`Removing Volume ${res.id} failed due to ${JSON.stringify(error.response.data)}`);
                    });
            }

            return getAxiosInstance(token).get(endpoint).then(res => {
                const removeVolumesArray =
                    res.data.data.map(v => removeVolume(v, endpoint));

                Promise.all(removeVolumesArray).then(function(res) {
                    resolve(res);
                }).catch(error => {
                    console.log(error.data);
                    return error;
                });
            });
        });
    });
}

exports.createDomain = (token,type,domain,tags,group) => {
  return browser.call(function() {
      return new Promise((resolve, reject) => {
          const endpoint = '/domains';
          const domainConfig = {
              type: type ? type : 'master',
              domain: domain,
              soa_email: 'fake@gmail.com'
          }

          if(group){
              domainConfig['group'] = group;
          }

          if(tags){
              domainConfig['tags'] = tags;
          }

          return getAxiosInstance(token).post(endpoint,domainConfig)
              .then(response => resolve(response.data))
              .catch(error => {
                  console.error('Error', error);
                  reject(error);
              });
      });
  });
}

exports.getDomains = token => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/domains';

            return getAxiosInstance(token).get(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.removeDomain = (token, domainId) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = `/domains/${domainId}`;

            getAxiosInstance(token).delete(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    });
}

exports.getMyStackScripts = (token,user) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/linode/stackscripts';
            const username = user ? user : browser.options.testUser;
            getAxiosInstance(token).get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Filter': `{"username":"${username}","+order_by":"deployments_total","+order":"desc"}`,
                    'User-Agent': 'WebdriverIO',
                }
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error', error);
                reject(error);
            });
        });
    });
}

exports.removeStackScript = (token, id) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = `/linode/stackscripts/${id}`;
            getAxiosInstance(token).delete(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}


exports.getPrivateImages = token => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/images';

            return getAxiosInstance(token).get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Filter': '{"is_public":false}',
                    'User-Agent': 'WebdriverIO',
                }
            })
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error', error);
                reject(error);
            });
        });
    });
}

exports.removeImage = (token, id) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = `/images/${id}`;

            return getAxiosInstance(token).delete(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.getPublicKeys = token => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/profile/sshkeys';

            return getAxiosInstance(token)
                .get(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error("Error", error);
                    reject(error);
                });
        });
    });
}

exports.removePublicKey = (token, id) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = `/profile/sshkeys/${id}`;

            return getAxiosInstance(token)
                .delete(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}


exports.getUsers = (token) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/account/users';

            return getAxiosInstance(token)
                .get(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}


exports.deleteUser = (token, username) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = `/account/users/${username}`;

            return getAxiosInstance(token)
                .delete(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error', error);
                    reject(error);
                });
        });
    });
}

exports.getUserProfile = (token) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/profile';

            return getAxiosInstance(token)
            .get(endpoint)
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error', error);
                reject(error);
            });
        });
    });
}

exports.updateUserProfile = (token, profileData) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/profile';

            return getAxiosInstance(token)
                .put(endpoint,profileData)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error("Error", error);
                    reject(error);
                });
        });
    });
}

exports.putGlobalSetting = (token, settingsData) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/account/settings';

            return getAxiosInstance(token)
                .put(endpoint,settingsData)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error("Error", error);
                    reject(error);
                });
        });
    });
}

exports.getGlobalSettings = (token) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = '/account/settings';

            return getAxiosInstance(token)
                .get(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error("Error", error);
                    reject(error);
                });
        });
    });
}

exports.getLinodeImage = (token, imageId) => {
    return browser.call(function() {
        return new Promise((resolve, reject) => {
            const endpoint = `/images/linode/${imageId}`;

            return getAxiosInstance(token)
                .get(endpoint)
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error("Error", error);
                    reject(error);
                });
        });
    });
}
