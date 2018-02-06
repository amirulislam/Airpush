import BaseModel from './BaseModel';
import _ from 'lodash';

class User extends BaseModel {
    constructor(user, exclude) {
        super(user, {
            excludeProps: _.isArray(exclude) ? exclude : ['token', 'email', 'role']
        });
    }
}
export default User;