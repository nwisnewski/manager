const { navigateToStory } = require('../../../e2e/utils/storybook');

describe('Password Input Suite', () => {
    const component = 'Password Input';
    const childStories = [
        'Example',
    ]
    const strengthIndicator = '[data-qa-strength]';
    const passwordInput = '[data-qa-hide] input';

    function hideShow(show) {
        $('[data-qa-hide] svg').click();
        const hidden = $('[data-qa-hide]').getAttribute('data-qa-hide');
        const type = $(passwordInput).getAttribute('type');

        if (show) {
            expect(hidden).toBe('false');
            expect(type).toBe('text');
        } else {
            expect(hidden).toBe('true');
            expect(type).toBe('password');
        }
    }

    beforeAll(() => {
        navigateToStory(component, childStories[0]);
    });

    it('should display password input with strength indicator', () => {
        $(passwordInput).waitForDisplayed();

        const input = $(passwordInput);

        expect(input.isExisting()).toBe(true);
    });

    it('should update the strength when complexity of password increases', () => {
        const testPasswords = ['weak', 'stronger1233', 'Stronger123#!'];
        testPasswords.forEach((pass, index) => {
            $(passwordInput).setValue(pass);
            const strengthDisplays = $(strengthIndicator).isDisplayed();
            const strength = $(strengthIndicator).getAttribute('data-qa-strength');

            expect(strengthDisplays).toBe(true);
            expect(parseInt(strength)).toBe(index + 1);
        });
    });

    it('should display password when click show', () => {
        hideShow(true);
    });

    it('should hide when click hide', () => {
        hideShow();
    });
});
