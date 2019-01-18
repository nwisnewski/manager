const { constants } = require('../constants');

import Page from './page';

export class ListLinodes extends Page {
    // Grid/List Linode Card/Rows
    get subheader() { return this.pageTitle; }
    get confirmDialogTitle() { return $('[data-qa-dialog-title]'); }
    get confirmDialogSubmit() { return $('[data-qa-confirm-cancel]'); }
    get confirmDialogCancel() { return $('[data-qa-cancel-cancel]'); }
    get placeholderText() { return $('[data-qa-placeholder-title]'); }
    get activeView() { return $('[data-qa-active-view]'); }
    get linode() { return $$('[data-qa-linode]'); }
    get linodeElem() { return $('[data-qa-linode]'); }
    get linodeLabel() { return $('[data-qa-label]'); }
    get hardwareSummary() { return $('[data-qa-linode-summary]'); }
    get region() { return $('[data-qa-region]'); }
    get ip() { return $('[data-qa-ips]'); }
    get image() { return $('[data-qa-image]'); }
    get launchConsole() { return $('[data-qa-console]'); }
    get rebootButton() { return $('[data-qa-reboot]'); }
    get linodeActionMenu() { return $('[data-qa-action-menu]'); }
    get listToggle() { return $('[data-qa-view="list"]'); }
    get gridToggle() { return $('[data-qa-view="grid"]'); }
    get status() { return $('[data-qa-status]') }
    get tableHead() { return $('[data-qa-table-head]'); }
    get linodeSortAttribute() { return 'data-qa-sort-label'; }
    get sortLinodesByLabel() { return $(`[${this.linodeSortAttribute}]`); }

    // Action Menu Items
    get powerOffMenu() { return $('[data-qa-action-menu-item="Power Off"]'); }
    get powerOnMenu() { return $('[data-qa-action-menu-item="Power On"]'); }
    get launchConsoleMenu() { return $('[data-qa-action-menu-item="Launch Console"]'); }
    get rebootMenu() { return $('[data-qa-action-menu-item="Reboot"]'); }
    get viewGraphsMenu() { return $('[data-qa-action-menu-item="View Graphs"]'); }
    get resizeMenu() { return $('[data-qa-action-menu-item="Resize"]'); }
    get viewBackupsMenu() { return $('[data-qa-action-menu-item="View Backups"]'); }
    get enableBackupsMenu() { return $('[data-qa-action-menu-item="Enable Backups"]'); }
    get settingsMenu() { return $('[data-qa-action-menu-item="Settings"]'); }
    get copyIp() { return $('[data-qa-copy-ip] svg'); }

    linodesDisplay() {
        try {
            browser.waitUntil(function() {
                return $('[data-qa-linode]').waitForDisplayed() && $$('[data-qa-linode]').length > 0;
            }, constants.wait.normal);
            return true;
        } catch (err) {
            if ($(this.placeholderText).isDisplayed()) {
                return false;
            }
            throw new Error(err);
        }
    }

    getLinodeSelector(linode){
        return `[data-qa-linode="${linode}"]`;
    }

    hoverLinodeTags(linode){
        $(`${this.getLinodeSelector(linode)}>td:nth-child(2)`).moveToObject();
    }

    getLinodeTags(linode){
        return $(this.getLinodeSelector(linode)).$$(this.tag.selector)
            .map(tag => tag.getText());
    }

    getLinodesInTagsGroup(tag){
        const attribute = this.linodeElem.selector.substr(1).slice(0, -1);
        return this.tagHeader(tag).$$(this.linodeElem.selector)
            .map(linode => linode.getAttribute(attribute));
    }

    navigateToDetail(linode) {
       const linodeLink = linode ? $$(`${this.getLinodeSelector(linode)} a>div`)[0] : this.linode[0].$$('a>div')[0];
       linodeLink.waitForDisplayed(constants.wait.normal);
       linodeLink.click();
    }

    gridElemsDisplay() {
        const header = this.subheader;
        this.linode.forEach(l => {
            expect(l.isDisplayed()).toBe(true);
            expect(l.$(this.linodeLabel.selector).isDisplayed()).toBe(true);
            expect(l.$(this.hardwareSummary.selector).isDisplayed()).toBe(true);
            expect(l.$(this.region.selector).isDisplayed()).toBe(true);
            expect(l.$(this.image.selector).isDisplayed()).toBe(true);
            expect(l.$(this.ip.selector).isDisplayed()).toBe(true);
            expect(l.$(this.rebootButton.selector).isDisplayed()).toBe(true);
            expect(l.$(this.linodeActionMenu.selector).isDisplayed()).toBe(true);
            expect(l.$(this.image.selector).isDisplayed()).toBe(true);
            expect(l.$(this.rebootButton.selector).isDisplayed()).toBe(true);
            expect(l.$(this.linodeActionMenu.selector).isDisplayed()).toBe(true);
        });

        expect(header.isDisplayed()).toBe(true);
        expect(header.getText()).not.toBe(null);
    }

    listElemsDisplay() {
        const linodeDisplays = this.linode.map(l => l.isDisplayed());
        const labelDisplays = this.linode.map(l => l.$(this.linodeLabel.selector).isDisplayed());
        const ipDisplays = this.linode.map(l => l.$(this.ip.selector).isDisplayed());
        const regionDisplays = this.linode.map(l => l.$(this.region.selector).isDisplayed());
        const actionMenu =  this.linode.map(l => l.$(this.linodeActionMenu.selector).isDisplayed());

        linodeDisplays.forEach(l => expect(l).toBe(true));
        labelDisplays.forEach(l => expect(l).toBe(true));
        ipDisplays.forEach(i => expect(i).toBe(true));
        regionDisplays.forEach(r => expect(r).toBe(true));
        actionMenu.forEach(a => expect(a).toBe(true));
    }

    getStatus(linode) {
        return $(`${this.getLinodeSelector(linode)} ${this.status.selector}`).getAttribute('data-qa-status');
    }

    reboot(linode) {
        const activeView = this.activeView.getAttribute('data-qa-active-view');

        if (activeView === 'list') {
            // Select from action menu
            linode.$(this.linodeActionMenu.selector).click();
            $('[data-qa-action-menu-item="Reboot"]').click();
            this.acceptDialog('Confirm Reboot');
            $('[data-qa-loading]').waitForDisplayed();
        }

        if (activeView === 'grid') {
            linode.$(this.rebootButton).click();
            this.acceptDialog('Confirm Reboot');
            $('[data-qa-circular-progress]').waitForDisplayed();
        }

        browser.waitUntil(function() {
            return linode.$(this.status.selector).getAttribute('data-qa-status') === 'rebooting';
        }, constants.wait.long);

        browser.waitUntil(function() {
            return linode.$(this.status).getAttribute('data-qa-status') === 'running';
        }, constants.wait.long);
    }

    powerOff(linode) {
        this.selectActionMenuItemV2(this.getLinodeSelector(linode),'Power Off');
        this.acceptDialog('Powering Off');

        browser.waitUntil(function() {
            return $(`${this.getLinodeSelector(linode)} [data-qa-status="offline"]`).isDisplayed();
        }, constants.wait.minute * 3, 'Failed to power down linode');
    }

    powerOn(linode) {
        this.selectActionMenuItem(linode, 'Power On');

        browser.waitUntil(function() {
            return $('[data-qa-status="running"]').isDisplayed();
        }, constants.wait.minute * 2);
    }

    shutdownIfRunning(linode) {
        if (this.getStatus(linode) === 'running') {
            this.powerOff(linode);
        }
    }

    switchView(view) {
        $(`[data-qa-view="${view}"]`).click();
        browser.waitUntil(function() {
            return $(`[data-qa-active-view="${view}"]`).isDisplayed();
        }, constants.wait.short);
    }

    acceptDialog(dialogTitle) {
        this.confirmDialogTitle.waitForDisplayed();
        this.confirmDialogCancel.waitForDisplayed();
        this.confirmDialogSubmit.waitForDisplayed();
        expect(this.confirmDialogTitle.getText()).toBe(dialogTitle);
        this.confirmDialogSubmit.click();
        this.confirmDialogTitle.waitForDisplayed(constants.wait.normal, true);
    }
}
export default new ListLinodes();
