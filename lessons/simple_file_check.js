const fs = require('fs');
const path = require('path');

const directoryPath = './simple_directory/sub_directory/nested_directory';
const filePath = path.join(directoryPath, 'failas.txt');

if (!fs.existsSync(directoryPath)) {
    // Create the entire directory path if it does not exist
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Katalogas "${directoryPath}" buvo sukurtas.`);
}

if (!fs.existsSync(filePath)) {
    const zinute = 'Labas pasauli !';

    fs.writeFile(filePath, zinute, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Sėkmingai įrašiau šiuos duomenis: "' + zinute + '" į failą: ' + filePath);
    });
} else {
    console.log(`${filePath} failas jau yra`);
}
