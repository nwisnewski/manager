const { constants } = require('../../constants');

import Page from '../page';

export class Lish extends Page {
    get authModeSelect() { return $(this.basicSelect); }
    get sshKey() { return $('[data-qa-public-key] textarea' ); }
    get addSshKey() { return this.addIcon('Add SSH Public Key'); }
    get removeButton() { return $('[data-qa-remove]'); }
    get saveButton() { return $('[data-qa-save]'); }
    get passwordKeysOption() { return $('[data-value="password_keys"]'); }
    get keysOnlyOption() { return $('[data-value="keys_only"]'); }
    get disableLishOption() { return $('[data-value="disabled"]'); }

    baseElemsDisplay() {
        this.authModeSelect.waitForDisplayed(constants.wait.normal);

        expect(this.sshKey.isDisplayed()).toBe(true);
        expect(this.removeButton.isDisplayed()).toBe(true);
        expect(this.saveButton.isDisplayed()).toBe(true);
        expect(this.authModeSelect.isDisplayed()).toBe(true);
    }


    disable(statusMsg) {
        this.authModeSelect.click();
        this.disableLishOption.waitForDisplayed(constants.wait.normal);
        this.disableLishOption.click();
        this.disableLishOption.waitForExist(constants.wait.normal, true);
        this.saveButton.click();
        this.waitForNotice(statusMsg, constants.wait.normal);
    }

    allowKeyAuthOnly(publicKey,statusMsg) {
        this.authModeSelect.click();
        this.keysOnlyOption.waitForDisplayed(constants.wait.normal);
        this.keysOnlyOption.click();
        this.keysOnlyOption.waitForExist(constants.wait.normal, true);
        this.sshKey.setValue(publicKey);
        this.saveButton.click();
        this.waitForNotice(statusMsg, constants.wait.normal);
    }

    allowPassAndKey(publicKey,statusMsg) {
        this.authModeSelect.click();
        this.passwordKeysOption.waitForDisplayed(constants.wait.normal);
        this.passwordKeysOption.click();
        this.passwordKeysOption.waitForExist(constants.wait.normal, true);
        this.sshKey.setValue(publicKey);
        this.saveButton.click();
        this.waitForNotice(statusMsg, constants.wait.normal);
    }
}

export default new Lish();
