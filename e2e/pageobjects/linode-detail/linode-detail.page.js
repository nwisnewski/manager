const { constants } = require('../../constants');

import Page from '../page';

class LinodeDetail extends Page {
    get title() { return this.pageTitle; }
    get summaryTab() { return $('[data-qa-tab="Summary"]'); }
    get volumesTab() { return $('[data-qa-tab="Volumes"]'); }
    get networkingTab() { return $('[data-qa-tab="Networking"]'); }
    get resizeTab() { return $('[data-qa-tab="Resize"]'); }
    get rescueTab() { return $('[data-qa-tab="Rescue"]'); }
    get rebuildTab() { return $('[data-qa-tab="Rebuild"]'); }
    get backupTab() { return $('[data-qa-tab="Backups"]'); }
    get settingsTab() { return $('[data-qa-tab="Settings"]'); }
    get launchConsole() { return $('[data-qa-launch-console]'); }
    get powerControl() { return $('[data-qa-power-control]'); }
    get setPowerReboot() { return $('[data-qa-set-power="reboot"]'); }
    get setPowerOff() { return $('[data-qa-set-power="powerOff"]'); }
    get setPowerOn() { return $('[data-qa-set-power="powerOn"]'); }
    get tagsMultiSelect() { return $('[data-qa-tags-multiselect]'); }
    get linodeLabel() { return $(this.breadcrumbEditableText.selector); }
    get editLabel() { return $(this.breadcrumbEditableText.selector); }

    changeName(name) {
        this.linodeLabel.waitForDisplayed();
        this.editLabel.moveTo();
        this.breadcrumbEditButton.waitForDisplayed(constants.wait.normal);
        this.breadcrumbEditButton.click();
        this.breadcrumbEditableText.$('input').setValue(name);
        this.breadcrumbSaveEdit.click();
        browser.waitUntil(function() {
            return this.linodeLabel.getText() === name;
        }, constants.wait.normal);
    }

    setPower(powerState) {
        const currentPowerState = this.powerControl.getAttribute('data-qa-power-control');

        browser.jsClick('[data-qa-power-control]');
        $(`[data-qa-set-power="${powerState}"]`).click();

        if (powerState.includes('powerOff')) {
            this.dialogTitle.waitForDisplayed(constants.wait.normal);
            $('[data-qa-confirm-cancel]').click();
            browser.waitUntil(function() {
                return $('[data-qa-power-control="offline"]').isDisplayed();
            }, constants.wait.minute * 3);
            return;
        }
    }

    landingElemsDisplay() {
        this.summaryTab.waitForDisplayed();

        expect(this.title.isDisplayed()).toBe(true);
        expect(this.volumesTab.isDisplayed()).toBe(true);
        expect(this.networkingTab.isDisplayed()).toBe(true);
        expect(this.resizeTab.isDisplayed()).toBe(true);
        expect(this.rescueTab.isDisplayed()).toBe(true);
        expect(this.rebuildTab.isDisplayed()).toBe(true);
        expect(this.backupTab.isDisplayed()).toBe(true);
        expect(this.settingsTab.isDisplayed()).toBe(true);
        expect(this.launchConsole.isDisplayed()).toBe(true);
        expect(this.powerControl.isDisplayed()).toBe(true);
        expect(this.linodeLabel.isDisplayed()).toBe(true);

        return this;
    }
}

export default new LinodeDetail();
