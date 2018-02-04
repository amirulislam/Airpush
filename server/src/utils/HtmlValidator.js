import striptags from 'striptags';
import Autolinker from 'autolinker';
import _ from 'lodash';

let instance;

class HtmlValidator {

    constructor() {
        //this._autoLinker = new Autolinker();
    }

    // remove all tags
    static removeAllTags(html) {
        if (html && _.isString(html)) {
            return striptags(html);
        }
        return '';
    }

    // convert text links to html a
    static linkify(text) {
        if (text && _.isString(text)) {
            return Autolinker.link(text, {
                newWindow : true,
                truncate  : 30
            });
        }
        return '';
    }


    static validateMaxLength(text, maxChars = 3000) {
        if (text && _.isString(text)) {
            return text.substring(0, maxChars);
        }
        return text;        
    }

    static getInstance() {
        if (!instance) {
            instance = new HtmlValidator();
        }
        return instance;
    }

}
export default HtmlValidator;
