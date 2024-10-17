const fs = require('fs');

const zinute = 'Labas pasauli !';

fs.writeFile('writeFile.txt', zinute, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Sėkmingai įrašiau šiuos duomenis: ' + zinute);

});