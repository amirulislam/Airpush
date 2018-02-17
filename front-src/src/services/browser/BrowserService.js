import _ from 'lodash';
import { detect } from 'detect-browser';
const browser = detect();

class BrowserService {
    static checkSupported() {
        if (browser && browser.name) {
            if (!BrowserService.isSupported()) {
                window.location = '/install-browser';
            }
        } else {
            window.location = '/install-browser';
        }
    }

    static isSupported() {
        const supported = ['chrome', 'firefox', 'opera'];
        return _.includes(supported, browser.name);
    }
}
export default BrowserService;
