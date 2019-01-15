const { constants } = require('../constants');

import Page from './page';

class SearchBar extends Page {
    get searchElem() { return $('#search-bar'); }
    get searchInput() { return $('#search-bar input'); }
    get searchIcon() { return $('[data-qa-search-icon]'); }
    get suggestion() { return $('[data-qa-suggestion]'); }
    get suggestions() { return $$(this.suggestion.selector); }
    get suggestionTitle() { return $('[data-qa-suggestion-title]'); }
    get suggestionDesc() { return $('[data-qa-suggestion-title]'); }

    executeSearch(query) {
        this.searchElem.waitForDisplayed(constants.wait.normal);
        this.searchElem.click();
        this.searchInput.setValue(query);
    }

    searchAndNavigateToResults(query){
        this.executeSearch(query);
        this.suggestion.waitForDisplayed(constants.wait.normal);
        this.searchInput.addValue(this.enterKey);
    }

    assertSearchDisplays() {
        this.searchIcon.waitForDisplayed(constants.wait.normal);
        this.searchElem.waitForDisplayed(constants.wait.normal);
        this.searchInput.waitForDisplayed(constants.wait.normal);
    }

    assertSuggestions() {
        $('[data-qa-suggestion]').waitForDisplayed(constants.wait.normal);

        // Assert suggestions display icons, titles, descriptions
        this.suggestions
            .forEach(el => {
                const iconVisible = el.$('svg').isDisplayed();
                const titleVisible = el.$(this.suggestionTitle.selector).isDisplayed();
                const descriptionVisible = el.$(this.suggestionDesc.selector).isDisplayed();

                expect(iconVisible).toBe(true);
                expect(titleVisible).toBe(true);
                expect(descriptionVisible).toBe(true)
            });
    }

    navigateToSuggestion(suggestion) {
        $('[data-qa-suggestion]').waitForDisplayed(constants.wait.normal);

        suggestion.click();
        $('[data-qa-circle-progress]').waitForDisplayed(constants.wait.normal, true);
    }

    selectByKeyDown() {
        this.searchInput.setValue('\uE015');

        $('[data-qa-suggestion]').waitForDisplayed(constants.wait.normal);
        // key down and enter fails to work on firefox
        const selected = this.suggestions[0].getAttribute('data-qa-selected');
        expect(selected).toBe('true');
    }
}

export default new SearchBar();
