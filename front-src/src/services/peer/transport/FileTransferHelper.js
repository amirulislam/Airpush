import { createWriteStream, supported as SupportsStreamSave, version } from '../../files/FileStreamService';
import _ from 'lodash';

export const CHUNK_SIZE = 16384;
// export const CHUNK_SIZE = 60000;

class FileTransferHelper {
    _fileModel;
    _file;
    _fileName = '';
    _fileSize = 1;
    _fileStream;
    _peer;
    _receivedSize = 0;
    _writer;

    constructor(fileModel, isReader = false) {
        if (fileModel) {
            this._file = fileModel.fileRef;
            this._fileModel = fileModel;
            this._fileName = fileModel.name;
            this._fileSize = fileModel.size;
            if (isReader) {
                this._fileStream = createWriteStream(fileModel.name, fileModel.size);
                this._writer = this._fileStream.getWriter();
            }
        }
    }

    initTransfer(peer) {
        if (!SupportsStreamSave) {
            return;
        }
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
                let percent = Math.round((progress * 100) / this._fileSize);

                console.log('PROGRESS>>> ', percent);
                if (progress >= this._fileSize) {
                    // send close signal
                    // this._peer.send(JSON.stringify({
                    //     type: 'END'
                    // }));
                }
            };
        })(this._file);
        var slice = this._file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);     
    }

    read(data) {
        console.log('READ DATA >>>> ');
        if (data && data.byteLength) {
            this._receivedSize += data.byteLength;
        }
        // if (!_.isString(data)) {
        //     this._writer.write(data);
        // }
        this._writer.write(data);
        if (this._receivedSize === this._fileSize) {
            // end here
            console.log('END ', this._receivedSize);
            try {
                this._writer.close();
            } catch (err) {
                console.log(err);
            }
        }
        // if (_.isString(data)) {
        //     try {
        //         let json = JSON.parse(data);
        //         if (json && json.type === 'END') {
        //             console.log('END');
        //             // distory
        //         }

        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
    }
}

export default FileTransferHelper;
