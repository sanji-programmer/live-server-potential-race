const fs = require('fs')

function resetPage(filepath) {
    let content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Live-server Test Page</title>
        <link rel="stylesheet" href="style.css" />
    </head>
    <body>
        <h1 id="h1">Hello world</h1>
        <p>Edit my css for a live-reload without refreshing.</p>
    </body>
    </html>    
    `
    fs.writeFileSync(filepath, content)
}

function modifyPage(filepath, src, tgt) {
    let content = fs.readFileSync(filepath, 'utf-8')
    content = content.replace(src, tgt)
    fs.writeFileSync(filepath, content)
}

module.exports = { resetPage, modifyPage }