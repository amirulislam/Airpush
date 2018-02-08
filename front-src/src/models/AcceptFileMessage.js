import { SOCKET_MESSAGE_TYPES } from '../config';
import shortid from 'shortid';
import Storage from '../utils/Storage';
import User from '../models/User';

class AcceptFileMessage {
    
    constructor(fileModel, type = SOCKET_MESSAGE_TYPES.ACCEPT_FILE_MESSAGE) {
        this._id = shortid.generate();
        this.fileModel = fileModel;
        this.type = type;
        this.user = new User(Storage.getUser());
        this.isActive = true;
    }
}
export default AcceptFileMessage;
