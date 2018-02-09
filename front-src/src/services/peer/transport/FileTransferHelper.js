export const CHUNK_SIZE = 16384;
// export const CHUNK_SIZE = 16;

class FileTransferHelper {
    _fileModel;
    _file;
    _fileName = '';
    _fileSize = 1;
    _peer;

    constructor(fileModel) {
        if (fileModel) {
            this._file = fileModel.fileRef;
            this._fileModel = fileModel;
            this._fileName = fileModel.name;
            this._fileSize = fileModel.size;
        }
    }

    initTransfer(peer) {
        if (!this._file) {
            return;
        }
        this._peer = peer;
        this.sliceFile(0);
    }

    sliceFile(offset) {
        var reader = new window.FileReader();
        reader.onload = (() => {
            return (e) => {
                this._peer.sendFile(e.target.result);
                if (this._file.size > offset + e.target.result.byteLength) {
                    setTimeout(() => {
                        this.sliceFile(offset + CHUNK_SIZE);
                    }, 0);
                }
                let progress = offset + e.target.result.byteLength;
                console.log('PROGRESS>>> ', progress === this._fileSize);
                if (progress === this._fileSize) {
                    // send close signal
                }
            };
        })(this._file);
        var slice = this._file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);     
    }
}

export default FileTransferHelper;
