const { constants } = require('../../../constants');

import {
    apiCreateLinode,
    apiDeleteAllLinodes,
    timestamp,
} from '../../../utils/common';
import Backups from '../../../pageobjects/linode-detail/linode-detail-backups.page';
import ListLinodes from '../../../pageobjects/list-linodes';
import LinodeDetail from '../../../pageobjects/linode-detail/linode-detail.page';
import Settings from '../../../pageobjects/linode-detail/linode-detail-settings.page';


describe('Linode Detail - Backups Suite', () => {
    beforeAll(() => {
        browser.url(constants.routes.linodes);
        $('[data-qa-add-new-menu-button]').waitForDisplayed();
        apiCreateLinode(`AutoLinode${timestamp()}`);
        ListLinodes.navigateToDetail();
        LinodeDetail.launchConsole.waitForDisplayed(constants.wait.normal);
        LinodeDetail.changeTab('Backups');
    });

    afterAll(() => {
        apiDeleteAllLinodes();
    });

    it('should dislay placeholder text', () => {
        Backups.baseElemsDisplay(true);
    });

    it('should enable backups', () => {
        const toastMsg = 'Backups are being enabled for this Linode';

        Backups.enableButton.click();
        Backups.toastDisplays(toastMsg);
        Backups.description.waitForDisplayed();
    });

    it('should display backups elements', () => {
        Backups.baseElemsDisplay();
    });

    it('should fail to take a snapshot without a name', () => {
        Backups.snapshotButton.click();

        const toastMsg = 'A snapshot label is required.';
        Backups.toastDisplays(toastMsg);
        Backups.toast.waitForExist(constants.wait.normal, true);
    });

    it('should cancel backups', () => {
        Backups.cancelBackups();
    });
});
