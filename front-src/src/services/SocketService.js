import io from 'socket.io-client';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';

let instance;
class SocketService {
    _isConnected = false;
    _socket;

    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
    }

    connect() {
        if (this._isConnected) {
            return;
        }
        console.log('connect now');
        const uri = `${window.location.protocol}//${window.location.host}`;
        this._socket = io(uri, {
            transports: ['websocket'],
            query: {
                x__authorization: StorageUtils.getToken(),
                join_room: ''
            }
        });
        this._socket.on('connect', () => {
            console.log('connected!');
            this._isConnected = true;
            this._socket.emit('greet', { message: 'Hello Mr.Server!' });
        });

        this._socket.on('disconnect', () => {
            this._isConnected = false;
            console.log('Disconnected!');
        });
          
        this._socket.on('respond', (data) => {
            console.log(data);
        });
        this._socket.on('error', err => {
            console.log('Errror', err);
        });                
    }

    // disconnect socket
    disconnect() {
        if (!this._isConnected) {
            return;
        } 
        this._socket.disconnect();
        this._isConnected = false;
        console.log('Disconnect socket');
    }

    send() {
        if (!this._isConnected) {
            return;
        }         
        this._socket.emit('greet', { message: 'Hello Mr.Server!' });
    }

    static getInstance() {
        if (!instance) {
            instance = new SocketService();
        }
        return instance;
    }
}
export default SocketService;
