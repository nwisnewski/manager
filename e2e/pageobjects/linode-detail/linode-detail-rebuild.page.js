const { constants } = require('../../constants');

import Page from '../page';

class Rebuild extends Page {
    get title() { return this.pageTitle; }
    get description() { return $('[data-qa-rebuild-desc]'); }
    get imageSelectSelector() { return '[data-qa-enhanced-select="Select an Image"]';}
    get imagesSelect() { return $(`${this.imageSelectSelector}>div>div`); }
    get password() { return $('[data-qa-hide] input'); }
    get submit() { return $('[data-qa-rebuild]'); }
    get imageSelectHeader() { return $('[data-qa-select-header]'); }
    get imageOption() { return $('[data-qa-image-option]'); }
    get imageOptions() { return $$(this.imageOption.selector); }
    get imageError() { return $(`${this.imageSelectSelector}>p`); }

    assertElemsDisplay() {
        const expectedTitle = 'Rebuild';

        this.imagesSelect.waitForDisplayed(constants.wait.normal);

        expect(this.helpButton.isDisplayed()).toBe(true);
        expect(this.title.getText()).toBe(expectedTitle);
        expect(this.description.isDisplayed()).toBe(true);
        expect(this.imagesSelect.isDisplayed()).toBe(true);
        expect(this.submit.isDisplayed()).toBe(true);
        expect(this.password.isDisplayed()).toBe(true);
        return this;
    }

    selectImage(label) {
        this.imagesSelect.click();
        browser.pause(500);
        if (label) {
            const targetImage =
                this.selectOptions
                    .find(option => option.getText().includes(label));
            targetImage.click();
            return this;
        }
  
        const imageOption = this.selectOptions[0];
        const imageName = imageOption.getText();

        imageOption.click();
        // Expect image select to update with imageName
        const selectedOptionAttribute = this.imageSelectSelector.split('=');
        expect($(`${selectedOptionAttribute[0]}="${imageName}"]`).isDisplayed()).toBe(true);

        return this;
    }

    rebuild() {
        const toastMessage = 'Linode rebuild started.';
        browser.jsClick(this.submit.selector);
        this.toastDisplays(toastMessage, constants.wait.minute);
    }
}

export default new Rebuild();
