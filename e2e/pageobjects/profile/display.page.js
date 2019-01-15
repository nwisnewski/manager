const { constants } = require('../../constants');

import Page from '../page';

export class Display extends Page {
    get emailAnchor() { return $('[data-qa-email]'); }
    get userName() { return $('[data-qa-username] input'); }
    get userEmail() { return $(`${this.emailAnchor.selector} input`); }
    get invalidEmailWarning() { return $(`${this.emailAnchor.selector} p`); }
    get saveTimeZone() { return $('[data-qa-tz-submit]'); }
    get timeZoneSelect() { return $(`[data-qa-enhanced-select] ${this.multiSelect.selector}`); }

    baseElementsDisplay(){
        this.userMenu.waitForDisplayed(constants.wait.normal);
        this.userEmail.waitForDisplayed(constants.wait.normal);

        expect(this.submitButton.isDisplayed()).toBe(true);
        expect(this.cancelButton.isDisplayed()).toBe(true);
        expect(this.saveTimeZone.isDisplayed()).toBe(true);
        expect(this.timeZoneSelect.isDisplayed()).toBe(true);
    }
}

export default new Display();
