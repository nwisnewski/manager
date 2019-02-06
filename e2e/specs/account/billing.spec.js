const { constants } = require('../../constants');

import { timestamp } from '../../utils/common';
import Billing from '../../pageobjects/account/billing.page';

describe('Billing - View & Update Contact Info Suite', () => {
    beforeAll(() => {
        browser.url(constants.routes.account.billing);
    });

    it('should display update contact info fields', () => {
        Billing.expandUpdateContact();
    });

    it('should update contact first name', () => {
        const newName = `Jimmy${timestamp()}`;
        const successMsg = 'Contact information successfully updated.';

        Billing.updateFirstName.$('input').setValue(newName);
        Billing.updateButton.click();

        Billing.waitForNotice(successMsg, constants.wait.normal);
    });

    it('should revert new lastname', () => {
        const newLastName = 'Cruise';
        const originalLastName = Billing.updateLastName.$('input').getValue();

        Billing.updateLastName.$('input').setValue(newLastName);
        Billing.resetButton.click();

        expect(Billing.updateLastName.$('input').getValue()).toBe(originalLastName);
    });

    it('should display recent invoices', () => {
        Billing.expandInvoices();
        Billing.invoicesDisplay();
    });
});
