const { constants } = require('../constants');

import Page from './page.js';

class NodeBalancers extends Page {
    get deploy() { return $('[data-qa-deploy-linode]'); }
    get configTitle() { return this.pageTitle; }
    get placeholderText() { return $('[data-qa-placeholder-title]'); }
    get placeholderButton() { return $('[data-qa-placeholder-button]'); }
    get createNodeBalancerMenu() { return $('[data-qa-add-new-menu="NodeBalancer"]'); }
    get createHeader() { return $('[data-qa-create-nodebalancer-header]'); }

    get label() { return $('[data-qa-label-input] input'); }
    get selectOption() { return $('[data-qa-option]'); }

    get regionSection() { return $('[data-qa-tp="Region"]'); }
    get regionTabs() { return $$('[data-qa-tab]'); }
    get regionCards() { return $$('[data-qa-tp="Region"] [data-qa-selection-card]'); }

    get connectionThrottleSection() { return $('[data-qa-throttle-section]'); }
    get connectionThrottle() { return $('[data-qa-connection-throttle] input'); }

    get settingsSection() { return $('[data-qa-nodebalancer-settings-section]'); }
    get port() { return $('[data-qa-port] input'); }
    get protocolSelect() { return $('[data-qa-protocol-select]'); }
    get algorithmHeader() { return $('[data-qa-algorithm-header]'); }
    get algorithmSelect() { return $('[data-qa-algorithm-select]'); }

    get certTextField() { return $('[data-qa-cert-field]'); }
    get privateKeyTextField() { return $('[data-qa-private-key-field]'); }

    get sessionStickinessHeader() { return $('[data-qa-session-stickiness-header]'); }
    get sessionStickiness() { return $('[data-qa-session-stickiness-select]'); }

    get activeChecksHeader() { return $('[data-qa-active-checks-header]'); }
    get activeCheckType() { return $('[data-qa-active-check-select]'); }
    get activeCheckInterval() { return $('[data-qa-active-check-interval] input'); }
    get activeCheckTimeout() { return $('[data-qa-active-check-timeout] input'); }
    get activeCheckAttempts() { return $('[data-qa-active-check-attempts] input'); }

    get passiveChecksHeader() { return $('[data-qa-passive-checks-header]'); }
    get passiveChecksToggle() { return $('[data-qa-passive-checks-toggle]'); }

    get backendIpsHeader() { return $('[data-qa-backend-ip-header]'); }
    get backendIps() { return $$('[data-qa-backend-ip]'); }
    get backendIpLabel() { return $('[data-qa-backend-ip-label] input'); }
    get backendIpAddress() { return $('[data-qa-backend-ip-address] input'); }
    get backendIpPort() { return $('[data-qa-backend-ip-port] input'); }
    get backendIpWeight() { return $('[data-qa-backend-ip-weight] input'); }
    get backendIpMode() { return $('[data-qa-backend-ip-mode]'); }

    get saveButton() { return $('[data-qa-save-config]'); }
    get deleteButton() { return $('[data-qa-delete-config]'); }
    get nodes() { return $$('[data-qa-node]'); }
    get removeNode() { return $('[data-qa-remove-node]'); }
    get addNode() { return this.addIcon('Add a Node'); }
    get addConfiguration() { return $('[data-qa-add-config]'); }
    get selectIpAddress() { return '[data-qa-select-ip]'; }

    baseElemsDisplay(initial) {
        if (initial) {
            this.placeholderText.waitForDisplayed(constants.wait.normal);
            expect(this.placeholderButton.isDisplayed()).toBe(true);
            expect(this.placeholderButton.getTagName()).toBe('button');
        } else {
            this.createHeader.waitForDisplayed();
            expect(this.regionSection.isDisplayed()).toBe(true);
            expect(this.regionTabs.length).toBeGreaterThan(0);
            expect(this.regionCards.length).toBeGreaterThan(0);

            // expect(this.connectionThrottleSection.isDisplayed()).toBe(true);
            // expect(this.connectionThrottle.isDisplayed()).toBe(true);
            expect(this.settingsSection.isDisplayed()).toBe(true);
            expect(this.port.isDisplayed()).toBe(true);
            expect(this.protocolSelect.isDisplayed()).toBe(true);
            expect(this.algorithmSelect.getText()).toContain('Round Robin');
            expect(this.sessionStickiness.getText()).toContain('Table');

            expect(this.activeChecksHeader.isDisplayed()).toBe(true);
            expect(this.activeCheckType.isDisplayed()).toBe(true);

            expect(this.passiveChecksHeader.waitForDisplayed()).toBe(true);
            expect(this.passiveChecksToggle.isDisplayed()).toBe(true);

            expect(this.backendIpsHeader.waitForDisplayed()).toBe(true);
            expect(this.backendIpLabel.isDisplayed()).toBe(true);
            expect(this.backendIpAddress.isDisplayed()).toBe(true);
            expect(this.backendIpPort.isDisplayed()).toBe(true);
            expect(this.backendIpWeight.getValue()).toBe('100');
        }
    }

    configElemsDisplay() {
        this.configTitle.waitForDisplayed(constants.wait.normal);

        expect(this.configTitle.getText()).toBe('NodeBalancer Configurations');

        expect(this.port.isDisplayed()).toBe(true);
        expect(this.protocolSelect.isDisplayed()).toBe(true);
        expect(this.algorithmSelect.getText()).toContain('Round Robin');
        // expect(this.sessionStickinessHeader.waitForDisplayed()).toBe(true);
        expect(this.sessionStickiness.getText()).toContain('Table');

        expect(this.activeChecksHeader.isDisplayed()).toBe(true);
        // expect(this.activeCheckTimeout.getValue()).toBe('3');
        expect(this.activeCheckType.getText()).toContain('None');
        // expect(this.activeCheckInterval.getValue()).toBe('5');

        expect(this.passiveChecksHeader.waitForDisplayed()).toBe(true);
        expect(this.passiveChecksToggle.getAttribute('data-qa-passive-checks-toggle')).toBe('true');

        expect(this.backendIpsHeader.waitForDisplayed()).toBe(true);
        expect(this.backendIpLabel.isDisplayed()).toBe(true);
        expect(this.backendIpAddress.isDisplayed()).toBe(true);
        expect(this.backendIpPort.isDisplayed()).toBe(true);
        expect(this.backendIpWeight.getValue()).toBe('100');
        expect(this.backendIpMode.getText()).toContain('Accept');
        expect(this.addNode.isDisplayed()).toBe(true);
        expect(this.addNode.getTagName()).toBe('button');
        expect(this.addConfiguration.getTagName()).toBe('button');
        expect(this.addConfiguration.getText()).toBe('Add another Configuration');
        expect(this.removeNode.isDisplayed()).toBe(true)
    }

    configDelete() {
        const confirmTitle = 'Confirm Deletion';
        const confirmMsg = 'Are you sure you want to delete this NodeBalancer Configuration?';
        this.deleteButton.click();
        this.dialogTitle.waitForDisplayed(constants.wait.normal);

        expect(this.dialogTitle.getText()).toBe(confirmTitle);
        expect(this.dialogContent.getText()).toBe(confirmMsg);
        expect(this.dialogConfirm.getText()).toBe('Delete');
        expect(this.dialogCancel.getText()).toBe('Cancel');

        this.dialogConfirm.click();
        this.dialogTitle.waitForDisplayed(constants.wait.normal, true);
        this.configTitle.waitForDisplayed(constants.wait.normal);

        expect(this.port.isDisplayed()).toBe(false);
        expect(this.protocolSelect.isDisplayed()).toBe(false);
    }


    configAddNode(nodeConfig) {
        this.addNode.click();
        const labels = $$('[data-qa-backend-ip-label] input')
            .filter(label => label.getValue() === '');
        const ips = $$('[data-qa-backend-ip-address] input')
            .filter(ip => ip.getValue() === '');
        labels[0].click();
        labels[0].setValue(nodeConfig.label);
        ips[0].setValue(nodeConfig.ip);
    }

    configRemoveNode(nodeLabel) {
        const node = this.nodes
            .filter(l => l.$('[data-qa-backend-ip-label] input').getValue() === nodeLabel);

        node[0].$(this.removeNode.selector).click();

        browser.waitUntil(function() {
            const matchingNodes = $$('[data-qa-backend-ip-label] input')
                .filter(l => l.getValue() === nodeLabel);
            return matchingNodes.length === 0;
        }, constants.wait.normal);
    }

    configSave() {
        const successMsg = 'NodeBalancer Configuration updated successfully';
        this.saveButton.click();
        this.waitForNotice(successMsg);
    }

    create() {
        if (this.placeholderButton.isDisplayed()) {
            this.placeholderButton.click();
            this.baseElemsDisplay();
        } else {
            this.selectGlobalCreateItem('NodeBalancer');
        }
    }

    configure(linodeLabel, ipAddress=false, nodeBalancerConfig={
        // NodeBalancer Config Object
        label: `NB-${new Date().getTime()}`,
        regionIndex: 0,
        connectionThrottle: 0,
        port: '80',
        protocol: 'http',
        algorithm: 'roundrobin',
        sessionStickiness: 'table',
        activeCheckType: 'TCP Connection',
        healthCheckInterval: 5,
        healthCheckTimeout: 3,
        healthCheckAttempts: 2,
        passiveChecksToggle: true,
    }) {
        this.label.waitForDisplayed(constants.wait.normal);
        this.label.setValue(nodeBalancerConfig.label);
        this.regionCards[nodeBalancerConfig.regionIndex].click();
        this.port.setValue(nodeBalancerConfig.port);
        this.selectMenuOption(this.protocolSelect, nodeBalancerConfig.protocol);
        this.selectMenuOption(this.algorithmSelect, nodeBalancerConfig.algorithm);
        this.selectMenuOption(this.sessionStickiness, nodeBalancerConfig.sessionStickiness);
        this.backendIpLabel.setValue(linodeLabel);
        if(ipAddress){
            this.backendIpAddress.setValue(ipAddress);
        }else{
            this.backendIpAddress.click();
            $$(`${this.selectIpAddress} div`)[0].waitForDisplayed(constants.wait.normal);
            $$(`${this.selectIpAddress} div`)[0].click();
        }
        this.backendIpPort.setValue(80);
        browser.jsClick('[data-qa-deploy-linode]');
    }

    selectMenuOption(select, optionName) {
        select.click();
        this.selectOption.waitForDisplayed(constants.wait.normal);
        $(`[data-qa-option=${optionName}]`).click();
        $(`[data-qa-option=${optionName}]`).waitForDisplayed(constants.wait.normal, true);
    }
}

export default new NodeBalancers();
