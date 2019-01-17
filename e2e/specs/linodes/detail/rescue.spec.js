const { constants } = require('../../../constants');
const { readToken } = require('../../../utils/config-utils');
import LinodeDetail from '../../../pageobjects/linode-detail/linode-detail.page';
import Rescue from '../../../pageobjects/linode-detail/linode-detail-rescue.page';
import Resize from '../../../pageobjects/linode-detail/linode-detail-resize.page';
import Settings from '../../../pageobjects/linode-detail/linode-detail-settings.page';
import VolumeDetail from '../../../pageobjects/linode-detail/linode-detail-volume.page';
import {
    timestamp,
    apiCreateLinode,
    apiDeleteAllLinodes,
    apiDeleteAllVolumes,
} from '../../../utils/common';


describe('Rescue Linode Suite', () => {
    let volumeLabels = [];
    let diskImage;
    const intialDisks = ['Debian 9 Disk', '512 MB Swap Image'];
    const emptyDisk = `EmptyDisk${timestamp()}`;
    const diskFromImage = `ImageDisk${timestamp()}`;
    const linodeLabel = `AutoLinode${timestamp()}`;

    const generateVolumeArray = (linode_id) => {
        let volumes = [];
        for(let i = 0; i < 3; i++){
          const label = `AutoVolume${i}${timestamp()}`;
          volumeLabels.push(label);
          const testVolume = {
              label: label,
              size: 10,
              linode_id: linode_id
          }
          volumes.push(testVolume);
        }
        return volumes;
    }

    const dropDownOptionDisplayed = (selection) => {
        const select = Rescue.selectOption.selector.replace(']','');
        expect($(`${select}="${selection}"]`).isDisplayed()).toBe(true);
    }

    const addAdditionalRescueDisk = (disk,selection) => {
        Rescue.addDisk.click();
        browser.pause(750);
        Rescue.selectDiskOrVlolume(disk,selection);
    }

    const rescueAndWaitForLinodeNotBusy = () => {
        const checkIfToastIsPresent = (message) => {
            return $$(Rescue.toast.selector).find(toast => toast.getText() === message);
        }
        let i = 0;
        browser.pause(3000);
        do {
            Rescue.submitButton.click();
            browser.pause(4000);
            i++;
        } while (!checkIfToastIsPresent('Linode rescue started.') && checkIfToastIsPresent('Linode busy.') && i < 10);
    }

  /*  beforeAll(() => {
        const token = readToken(browser.options.testUser);
        apiCreateLinode(linodeLabel).then((linode) => {
            generateVolumeArray(linode.id).forEach((volume) => {
                browser.createVolume(token,volume.label,volume.region,volume.size,volume.tags,volume.linode_id);
            });
        });
        browser.url(constants.routes.volumes);
        browser.pause(500);
        volumeLabels.forEach((volume) => {
            VolumeDetail.waitForVolumeExists(volume);
        });
    });*/

    afterAll(() => {
        apiDeleteAllVolumes();
    });

    it('Rescue Linode Tab displays', () => {
        const token = readToken(browser.options.testUser);
        apiCreateLinode(linodeLabel).then((linode) => {
            generateVolumeArray(linode.id).forEach((volume) => {
                browser.createVolume(token,volume.label,volume.region,volume.size,volume.tags,volume.linode_id);
            });
        });
        browser.url(constants.routes.volumes);
        browser.pause(500);
        volumeLabels.forEach((volume) => {
            VolumeDetail.waitForVolumeExists(volume);
        });
        let trimSelector = VolumeDetail.volumeAttachment.selector.replace(']','');
        const linodeAttachedToCell = `${trimSelector}="${linodeLabel}"]`;
        $$(linodeAttachedToCell)[0].waitForDisplayed(constants.wait.normal);
        $$(`${linodeAttachedToCell} a`)[0].click();
        LinodeDetail.launchConsole.waitForDisplayed(constants.wait.normal);
        LinodeDetail.changeTab('Rescue');
        browser.pause(500);
        Rescue.rescueDetailDisplays();
    });

    it('Default image and swap disks should display in rescue dropdown', () => {
        Rescue.openRescueDiskSelect('sda');
        intialDisks.forEach(disk => dropDownOptionDisplayed(disk));
    });

    it('Attached volumes should display in rescue dropdown', () => {
        volumeLabels.forEach(volume => dropDownOptionDisplayed(volume));
        $('body').click();
    });

    describe('Added disks display in rescue dropdowns', () => {
        const cardHeader = 'data-qa-select-card-heading';

        it('Resize linode to add additional disks', () => {
            LinodeDetail.changeTab('Resize');
            browser.pause(500);
            Resize.landingElemsDisplay();
            Resize.planCards.find(plan => plan.$(`[${cardHeader}]`).getAttribute(cardHeader) === 'Linode 4GB').click();
            try {
                Resize.toast.waitForDisplayed(constants.wait.normal);
                Resize.toast.waitForDisplayed(constants.wait.long,true);
            } catch(e) {

            }
            Resize.submit.click();
            Resize.toastDisplays('Linode resize started.');
            Resize.linearProgress.waitForDisplayed(constants.wait.normal);
            Resize.linearProgress.waitForDisplayed(constants.wait.minute*10,true);
        });

        it('Add an empty disk', () => {
            Resize.changeTab('Settings');
            browser.pause(500);
            Settings.expandPanel('Advanced Configurations');
            Settings.addIcon('Add a Configuration').waitForDisplayed(constants.wait.normal);
            Settings.addIcon('Add a Disk').waitForDisplayed(constants.wait.normal);
            intialDisks.forEach(disk => Settings.diskRow(disk).waitForDisplayed(constants.wait.normal));
            browser.pause(500);
            Settings.addIcon('Add a Disk').click();
            Settings.addDiskDrawerDisplays();
            Settings.addEmptyDisk(emptyDisk,'5000');
        });

        it('Add a disk with an image', () => {
            browser.pause(500);
            Settings.addIcon('Add a Disk').click();
            Settings.addDiskDrawerDisplays();
            Settings.addDiskFromImage(diskFromImage,'arch','5000');
        });

        it('Added disks should display in rescue dropdown', () => {
            Settings.changeTab('Rescue');
            browser.pause(500);
            Rescue.rescueDetailDisplays();
            Rescue.openRescueDiskSelect('sda');
            [emptyDisk,diskFromImage].forEach(disk => dropDownOptionDisplayed(disk));
            $('body').click();
            browser.pause(500);
        });
    });

    it('Rescue Linode with Volumes and additional disks', () => {
        Rescue.selectDiskOrVlolume('sda',intialDisks[0]);
        Rescue.selectDiskOrVlolume('sdb',intialDisks[1]);
        addAdditionalRescueDisk('sdc', emptyDisk);
        addAdditionalRescueDisk('sdd', diskFromImage);
        addAdditionalRescueDisk('sde', volumeLabels[0]);
        addAdditionalRescueDisk('sdf', volumeLabels[1]);
        addAdditionalRescueDisk('sdg', volumeLabels[2]);
        rescueAndWaitForLinodeNotBusy();
        Rescue.toastDisplays('Linode rescue started.');
        Rescue.linearProgress.waitForDisplayed(constants.wait.normal);
    });
});
