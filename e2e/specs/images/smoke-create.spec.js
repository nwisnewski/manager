const { constants } = require('../../constants');
const { readToken } = require('../../utils/config-utils')
const { getImages } = require('../../setup/setup');

import ConfigureImage from '../../pageobjects/configure-image.page';

import {
    apiCreateLinode,
    apiDeleteAllLinodes,
    apiDeletePrivateImages,
    timestamp,
} from '../../utils/common';

describe('Images - Create Suite', () => {
    beforeAll(() => {
        apiCreateLinode(`AutoLinode${timestamp()}`);
        browser.url(constants.routes.images);
    });

    afterAll(() => {
        apiDeleteAllLinodes();
        apiDeletePrivateImages();
    });

    it('should display create image drawer', () => {
        ConfigureImage.placeholderMsg.waitForDisplayed(constants.wait.normal);
        ConfigureImage.placeholderButton.waitForDisplayed(constants.wait.normal);
        ConfigureImage.placeholderButton.click();
        ConfigureImage.baseElementsDisplay();
    });

    it('should configure the image', () => {
        const imageConfig = {
            label: 'my-test-image',
            description: 'some image description!'
        }
        ConfigureImage.configure(imageConfig);
    });

    it('should schedule the image for creation', () => {
        ConfigureImage.create();
    });
});
