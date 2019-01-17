const { constants } = require('../../../constants');

import {
		apiCreateMultipleLinodes,
		apiDeleteAllLinodes,
		timestamp,
		parseLinodeIdFromUrl,
} from '../../../utils/common';
import LinodeDetail from '../../../pageobjects/linode-detail/linode-detail.page';
import Networking from '../../../pageobjects/linode-detail/linode-detail-networking.page';

describe('Linode Detail - Ip Transfer Suite', () => {
	let singlePublicIpError;
	const linodeA = {
		linodeLabel: `AutoLinodeA${timestamp()}`,
		private_ip: true
	}

	const linodeB = {
		linodeLabel: `AutoLinodeB${timestamp()}`,
		private_ip: true
	}

	beforeAll(() => {
		apiCreateMultipleLinodes([linodeA,linodeB]);
		$(`[data-qa-linode="${linodeA.linodeLabel}"] a`).click();
		LinodeDetail.landingElemsDisplay();
		linodeA['id'] = parseLinodeIdFromUrl();
		LinodeDetail.changeTab('Networking');
	});

	afterAll(() => {
		apiDeleteAllLinodes();
	});

	it('should display ip transfer configuration', () => {
		Networking.networkActionsTitle.waitForDisplayed(constants.wait.normal);

		// Expand the panels
		Networking.expandPanels(2);

		expect(Networking.networkingActionsSubheading.isDisplayed()).toBe(true);
		expect(Networking.ipTransferSubheading.isDisplayed()).toBe(true);
		Networking.ipTransferActionMenu.waitForDisplayed(constants.wait.normal);
		expect(Networking.ipTransferActionMenus.length).toBe(2);
	});

	it('should display swap and move to transfer actions', () => {
		Networking.ipTransferActionMenus[0].click();

		Networking.moveIpButton.waitForDisplayed(constants.wait.normal);
		expect(Networking.swapIpButton.isDisplayed()).toBe(true);
	});

	it('should display an error on move to linode', () => {
		singlePublicIpError = `${linodeA.id} must have at least one public IP after assignment`;
		Networking.moveIpButton.click();
		Networking.moveIpButton.waitForDisplayed(constants.wait.normal, true);
		Networking.ipTransferSave.click();
		Networking.waitForNotice(singlePublicIpError);
	});

	it('should dismiss error on cancel', () => {
		Networking.ipTransferCancel.click();
		Networking.waitForNotice(singlePublicIpError, constants.wait.normal, true);
	});

	it('should display swap ip action elements', () => {
		Networking.ipTransferActionMenu.waitForDisplayed(constants.wait.normal);
		Networking.ipTransferActionMenus[0].click();
		Networking.swapIpButton.waitForDisplayed();
		Networking.swapIpButton.click();
		Networking.swapIpButton.waitForDisplayed(constants.wait.normal, true);
		Networking.swapIpActionMenu.waitForDisplayed();
		Networking.swapIpActionMenu.click();
		$('[data-qa-swap-with]').waitForDisplayed();

		expect(Networking.swapWithIps.length).toBeGreaterThan(1);
	});

	it('should fail to swap public to private ips', () => {
		const errorMsg = `${linodeA.id} must have no more than one private IP after assignment.`;
		const privateIps =
			Networking.swapWithIps
				.filter(ip => !!ip.getText().match(/^10\.|^172\.1[6-9]\.|^172\.2[0-9]\.|^172\.3[0-1]\.|^192\.168\.|^fd/))
		privateIps[0].click();

		$('[data-qa-swap-with]').waitForDisplayed(constants.wait.normal, true);

		Networking.ipTransferSave.click();
		Networking.waitForNotice(errorMsg);
	});

	it('should successfully swap ips on a valid ip selection', () => {
		Networking.swapIpActionMenu.click();
		$('[data-qa-swap-with]').waitForDisplayed();

		const publicIps =
			Networking.swapWithIps
				.filter(ip => !!!ip.getText().match(/^10\.|^172\.1[6-9]\.|^172\.2[0-9]\.|^172\.3[0-1]\.|^192\.168\.|^fd/));
		publicIps[0].click();
		$('[data-qa-swap-with]').waitForDisplayed(constants.wait.normal, true);
		Networking.ipTransferSave.click();
	});
});
