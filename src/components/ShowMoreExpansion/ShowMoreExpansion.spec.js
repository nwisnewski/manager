const { navigateToStory } = require('../../../e2e/utils/storybook');

describe('Show More Expansion Suite', () => {
    const component = 'ShowMoreExpansion';
    const childStories = [
        'default',
    ]
    const showMoreExpanded = '[data-qa-show-more-expanded]';
    const showMoreToggle = '[data-qa-show-more-toggle]';

    beforeAll(() => {
        navigateToStory(component, childStories[0]);
    });

    it('should display show more expansion', () => {
        $(showMoreExpanded).waitForDisplayed();

        const showMoreExpandedElem = $(showMoreExpanded);

        expect(showMoreExpandedElem.getText()).toMatch(/([A-z])/ig);
        expect(showMoreExpandedElem.isDisplayed()).toBe(true);
    });

    it('should expand on click', () => {
        const collapsedState = $(showMoreExpanded).getAttribute('data-qa-show-more-expanded').includes('false');
        const ariaCollapsed = $(showMoreExpanded).getAttribute('aria-expanded').includes('false');

        expect(collapsedState).toBe(true);
        expect(ariaCollapsed).toBe(true);

        $(showMoreToggle).click();

        const afterClickState = $(showMoreExpanded).getAttribute('data-qa-show-more-expanded').includes('true');
        const ariaAfterClick = $(showMoreExpanded).getAttribute('aria-expanded').includes('true');

        expect(afterClickState).toBe(true);
        expect(ariaAfterClick).toBe(true);

    });

    it('should display example text', () => {
        const exampleText = $('[data-qa-show-more-expanded] + div p');
        expect(exampleText.getText()).toMatch(/([A-z])/ig);
    });

    it('should collapse on click', () => {
        $(showMoreToggle).click();

        const afterCollapse = $(showMoreExpanded).getAttribute('data-qa-show-more-expanded').includes('false');
        const ariaAfterCollapse = $(showMoreExpanded).getAttribute('aria-expanded').includes('false');

        expect(afterCollapse).toBe(true);
        expect(ariaAfterCollapse).toBe(true);
    });
});
