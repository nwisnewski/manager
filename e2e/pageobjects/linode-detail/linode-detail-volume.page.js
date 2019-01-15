const { constants } = require('../../constants');

import Page from '../page';

export class VolumeDetail extends Page {
    get placeholderText() { return $('[data-qa-placeholder-title]'); }
    get createButton() { return $('[data-qa-placeholder-button]'); }
    get createIconLink() { return this.addIcon('Create a Volume'); }
    get label() { return $('[data-qa-volume-label]'); }
    get size() { return $('[data-qa-size]'); }
    get region() { return $('[data-qa-select-region]'); }
    get regionField() { return $('[data-qa-region]'); }
    get selectLinodeOrVolume() { return $(`${this.drawerBase.selector} [data-qa-enhanced-select]`); }
    get linodeSelect() { return $('[data-qa-linode-select]'); }
    get linodeAttachOption() { return $('[data-qa-linode-menu-item]'); }
    get attachedTo() { return $('[data-qa-attach-to]'); }
    get attachRegion() { return $('[data-qa-attach-to-region]'); }
    get attachRegions() { return $$('[data-qa-attach-to-region]'); }
    get submit() { return this.submitButton; }
    get cancel() { return this.cancelButton; }
    get volumeCell() { return $$('[data-qa-volume-cell]'); }
    get volumeCellElem() { return $('[data-qa-volume-cell]'); }
    get volumeAttachment() { return $('[data-qa-volume-cell-attachment]'); }
    get volumeAttachedLinodes() { return $$('[data-qa-attached-linode]'); }
    get volumeCellLabel() { return $('[data-qa-volume-cell-label]') }
    get volumeCellSize() { return $('[data-qa-volume-size]') }
    get volumeFsPath() { return $('[data-qa-fs-path]'); }
    get volumeActionMenu() { return $('[data-qa-action-menu]'); }
    get volumeSelect() { return $('[data-qa-volume-select] span'); }
    get volumeOptions() { return $$('[data-value]'); }
    get attachButton() { return $('[data-qa-confirm-attach]'); }
    get cloneLabel() { return $('[data-qa-clone-from] input'); }
    get copyToolTips() { return $$('[data-qa-copy-tooltip]'); }
    get configHelpMessages() { return $$('[data-qa-config-help-msg]'); }
    get volumePrice() { return this.drawerPrice; }
    get volumePriceBillingInterval() { return this.drawerBillingInterval; }
    get volumeCreateSizeHelpText() { return $('[data-qa-volume-size-help]'); }
    get volumeCreateHelpText() { return $('[data-qa-volume-help]'); }
    get volumeCreateRegionHelp() { return $('[data-qa-volume-region]'); }
    get volumeselectLinodeOrVolumeHelpText() { return $('[data-qa-volume-attach-help]'); }
    get createFileSystemCommand() { return $('[data-qa-make-filesystem] input'); }
    get createMountDirCommand() { return $('[data-qa-mountpoint] input'); }
    get mountCommand() { return $('[data-qa-mount] input'); }
    get mountOnBootCommand() { return $('[data-qa-boot-mount] input'); }
    get umountCommand() { return $('[data-qa-umount] input'); }
    get fileSystemCheckCommand() { return $('[data-qa-check-filesystem] input'); }
    get resizeFileSystemCommand() { return $('[data-qa-resize-filesystem] input'); }
    get creatAndAttachRadio() { return $('[data-qa-radio="Create and Attach Volume"]'); }
    get attachExistingVolume() { return $('[data-qa-radio="Attach Existing Volume"]'); }

    removeAllVolumes() {
        const pageObject = this;
        browser.waitUntil(() => {
            return this.volumeCell.length > 0;
        }, constants.wait.normal);
        this.volumeCell.forEach(function(v) {
            pageObject.removeVolume(v);
        });
    }

    closeVolumeDrawer() {
        this.drawerClose.click();
        this.drawerTitle.waitForDisplayed(constants.wait.short, true);
        browser.pause(500);
    }

    defaultDrawerElemsDisplay() {
        const volumeDrawerTitle = 'Create a Volume';

        this.drawerTitle.waitForDisplayed(constants.wait.normal);

        expect(this.drawerTitle.getText()).toBe(volumeDrawerTitle);
        expect(this.size.$('input').getValue()).toContain(20);
        expect(this.label.$('input').getText()).toBe('');
        expect(this.region.isDisplayed()).toBe(true);
        expect(this.submit.isDisplayed()).toBe(true);
        expect(this.cancel.isDisplayed()).toBe(true);
        this.selectLinodeOrVolume.waitForDisplayed(constants.wait.normal);
    }

    volumeAttachedToLinodeDrawerDisplays() {
        this.drawerBase.waitForDisplayed(constants.wait.normal);
        this.creatAndAttachRadio.waitForDisplayed(constants.wait.normal);
        this.attachExistingVolume.waitForDisplayed(constants.wait.normal);
        this.label.waitForDisplayed(constants.wait.normal);
        this.size.waitForDisplayed(constants.wait.normal);
        this.tagsMultiSelect.waitForDisplayed(constants.wait.normal);
    }

    attachExistingVolumeToLinodeDrawerDisplays() {
        this.selectLinodeOrVolume.waitForDisplayed(constants.wait.normal);
    }

    attachExistingVolumeToLinode(volumeLabel){
        this.drawerBase.waitForDisplayed(constants.wait.normal);
        this.attachExistingVolumeToLinodeDrawerDisplays();
        this.attachExistingVolume.click();
        this.attachExistingVolumeToLinodeDrawerDisplays();
        this.selectLinodeOrVolume.$('..').$('..').click();
        this.selectOption.waitForDisplayed(constants.wait.normal);
        this.selectOptions.find(option => option.getText() === volumeLabel).click();
        this.selectOption.waitForDisplayed(constants.wait.normal,true);
        this.submit.click();
        this.drawerBase.waitForDisplayed(constants.wait.normal,true);
    }

    volumeConfigurationDrawerDisplays(){
        this.createFileSystemCommand.waitForDisplayed(constants.wait.normal);
        this.createMountDirCommand.waitForDisplayed(constants.wait.normal);
        this.mountCommand.waitForDisplayed(constants.wait.normal);
        this.mountOnBootCommand.waitForDisplayed(constants.wait.normal);
        expect(this.copyToolTips.length).toBe(4);
        expect(this.drawerTitle.getText()).toEqual('Volume Configuration');
    }

    createVolumeAttachedToLinode(volumeLabel,size,tag){
        this.volumeAttachedToLinodeDrawerDisplays();
        this.label.$('input').setValue(volumeLabel);
        this.size.$('input').setValue(size);
        if(tag){
            this.addTagToTagInput(tag);
        }
        this.submitButton.click();
    }

    getVolumeId(label) {
        const volumesWithLabel = this.volumeCell.filter(v => v.$(this.volumeCellLabel.selector).getText() === label);

        if (volumesWithLabel.length === 1) {
            return volumesWithLabel[0].getAttribute('data-qa-volume-cell');
        }

        return volumesWithLabel.map(v => v.getAttribute('data-qa-volume-cell'));
    }

    createVolume(volume, createMethod) {
        if (createMethod === 'placeholder') {
            this.createButton.waitForDisplayed(constants.wait.normal);
            this.createButton.click();
        }

        if (createMethod === 'icon') {
            this.createIconLink.waitForDisplayed(constants.wait.normal);
            this.createIconLink.click();
        }

        if (createMethod === 'header') {
            this.selectGlobalCreateItem('Volume');
        }

        this.drawerTitle.waitForDisplayed(constants.wait.normal);

        $('[data-qa-volume-label] input').waitForDisplayed(constants.wait.normal);

        $('[data-qa-volume-label] input').waitForDisplayed(constants.wait.normal);
        $('[data-qa-volume-label] input').setValue(volume.label);
        $('[data-qa-size] input').trySetValue(volume.size);

        if (volume.hasOwnProperty('region')) {
            this.selectRegion(volume.region);
            browser.waitUntil(() => {
                return $('[data-qa-select-region] input').getValue();
            });
        }

        if (volume.hasOwnProperty('attachedLinode')) {
            this.selectLinodeOrVolume.click();
            this.selectOption.waitForDisplayed(constants.wait.normal);

            const optionToSelect =
                this.selectOptions.filter(opt => opt.getText().includes(volume.attachedLinode));

            optionToSelect[0].click();
        }

        if(volume.hasOwnProperty('tag')) {
            this.addTagToTagInput(volume.tag);
        }

        this.submit.click();

        if (volume.hasOwnProperty('attachedLinode')) {
            $(`[data-qa-volume-cell-attachment="${volume.attachedLinode}"]`).waitForDisplayed(constants.wait.long * 2);
        }
    }

    editVolume(newLabel, tag=undefined) {
        this.drawerBase.waitForDisplayed(constants.wait.normal);
        this.label.waitForDisplayed(constants.wait.normal);
        $('[data-qa-volume-label] input').setValue(newLabel);
        if(tag){
          if(this.multiOption.isDisplayed()){
              const tags = $$(this.multiOption.selector).length;
              this.multiOption.$('..').$('..').$('input').setValue(tag);
              this.selectOptions[0].waitForDisplayed(constants.wait.normal);
              this.selectOptions[0].click();
              browser.waitUntil(() => {
                  return $$(this.multiOption.selector).length === tags + 1;
              },constants.wait.normal);
          }else{
              this.addTagToTagInput(tag);
          }
        }
        this.submit.click();
        this.drawerBase.waitForDisplayed(constants.wait.normal, true);
        browser.waitUntil(() => {
            return $$(this.volumeCellLabel.selector).find(label => label.getText().includes(newLabel));
        },constants.wait.normal);
    }

    resizeVolume(newSize) {
        this.drawerBase.waitForDisplayed(constants.wait.normal);
        this.size.waitForDisplayed(constants.wait.normal);
        $(`${this.size.selector} input`).setValue(newSize);
        const volumePrice = newSize * 0.1;
        expect(this.volumePrice.getText()).toEqual(`$${volumePrice.toFixed(2)}`);
        this.submit.click();
        this.waitForNotice('Volume scheduled to be resized.');
        this.umountCommand.waitForDisplayed(constants.wait.normal);
        this.fileSystemCheckCommand.waitForDisplayed(constants.wait.normal);
        this.resizeFileSystemCommand.waitForDisplayed(constants.wait.normal);
        this.mountCommand.waitForDisplayed(constants.wait.normal);
    }

    attachVolumeFromVolumeLanding(linode) {
        this.drawerBase.waitForDisplayed(constants.wait.normal);
        this.linodeSelect.waitForDisplayed(constants.wait.normal);
        this.linodeSelect.click();
        this.linodeAttachOption.waitForDisplayed(constants.wait.normal);
        const linodeAttach = this.linodeAttachOption.selector.replace(']','');
        browser.jsClick(`${linodeAttach}="${linode}"]`)
        this.linodeAttachOption.waitForDisplayed(constants.wait.normal,true);
        this.submitButton.click();
        this.drawerBase.waitForDisplayed(constants.wait.normal,false);
        const attachedTo = this.volumeAttachment.selector.replace(']','');
        $(`${attachedTo}="${linode}"`).waitForDisplayed(constants.wait.normal);
    }

    detachVolume(volume, detach=true) {
        this.selectActionMenuItem(volume, 'Detach');

        const dialogTitle = $('[data-qa-dialog-title]');
        const dialogConfirm = $('[data-qa-confirm]');
        const dialogCancel = $(this.cancelButton.selector);
        const dialogContent = $('[data-qa-dialog-content]');

        dialogTitle.waitForDisplayed(constants.wait.normal);
        expect(dialogTitle.isDisplayed()).toBe(true);
        expect(dialogTitle.getText()).toBe('Detach Volume');
        expect(dialogContent.getText()).toMatch(/\w/ig);
        expect(dialogConfirm.isDisplayed()).toBe(true);
        expect(dialogConfirm.getTagName()).toBe('button');
        expect(dialogCancel.isDisplayed()).toBe(true);
        expect(dialogCancel.getTagName()).toBe('button');
        if( detach ){
            dialogConfirm.click();
            dialogConfirm.waitForDisplayed(constants.wait.normal, true);
        }
    }

    confirmDetachORDelete() {
        this.dialogTitle.waitForDisplayed(constants.wait.normal);
        $('[data-qa-confirm]').click();
        this.dialogTitle.waitForDisplayed(constants.wait.normal, true);
    }

    cloneVolume(newClone,currentSize) {
        const startVolumes = this.volumeCell.length;
        this.drawerBase.waitForDisplayed(constants.wait.normal);
        this.label.waitForDisplayed(constants.wait.normal);
        this.label.$('input').setValue(newClone);
        const volumePrice = currentSize * 0.1;
        expect(this.volumePrice.getText()).toEqual(`$${volumePrice.toFixed(2)}`);
        this.submitButton.click();
        this.drawerBase.waitForDisplayed(constants.wait.normal,true);
        browser.waitUntil(() => {
            return this.volumeCell.length === startVolumes + 1;
        }, constants.wait.minute);
    }

    removeVolume(volumeElement) {
        this.drawerTitle.waitForExist(constants.wait.normal, true);
        if (volumeElement.$('[data-qa-volume-cell-attachment]').isExisting() && volumeElement.$('[data-qa-volume-cell-attachment]').getText() !== '') {
            volumeElement.$('[data-qa-action-menu]').click();
            $('[data-qa-action-menu-item="Delete"]').waitForDisplayed(constants.wait.normal);
            browser.jsClick('[data-qa-action-menu-item="Delete"]');
            $('[data-qa-dialog-title]').waitForDisplayed(constants.wait.normal);
            $('[data-qa-confirm]').click();
            $('[data-qa-dialog-title]').waitForDisplayed(constants.wait.normal, true);

            // Wait for progress bars to not display on volume detail pages
            $('[data-qa-volume-loading]').waitForDisplayed(constants.wait.long, true);

            browser.waitUntil(function() {
                return $('[data-qa-volume-cell-attachment]').isExisting() &&
                    $('[data-qa-volume-cell-attachment]').getText() === '' &&
                    volumeElement.$('[data-qa-action-menu]').isDisplayed();
            }, constants.wait.minute * 2, 'Remove Volume: Failed to detach volume');
        }
        const numberOfVolumes = this.volumeCell.length;
        volumeElement.$('[data-qa-action-menu]').click();

        $('[data-qa-action-menu-item="Delete"]').waitForDisplayed(constants.wait.normal);
        browser.jsClick('[data-qa-action-menu-item="Delete"]');

        $('[data-qa-dialog-title]').waitForDisplayed(constants.wait.normal);

        const dialogTitle = $('[data-qa-dialog-title]');
        const dialogConfirm = $('[data-qa-confirm]');
        const dialogCancel = $(this.cancelButton.selector);

        expect(dialogTitle.isDisplayed()).toBe(true);
        expect(dialogTitle.getText()).toBe('Delete Volume');
        expect(dialogConfirm.isDisplayed()).toBe(true);
        expect(dialogConfirm.getTagName()).toBe('button');
        expect(dialogCancel.isDisplayed()).toBe(true);
        expect(dialogCancel.getTagName()).toBe('button');

        // Confirm remove
        dialogConfirm.click();
        dialogConfirm.waitForDisplayed(constants.wait.normal, true);

        browser.waitUntil(function(volumeElement) {
            return $$('[data-qa-volume-cell]').length === (numberOfVolumes-1)
        }, constants.wait.minute, 'Volume failed to be removed');
    }

    assertVolumeInTable(volume) {
        const volumes = this.volumeCell;
        const vLabel = this.volumeCellLabel;
        const vSize = this.volumeCellSize;
        const vFsPath = this.volumeFsPath;

        const volumesDisplayed = volumes.map((v) => {
            return [v.$(vLabel.selector).getText(),
            v.$(vSize.selector).getText()]
        });
        expect(volumesDisplayed).toContain([volume.label, volume.size]);
    }

    assertActionMenuItems(attached=true) {
        this.actionMenuItem.waitForDisplayed(constants.wait.normal);
        const menuItems =
          attached ? ["Show Configuration", "Edit Volume", "Resize", "Clone", "Detach" ] : ["Show Configuration", "Edit Volume", "Resize", "Clone", "Attach", "Delete" ];
        const actionMenuItem=this.actionMenuItem.selector.replace(']','');
        menuItems.forEach(item => expect($(`${actionMenuItem}="${item}"`).isDisplayed()).toBe(true));
    }

    assertConfig() {
        this.drawerTitle.waitForDisplayed(constants.wait.normal);
        expect(this.drawerTitle.getText()).toBe('Volume Configuration');
        expect(this.cancel.isDisplayed()).toBe(true);
        expect(this.cancel.getTagName()).toBe('button');
        expect(this.configHelpMessages.length).toBe(4);

        this.configHelpMessages.forEach(msg => {
            expect(msg.getText()).toMatch(/\w/ig);
        });

        expect(this.copyToolTips.length).toBe(4);
    }

    selectRegion(region) {
        this.region.waitForDisplayed();
        this.region.click();
        const regionSelector = this.attachRegion.selector.replace(']','');
        const volumeRegion = `${regionSelector}="${region}"]`;
        browser.waitUntil(() => {
            return this.attachRegions.length > 0;
        }, constants.wait.normal);
        browser.jsClick(volumeRegion);
        this.attachRegion.waitForDisplayed(constants.wait.short, true);
    }

    checkVolumeConfigurationCommands(volumeLabel){
        expect(this.createFileSystemCommand.getAttribute('value')).toEqual(`mkfs.ext4 "/dev/disk/by-id/scsi-0Linode_Volume_${volumeLabel}"`);
        expect(this.createMountDirCommand.getAttribute('value')).toEqual(`mkdir "/mnt/${volumeLabel}"`);
        expect(this.mountCommand.getAttribute('value')).toEqual(`mount "/dev/disk/by-id/scsi-0Linode_Volume_${volumeLabel}" "/mnt/${volumeLabel}"`);
        expect(this.mountOnBootCommand.getAttribute('value')).toEqual(`/dev/disk/by-id/scsi-0Linode_Volume_${volumeLabel} /mnt/${volumeLabel} ext4 defaults,noatime 0 2`);
    }
}

export default new VolumeDetail();
