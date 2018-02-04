import _ from 'lodash';
class BaseModel {
    constructor(data, options = {}) {
        if (_.isNil(data) || !_.isObject(data)) {
            return;
        }
        let excludeProps = [];
        if (options) {
            if (options.excludeProps) { excludeProps = options.excludeProps};
        }
        const keys = Object.keys(data);
        for (const iterator of keys) {
            if (_.intersectionBy(excludeProps, [iterator]).length === 0) {
                this[iterator] = data[iterator];
            }
        }
    }
}
export default BaseModel;