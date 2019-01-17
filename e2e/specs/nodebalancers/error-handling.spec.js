const { constants } = require('../../constants');
const { merge } = require('ramda');

import NodeBalancers from '../../pageobjects/nodebalancers.page';
import {
    apiCreateMultipleLinodes,
    removeNodeBalancers,
    apiDeleteAllLinodes,
    timestamp,
} from '../../utils/common';

describe('NodeBalancer - Negative Tests Suite', () => {
    const linode = {
        linodeLabel: `${timestamp()}`,
        private_ip: true
    }

    beforeAll(() => {
        apiCreateMultipleLinodes([linode]);
        browser.url(constants.routes.nodeBalancers);
        NodeBalancers.baseElemsDisplay(true);
        NodeBalancers.create();
    });

    afterAll(() => {
        apiDeleteAllLinodes();
        removeNodeBalancers();
    });

    it('should display a service error msg on create with an invalid node name', () => {
        const serviceError = `Label can't contain special characters, uppercase characters, or whitespace.`;

        NodeBalancers.configure('& A');

        $('[data-qa-backend-ip-label] p').waitForDisplayed();
        const errorMsg = $('[data-qa-backend-ip-label] p').getText();
        expect(errorMsg).toBe(serviceError);
    });

    it('should fail to create a configuration with an invalid. ip', () => {
        const serviceError = 'This address is not allowed.';

        NodeBalancers.configure('invalidip', '192.168.1.1');

        $('[data-qa-backend-ip-address] p').waitForDisplayed();
        const errorMsg = $('[data-qa-backend-ip-address] p').getText();
        expect(errorMsg).toBe(serviceError);
    });
});
