import { SOCKET_MESSAGE_TYPES } from '../config';
class TextMessage {
    constructor(user, textMessage) {
        this.user = user;
        this.textMessage = textMessage;
        this.type = SOCKET_MESSAGE_TYPES.TEXT_MESSAGE;
    }
}
export default TextMessage;
