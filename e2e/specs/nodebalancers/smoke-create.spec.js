const { constants } = require('../../constants');

import NodeBalancers from '../../pageobjects/nodebalancers.page';
import NodeBalancerDetail from '../../pageobjects/nodebalancer-detail/details.page';
import {
    apiCreateMultipleLinodes,
    apiDeleteAllNodeBalancers,
    timestamp,
} from '../../utils/common';

describe('Nodebalancer - Create Suite', () => {
    const linode = {
        linodeLabel: `${timestamp()}`,
        private_ip: true
    }

    beforeAll(() => {
        apiCreateMultipleLinodes([linode]);
        browser.url(constants.routes.nodeBalancers);
    });

    afterAll(() => {
        apiDeleteAllNodeBalancers();
    });

    it('should display placeholder message with create button', () => {
        NodeBalancers.baseElemsDisplay(true);
    });

    it('should display the configure node balancer base elements', () => {
        NodeBalancers.placeholderButton.click();
        NodeBalancers.baseElemsDisplay();
    });

    it('should fail to create without selecting a region', () => {
        const noticeMsg = 'Region is required.';
        browser.jsClick('[data-qa-deploy-linode]');
        NodeBalancers.waitForNotice(noticeMsg);
    });

    it('should fail to create without choosing a backend ip', () => {
        const labelError = 'Label is required.';
        const addressError = 'IP address is required.';

        NodeBalancers.regionCards[0].click();
        browser.jsClick('[data-qa-deploy-linode]');

        const backendLabelError = $('[data-qa-backend-ip-label]').$('p');
        const backendAddressError = $('[data-qa-backend-ip-address]').$('p');

        expect(backendLabelError.getText()).toBe(labelError);
        expect(backendAddressError.getText()).toContain(addressError);
    });

    it('should create a nodebalancer with a valid backend ip', () => {
        NodeBalancers.backendIpLabel.setValue(linode.linodeLabel.toLowerCase());
        NodeBalancers.backendIpAddress.click();
        $$(`${NodeBalancers.selectIpAddress} div`)[0].waitForDisplayed(constants.wait.normal);
        $$(`${NodeBalancers.selectIpAddress} div`)[0].click();
        NodeBalancers.backendIpPort.setValue('80');
        browser.jsClick('[data-qa-deploy-linode]');
        NodeBalancerDetail.baseElemsDisplay();
        const detailPageUrl = browser.getUrl();
        expect(detailPageUrl).toContain('/summary');
    });
});
