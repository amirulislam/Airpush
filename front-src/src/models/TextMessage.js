import { SOCKET_MESSAGE_TYPES } from '../config';
import shortid from 'shortid';

class TextMessage {

    constructor(user, textMessage) {
        this.user = user;
        this.textMessage = textMessage;
        this.type = SOCKET_MESSAGE_TYPES.TEXT_MESSAGE;
        this._id = shortid.generate();
    }
}
export default TextMessage;
