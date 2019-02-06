const { navigateToStory } = require('../../../e2e/utils/storybook');

describe('Linear Progress Bar Suite', () => {
    const linearProgress = '[data-qa-linear-progress]';
    const component = 'Linear Progress Indicator';
    const childStories = [
        'Indefinite',
    ]

    beforeAll(() => {
        navigateToStory(component, childStories[0]);
    });

    it('should display indefinite linear bar on the page', () => {
        $(linearProgress).waitForDisplayed();

        const progressBar = $(linearProgress);
        const role = progressBar.getAttribute('role');

        expect(progressBar.isDisplayed()).toBe(true);
        expect(role).toBe('progressbar');
    });
});
