const fs = require('fs');

const path = './simple_directory';

if (!fs.existsSync(path)) {
    fs.mkdir(path, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Sukurtas ${path} katalogas`);
    })
} else {
    console.log(`${path} katalogas jau yra`);
}


