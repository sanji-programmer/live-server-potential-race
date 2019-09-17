const fs = require('fs-extra');
const liveServer = require('live-server');
const path = require('path');
const puppeteer = require('puppeteer');
const sleep = require('util').promisify(setTimeout);

const tempDir = path.join(__dirname, 'tmp');
const resDir = path.join(__dirname, 'res');

(async () => {
    //create dir - 1st time
    fs.ensureDirSync(tempDir);
    fs.copyFileSync(resDir + '/index-1.html', tempDir + '/index.html');

    const server = liveServer.start({
        root: tempDir,
        port: 4004,
        open: false
    });    

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    //Observe html file
    await page.goto('http://localhost:4004/');
    await page.screenshot({ path: '01.png' });
    let innerText = await page.evaluate(() => document.querySelector('#p1').innerText);
    if (innerText !== 'First Time')
        console.log(`Error 1: ${innerText}`);

    // Observe 404
    fs.removeSync(tempDir + '/index.html'); // only remove a file
    await sleep(500); 
    await page.screenshot({ path: '02.png' });
    
    //recreate the file
    fs.copyFileSync(resDir + '/index-2.html', tempDir + '/index.html');

    //Observe html file
    await sleep(1000); 
    await page.screenshot({ path: '03.png' });
    innerText = await page.evaluate(() => document.querySelector('#p1').innerText);
    if (innerText !== 'Second Time')
        console.log(`Error 2: ${innerText}`);

    await browser.close();
    await server.close();
    process.exit();
})();