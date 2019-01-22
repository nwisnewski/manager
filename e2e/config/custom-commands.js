const {
    loadProxyImposter,
    getImposters,
    deleteImposters,
    loadImposter,
} = require('../utils/mb-utils');

const { readToken } = require('../utils/config-utils');

exports.browserCommands = () => {
    /* Overwrite the native getText function
    * Get text from specified selector and ensure padding whitespace is removed
    * @param {String} the selector to look for on the DOM
    * @return {String} the trimmed text from the specified selector
    */
    browser._getText = browser.getText;
    browser.getText = (selector) => {
        const text = browser._getText(selector);
        if (Array.isArray(text)) {
            const trimmedArray = text.map(t => t.trim())
            return trimmedArray;
        } else if (typeof text === 'string') {
            return text.trim();
        } else {
            return text;
        }
    }

    browser.addCommand('loadProxyImposter', function async(proxyConfig) {
        return loadProxyImposter(proxyConfig)
            .then(res => res)
            .catch(error => console.error(error));
    });

    browser.addCommand('getImposters', function async(removeProxies, file) {
        return getImposters(removeProxies, file)
            .then(res => res)
            .catch(error => console.error(error));
    });

    browser.addCommand('loadImposter', function async(imposter) {
        return loadImposter(imposter)
            .then(res => res)
            .catch(error => console.error(error));
    });

    browser.addCommand('deleteImposters', function async() {
        return deleteImposters()
            .then(res => res)
            .catch(error => console.error(error));
    });

    /*
    * Executes a Javascript Click event via the browser console.
    * Useful when an element is not clickable via browser.click()
    * @param { String } elementToClick Selector to execute click event on
    * @returns { undefined } Returns nothing
    */
    browser.addCommand('jsClick', function(elementToClick) {
        browser.execute(function(elementToClick) {
            document.querySelector(elementToClick).click();
        }, elementToClick);
    });


    /* Executes a Javascript click event via the browser console
    *  on all elements matching the given selector name
    * Useful when the element is not clickable via browser.click()
    * @param { String } elementsToClick Selector displayed multiple times to click on
    */
    browser.addCommand('jsClickAll', function(elementsToClick) {
        browser.execute(function(elementsToClick) {
            var els = document.querySelectorAll(elementsToClick);
            els.forEach(e => e.click());
        }, elementsToClick);
    });

    /* Waits for the element to click to be visible
    * then execute a browser.click command on the element
    * @param { String } selector to wait for/click
    * @returns { null } Returns nothing
    */
    browser.addCommand('waitClick', function(elementToClick, timeout=10000) {
        browser.waitUntil(function() {
            $(elementToClick).waitForDisplayed();
            return $(elementToClick).click().state === 'success';
        }, timeout);
    });

    browser.addCommand('tryClick', function(elementToClick, timeout=5000) {
        let errorObject;
        browser.waitUntil(function() {
            try {
                $(elementToClick).click();
                return true;
            } catch (err) {
                errorObject = err;
                return false;
            }
        }, timeout, `failed to click ${elementToClick} due to ${JSON.stringify(errorObject)}`);
    });

    /* Continuously try to set a value on a given selector
    *  for a given timeout. Returns once the value has been successfully set
    * @param { String } selector to target (usually an input)
    * @param { String } value to set input of
    * @param { Number } timeout
    */
    browser.addCommand('trySetValue', function(selector, value, timeout=10000) {
        browser.waitUntil(function() {
            $(selector).setValue(value);
            return $(selector).getValue() === value;
        }, timeout);
    });
}
