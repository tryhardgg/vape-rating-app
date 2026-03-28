const https = require('https');
const fs = require('fs');
const path = require('path');

// Список вкусов Monster Vapor с возможными URL
// Формат URL: https://www.brusko-world.com/media/products/...
const flavors = [
    {name:'Barawolf', file:'Barawolf.svg'},
    {name:'Barbahybrid', file:'Barbahybrid.svg'},
    {name:'Baba Banana', file:'Baba_Banana.svg'},
    {name:'Banampus', file:'Banampus.svg'},
    {name:'Berry Jack', file:'Berry_Jack.svg'},
    {name:'Big Foot Cola', file:'Big_Foot_Cola.svg'},
    {name:'Crappbie', file:'Crappbie.svg'},
    {name:'Currummy', file:'Currummy.svg'},
    {name:'Grape Cola', file:'Grape_Cola.svg'},
    {name:'Grapeena', file:'Grapeena.svg'},
    {name:'Grapefruit Raspberry', file:'Grapefruit_Raspberry.svg'},
    {name:'Ifritus', file:'Ifritus.svg'},
    {name:'Jotun Pine', file:'Jotun_Pine.svg'},
    {name:'Kiwi Apple', file:'Kiwi_Apple.svg'},
    {name:'Leshberry', file:'Leshberry.svg'},
    {name:'Limelops', file:'Limelops.svg'},
    {name:'Mango King', file:'Mango_King.svg'},
    {name:'Cola Kong', file:'Cola_Kong.svg'},
    {name:'Cola Lemon', file:'Cola_Lemon.svg'},
    {name:'Mankicore', file:'Mankicore.svg'},
    {name:'Manoraur', file:'Manoraur.svg'},
    {name:'Neelhu', file:'Neelhu.svg'},
    {name:'Peachansi', file:'Peachansi.svg'},
    {name:'Pinchezilla', file:'Pinchezilla.svg'},
    {name:'Snakelon', file:'Snakelon.svg'},
    {name:'Straw Fogler', file:'Straw_Fogler.svg'},
    {name:'Straw Gona', file:'Straw_Gona.svg'},
    {name:'Strawberry Grape', file:'Strawberry_Grape.svg'},
    {name:'Tropirus', file:'Tropirus.svg'},
    {name:'Watercream', file:'Watercream.svg'},
    {name:'Apple Cranberry', file:'Apple_Cranberry.svg'},
    {name:'Hypnocrank', file:'Hypnocrank.svg'},
    {name:'Catrula', file:'Catrula.svg'},
    {name:'Strawnergy Things', file:'Strawnergy_Things.svg'}
];

const outputDir = path.join(__dirname, 'images', 'monster-vapor');

// Базовый URL для изображений (попробуем разные варианты)
const baseUrls = [
    'https://www.brusko-world.com/media/products/monstervapor/',
    'https://brusko-world.com/media/products/monstervapor/',
];

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(true);
                });
            } else {
                file.close();
                fs.unlink(filepath, () => {});
                resolve(false);
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            resolve(false);
        });
    });
}

async function downloadAll() {
    console.log('Начинаю загрузку изображений...\n');
    
    for (const flavor of flavors) {
        const filepath = path.join(outputDir, flavor.file.replace('.svg', '.jpg'));
        
        // Пробуем разные варианты названий файлов
        const possibleNames = [
            `${flavor.name}.jpg`,
            `${flavor.name.toLowerCase()}.jpg`,
            `${flavor.name.replace(/ /g, '-')}.jpg`,
            `${flavor.name.replace(/ /g, '_').toLowerCase()}.jpg`,
        ];
        
        let downloaded = false;
        
        for (const baseUrl of baseUrls) {
            if (downloaded) break;
            
            for (const name of possibleNames) {
                if (downloaded) break;
                
                const url = baseUrl + name;
                console.log(`Пытаюсь: ${url}`);
                
                downloaded = await downloadImage(url, filepath);
                if (downloaded) {
                    console.log(`✅ Скачано: ${flavor.file.replace('.svg', '.jpg')}\n`);
                    break;
                }
            }
        }
        
        if (!downloaded) {
            console.log(`❌ Не найдено: ${flavor.name}`);
        }
    }
    
    console.log('\nГотово!');
}

downloadAll().catch(console.error);
