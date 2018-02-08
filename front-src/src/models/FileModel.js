import BaseModel from './BaseModel';
import shortid from 'shortid';

class FileModel extends BaseModel {
    constructor(data, exclude = []) {
        if (!data._id) {
            data._id = shortid.generate();
        }
        super(data, exclude);
    }
    // name: file.name, size: file.size, type: file.type 
    getTransportData() {
        return {
            name: this.name, size: this.size, type: this.type, _id: this._id
        }
    }
}

export default FileModel;
