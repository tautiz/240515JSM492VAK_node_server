const fs = require('fs');

const path = './simple_directory';

fs.mkdir(path, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Sukurtas ${path} katalogas`);
})