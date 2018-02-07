const CHUNK_SIZE = 16384;

class FileTransferHelper {
    _file;
    _peer;

    constructor(file, peer) {
        this._file = file;
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
                console.log('PROGRESS>>> ', progress);
            };
        })(this._file);
        var slice = this._file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);


        // var sliceFile = function(offset) {
        //   var reader = new window.FileReader();
        //   reader.onload = (function() {
        //     return function(e) {
        //       sendChannel.send(e.target.result);
        //       if (file.size > offset + e.target.result.byteLength) {
        //         window.setTimeout(sliceFile, 0, offset + CHUNK_SIZE);
        //       }
        //       sendProgress.value = offset + e.target.result.byteLength;
        //     };
        //   })(file);
        //   var slice = file.slice(offset, offset + CHUNK_SIZE);
        //   reader.readAsArrayBuffer(slice);
        // };        
    }
}

export default FileTransferHelper;
