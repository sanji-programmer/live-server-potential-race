const liveServer = require('live-server');
const path = require('path');
const puppeteer = require('puppeteer');
const sleep = require('util').promisify(setTimeout);

const { resetPage, modifyPage } = require('./modify');

(async () => {
    resetPage(path.join(__dirname, 'data', 'index.html'));

    const server = liveServer.start({
        root: path.join(__dirname, 'data'),
        port: 4003,
        open: false
    });    

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:4003/');
    await page.screenshot({ path: 'example-before.png' });
    await sleep(1000); 

    modifyPage(path.join(__dirname, 'data', 'index.html'), 'Hello world', 'Ola mundo');
    await sleep(100);
    modifyPage(path.join(__dirname, 'data', 'index.html'), 'Ola mundo', 'Hej verden');

    await sleep(10000);
    await page.screenshot({ path: 'example-after.png' });
    const innerText = await page.evaluate(() => document.querySelector('#h1').innerText);
    if (innerText !== 'Hej verden')
        console.log(`Error: wrong final page: ${innerText}`);

    await browser.close();
    await server.close();
    process.exit();
})();