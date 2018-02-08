import FileModel from '../../models/FileModel';

let instance;
class FileService {

    _files = [];

    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
    }

    addFile(file) {
        const fm = new FileModel({ name: file.name, size: file.size, type: file.type, fileRef: file });
        this._files.push(fm);
        return fm;
    }

    // get file by id
    getFileById(fileId) {
        let fileModel = false;
        for (let i = 0; i < this._files.length; i++) {
            if (this._files[i]._id === fileId) {
                fileModel = this._files[i];
                break;
            }
        }
        return fileModel;
    }

    static getInstance() {
        if (!instance) {
            instance = new FileService();
        }
        return instance;
    }
}
export default FileService;

