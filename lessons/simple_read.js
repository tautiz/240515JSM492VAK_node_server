const fs = require('fs');

fs.readFile('simple.txt', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data.toString());
});