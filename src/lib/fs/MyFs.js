const fs = require('fs');
import {HasDirectoryInterface} from "./HasDirectoryInterface";

export class MyFs implements HasDirectoryInterface {

    prvate filePath: string;

    constructor(private directoryPath: string) {
    }

    getDirectoryPath() {
        return this.directoryPath;
    }

    createFile(string filename) {
        this.filePath = this.directoryPath + '/' + filename;
        // check if DIR exists
        if (!fs.existsSync(this.directoryPath)) {
            fs.mkdirSync(this.directoryPath);
        }
        fs.writeFileSync(this.filePath, '');
    }

    addDataTofile(data: string) {
        fs.appendFileSync(this.filePath, data);
    }
}
