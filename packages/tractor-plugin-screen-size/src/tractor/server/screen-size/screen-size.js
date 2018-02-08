// Dependencies:
import { TractorError } from '@tractor/error-handler';
import Promise from 'bluebird';

// Constants:
const DEFAULT_HEIGHT = 1000;

export class ScreenSize {
    constructor (browser, config) {
        this.browser = browser;
        this.config = config;
    }

    setSize (size) {
        let dimensions = this.config.screenSizes[size];

        if (!dimensions) {
            return Promise.reject(new TractorError(`Cannot find a screen size configuration for "${size}"`));
        }

        let { height, width } = dimensions;

        if (!width) {
            width = dimensions;
        }

        if (!height) {
            height = DEFAULT_HEIGHT;
        }

        return this.browser.driver.manage().window().setSize(width, height);
    }
}
