const { constants } = require('../constants');

import Page from './page.js';
import ListStackScripts from './list-stackscripts.page';

class ConfigureStackScript extends Page {

    get createHeader() { return $(this.breadcrumbStaticText.selector); }
    get editHeader() { return $(this.breadcrumbStaticText.selector); }
    get label() { return $('[data-qa-stackscript-label]'); }
    get labelHelp() { return $('[data-qa-stackscript-label]').$('..').$(this.helpButton.selector); }
    get description() { return $('[data-qa-stackscript-description]'); }
    get descriptionHelp() { return $('[data-qa-stackscript-description]').$('..').$(this.helpButton.selector); }
    get targetImagesSelect() { return $('[data-qa-stackscript-target-select]'); }
    get targetImages() { return $$('[data-qa-stackscript-image]'); }
    get targetImagesHelp() { return $('[data-qa-stackscript-target-select]').$('..').$(this.helpButton.selector); }
    get script() { return $('[data-qa-stackscript-script]'); }
    get revisionNote() { return $('[data-qa-stackscript-revision]'); }
    get saveButton() { return $('[data-qa-save]'); }
    get imageTags() { return $$('[data-qa-tag]'); }

    save() {
        this.saveButton.click();
        ListStackScripts.baseElementsDisplay();
        $('[data-qa-notice]').waitForDisplayed(constants.wait.normal);
        ListStackScripts.stackScriptRow.waitForDisplayed(constants.wait.normal);
    }

    cancel() {
        this.cancelButton.click();
        this.dialogTitle.waitForDisplayed(constants.wait.normal);
        this.dialogContent.waitForDisplayed(constants.wait.normal);
        this.dialogConfirm.waitForDisplayed(constants.wait.normal);
        this.dialogCancel.waitForDisplayed(constants.wait.normal);
        this.dialogConfirm.click();
        this.dialogTitle.waitForDisplayed(constants.wait.normal, true);
    }

    baseElementsDisplay() {
        this.createHeader.waitForDisplayed(constants.wait.normal);
        expect(this.description.isDisplayed()).toBe(true);
        expect(this.targetImagesSelect.isDisplayed()).toBe(true);

        expect(this.labelHelp.getTagName()).toBe('button');
        expect(this.descriptionHelp.getTagName()).toBe('button');
        expect(this.targetImagesHelp.getTagName()).toBe('button');

        expect(this.script.isDisplayed()).toBe(true);
        expect(this.revisionNote.isDisplayed()).toBe(true);
        expect(this.saveButton.isDisplayed()).toBe(true);
        expect(this.cancelButton.isDisplayed()).toBe(true);
    }


    editElementsDisplay() {
        this.editHeader.waitForDisplayed(constants.wait.normal);

        expect(this.description.isDisplayed()).toBe(true);
        expect(this.targetImagesSelect.isDisplayed()).toBe(true);
        this.imageTags.forEach(tag => expect(tag.isDisplayed()).toBe(true));

        expect(this.labelHelp.getTagName()).toBe('button');
        expect(this.descriptionHelp.getTagName()).toBe('button');
        expect(this.targetImagesHelp.getTagName()).toBe('button');

        expect(this.script.isDisplayed()).toBe(true);
        expect(this.revisionNote.isDisplayed()).toBe(true);
        expect(this.saveButton.isDisplayed()).toBe(true);
        expect(this.cancelButton.isDisplayed()).toBe(true);
    }

    configure(config) {
        this.label.$('input').setValue(config.label);
        this.description.$('textarea').setValue(config.description);

        // Choose an image from the multi select
        this.targetImagesSelect.click();

        if (config.images) {
            config.images.forEach(i => {
                const imageElement = $(`[data-value="linode/${i}"]`);
                const imageName = imageElement.getAttribute('data-value');

                browser.jsClick(`[data-value="linode/${i}"]`);
                $(`[data-value="linode/${imageName}"]`).waitForDisplayed(constants.wait.normal, true);
            });
        } else {
            const imageElement = $$('[data-value]')[1];
            const imageName = imageElement.getAttribute('data-value');
            imageElement.click();
            $(`[data-value="${imageName}"]`).waitForDisplayed(constants.wait.normal, true);
        }

        // Click outside the select
        $('body').click();

        this.targetImagesSelect.waitForDisplayed(constants.wait.normal);
        $('#menu-image').waitForDisplayed(constants.wait.normal, true);

        this.script.$('textarea').click();
        this.script.$('textarea').setValue(config.script);
        this.revisionNote.$('input').setValue(config.revisionNote);
    }

    create(config, update=false) {
        this.save();

        const myStackscript =
            ListStackScripts.stackScriptRows
                .filter(t => t.$(ListStackScripts.stackScriptTitle.selector).getText().includes(config.label));

        expect(myStackscript.length).toBe(1);
        expect(myStackscript[0].$(ListStackScripts.stackScriptTitle.selector).getText()).toContain(config.description);
        expect(myStackscript[0].$(ListStackScripts.stackScriptDeploys.selector).getText()).toBe('0');
        expect(myStackscript[0].$(ListStackScripts.stackScriptRevision.selector).isDisplayed()).toBe(true);
        expect(myStackscript[0].$(ListStackScripts.stackScriptActionMenu.selector).isDisplayed()).toBe(true);
        ListStackScripts.waitForNotice(`${config.label} successfully ${update ? 'updated' : 'created'}`);
    }

    removeImage(imageName) {
        this.imageTags
            .filter(i => i.getText().includes(imageName))
            .forEach(i => {
                i.$('svg').click();
                i.waitForDisplayed(constants.wait.normal, true);
            });

    }
}

export default new ConfigureStackScript();
