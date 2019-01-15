const { constants } = require('../../constants');

import Page from '../page';

class UserDetail extends Page {
    get userDetailHeader() { return this.breadCrumbLinkText; }
    get subHeader() { return $('[data-qa-profile-header]'); }
    get deleteSubHeader() { return $('[data-qa-delete-user-header]'); }
    get deleteButton() { return $('[data-qa-confirm-delete]'); }
    get usernameField() { return $('[data-qa-username]'); }
    get emailField() { return $('[data-qa-email]'); }
    get saveButton() { return this.submitButton; }
    get usernameWarning() { return $(`${this.usernameField.selector} p`); }

    baseElementsDisplay(owner) {
        this.userDetailHeader.waitForDisplayed(constants.wait.normal);
        this.subHeader.waitForDisplayed(constants.wait.normal);

        if (owner) {
            expect(this.helpButton.isExisting()).toBe(true);
        }

        expect(this.deleteSubHeader.isDisplayed()).toBe(true);
        expect(this.deleteButton.isExisting()).toBe(true);
        expect(this.usernameField.isDisplayed()).toBe(true);
        expect(this.emailField.isDisplayed()).toBe(true);
        expect(this.saveButton.isDisplayed()).toBe(true);
        expect(this.cancelButton.isDisplayed()).toBe(true);
    }


    updateUsername(username) {
        this.usernameField.$('input').clearElement();
        this.usernameField.$('input').setValue(username);
        this.saveButton.click();
    }
}

export default new UserDetail();
