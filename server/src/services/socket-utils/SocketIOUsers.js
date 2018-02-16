let instance;
const UNIQUE_SIGNATURE = 'sahdiosd238u23u*&';
class SocketIOUsers {

    _users = {};

    constructor(signature) {
        if (signature !== UNIQUE_SIGNATURE) {
            throw new Error('You can not instantiate like this');
        }
    }

    addUser(user) {
        if (user && !this.userExists(user)) {
            this._users[user._id] = user;
            console.log('user added');
            this._logAllUsers();
            return user;
        }
        return false;
    }

    removeUser(user) {
        if (this.userExists(user)) {
            delete this._users[user._id];
            console.log('user removed')
            this._logAllUsers();
        }
    }

    userExists(user) {
        console.log('TESTTTTTT', this.test);
        if (!user) {
            return false;
        }
        const userExists = this._users[user._id] ? this._users[user._id] : false;
        return userExists;
    }    

    removeAll() {
        this._users = {};
    }

    // for testing purposes
    _logAllUsers() {
        console.log('\n\n\n\n\nUsers :::>>>', this._users, '\n END Users :::>>>\n\n\n\n');
    }

    static getInstance(test) {
        if (!instance) {
            instance = new SocketIOUsers(UNIQUE_SIGNATURE);
            instance.test = test;
        }
        return instance;
    }
}
export default SocketIOUsers;
