import BaseModel from './BaseModel';
class User extends BaseModel {
    constructor(user) {
        super(user, {
            excludeProps: ['token', 'email', 'role']
        });
    }
}
export default User;