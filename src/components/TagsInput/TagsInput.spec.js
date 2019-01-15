const { navigateToStory } = require('../../../e2e/utils/storybook');
const { constants } = require('../../../e2e/constants');

describe('Tags Input Suite', () => {
    const component = 'Tags Input';
    const childStories = ['Tags Input', 'Tags Input with an error'];
    const tagInput = '[data-qa-enhanced-select]';
    const tagOptions = '[data-qa-option]';
    const selectedTags = '[data-qa-multi-option]';

    const inputValidation = (tagText) => {
        const inputError = $(tagInput).$('..').$('..').$('..').$('p');
        $(tagInput).$('..').$('input').setValue(tagText);
        $$(tagOptions)[0].waitForDisplayed(constants.wait.normal);
        try {
            $$(tagOptions)[0].click();
            inputError.waitForDisplayed(constants.wait.normal);
            expect(inputError.getText()).toContain('Length must be 3-25 characters');
        } catch (e) {

        }
    }

    beforeAll(() => {
        navigateToStory(component, childStories[0]);
    });

    it('there should be a tags input drop down with available tags', () => {
        $(tagInput).waitForDisplayed(constants.wait.normal);
        $(tagInput).click();
        $$(tagOptions)[0].waitForDisplayed(constants.wait.normal);
        const tags = $$(tagOptions).map(tag => tag.getText());
        expect(tags).toEqual(['tag1','tag2','tag3','tag4']);
    });

    it('an avialable tag can be selected', () => {
        $$(tagOptions)[0].click();
        $(selectedTags).waitForDisplayed(constants.wait.normal);
        expect($(selectedTags).getText()).toEqual('tag1');
    });

    it('multiple tags can be selected', () => {
        $('input').click();
        $$(tagOptions)[0].waitForDisplayed(constants.wait.normal);
        $$(tagOptions)[0].click();
        browser.waitUntil(() => {
            return $$(selectedTags).length === 2;
        },constants.wait.normal);
    });

    it('a single tag can be cleared by clicking the x icon on tag', () => {
        $(`${selectedTags}`).$('..').$('svg').click();
        browser.waitUntil(() => {
            return $$(selectedTags).length === 1;
        },constants.wait.normal);
    });

    it('all tags can be cleared by clicking on the x icon to clear select', () => {
        $('svg[height="20"]').click();
        //wait for selected tags not displayed
        $(selectedTags).waitForDisplayed(constants.wait.normal, true);
    });

    it('a new tag can be created and selected', () => {
        const testTag = 'TEST_TAG';
        $(tagInput).$('..').$('input').setValue(testTag);
        $$(tagOptions)[0].waitForDisplayed(constants.wait.normal);
        $$(tagOptions)[0].click();
        $(selectedTags).waitForDisplayed(constants.wait.normal);
        expect($(selectedTags).getText()).toEqual(testTag);
        $('svg[height="20"]').click();
    });

    xit('a tag must be between 3-25 characters', () => {
        inputValidation('a');
        navigateToStory(component, childStories[0]);
        inputValidation('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    });

    describe('Tags Input with api error', () => {

      it('an error message should be displayed when tags can not be retrieved', () => {
          navigateToStory(component, childStories[1]);
          $(tagInput).waitForDisplayed(constants.wait.normal);
          const errorMessaage = $$('p').find(error => error.getAttribute('class').includes('error'))
          expect(errorMessaage.getText()).toContain('There was an error retrieving your tags.');
      });
    });

});
