const { constants } = require('../../constants');

import Page from '../page';

export class SshKeys extends Page {
    get addKeyButton() { return this.addIcon('Add a SSH Key'); }

    get drawerKeyLabel() { return $('[data-qa-label-field] input'); }
    get drawerPublicKey() { return $('[data-qa-ssh-key-field] textarea'); }

    get submitKeyButton() { return $(this.submitButton.selector); }

    get publicKeyRow() { return $('[data-qa-content-row]'); }
    get publicKeyRows() { return $$('[data-qa-content-row]'); }

    get publicKeyActionMenu() { return $('[data-qa-action-menu="true"]'); }

    get label() { return $('[data-qa-label]'); }
    get labelColumn() { return $('[data-qa-label-column]'); }
    get keyColumn() { return $('[data-qa-key-column]'); }
    get createdColumn() { return $('[data-qa-created-column]'); }

    get placeholderMsg() { return $('[data-qa-placeholder-msg]'); }

    baseElemsDisplay() {
        this.addKeyButton.waitForDisplayed(constants.wait.normal);
        this.labelColumn.waitForDisplayed(constants.wait.normal);

        expect(this.keyColumn.isDisplayed()).toBe(true);
        expect(this.createdColumn.isDisplayed()).toBe(true);
    }


    addKey(label, publicKey) {
        this.addKeyButton.click();
        this.drawerTitle.waitForDisplayed(constants.wait.normal);
        this.drawerKeyLabel.waitForDisplayed(constants.wait.normal);
        expect(this.drawerPublicKey.isDisplayed()).toBe(true);
        expect(this.addKeyButton.isDisplayed()).toBe(true);
        expect(this.cancelButton.isDisplayed()).toBe(true);

        this.drawerKeyLabel.setValue(label);
        this.drawerPublicKey.setValue(publicKey);
        this.submitKeyButton.click();

        $(`[data-qa-content-row="${label}"]`).waitForDisplayed(constants.wait.normal);
    }

    removeKey(label) {
        $(`[data-qa-content-row="${label}"]`).waitForDisplayed(constants.wait.normal);
        const keyToRemove = $(`[data-qa-content-row="${label}"]`);
        this.selectActionMenuItem(keyToRemove, 'Delete');

        this.dialogTitle.waitForDisplayed(constants.wait.normal);

        expect(this.dialogConfirmDelete.isDisplayed()).toBe(true);
        expect(this.dialogConfirmCancel.isDisplayed()).toBe(true);
        expect(this.dialogTitle.getText()).toBe('Delete SSH Key');

        this.dialogConfirmDelete.click();
        this.dialogTitle.waitForExist(constants.wait.normal, true);

        $(`[data-qa-content-row="${label}"]`).waitForDisplayed(constants.wait.long, true);
    }
}

export default new SshKeys();
