const { constants } = require('../../constants');

import {
    apiCreateLinode,
    apiDeleteAllLinodes,
    timestamp,
} from '../../utils/common';
import ConfigureLinode from '../../pageobjects/configure-linode';
import Create from '../../pageobjects/create';

describe('Create Linode - Clone from Existing Suite', () => {
    beforeAll(() => {
        apiCreateLinode(`AutoLinode${timestamp()}`,undefined,undefined,'g6-standard-1');
        ConfigureLinode.selectGlobalCreateItem('Linode');
    });

    afterAll(() => {
       apiDeleteAllLinodes();
   });

    it('should display clone elements', () => {
        ConfigureLinode.baseDisplay();
        ConfigureLinode.createFromExisting.click();
        ConfigureLinode.cloneBaseElemsDisplay();
    });

    it('should disable source linode in clone target panel on selection', () => {
        ConfigureLinode.cloneSelectSource();
    });

    xit('should expand with clone to new linode elements', () => {
        ConfigureLinode.cloneSelectTarget();
    });

    xit('should disable all region options except the source linode region', () => {

    });

    it('should fail to clone to a smaller linode plan', () => {
        const noticeMsg = 'A plan selection is required when cloning to a new Linode';

        ConfigureLinode.selectPlanTab('Nanode');

        try {
            $$('[data-qa-tp="Linode Plan"] [data-qa-selection-card]')[0].click();
            $('[role="tooltip"]').waitForDisplayed();
            const toolTipMsg = $('[role="tooltip"]').getText();
            expect(toolTipMsg).toBe('This plan is too small for the selected image.');
        } catch (err) {
            if (!err.message.includes('Failed to select plan')) throw err;
        }

        ConfigureLinode.label.setValue(new Date().getTime());
        ConfigureLinode.regions[0].click();
        ConfigureLinode.deploy.click();
        ConfigureLinode.waitForNotice(noticeMsg);
    });
});
