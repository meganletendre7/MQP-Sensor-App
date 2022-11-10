const http = require('http'),
    fs = require('fs'),
    // IMPORTANT: run 'npm install
    mime = require('mime'),
    dir = 'public/',
    port = 3000

// Do we need this? Might need to replace with the stream
const appdata = [ ]

const server = http.createServer((request, response) => {
    if (request.method === 'GET') {
        handleGet(request, response)
    } else if (request.method === 'POST') {
        handlePost(request, response)
    } 
})

// GET: Get the web page, file, or the data
const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1)
    if (request.url === '/') {
        sendFile(response, 'public/index.html')
    } else if (request.url === '/list') {
        sendListData(response)
    } else {
        sendFile(response, filename)
    }
}

// POST: press a button
const handlePost = function (request, response) {
    let dataString = ''
    request.on('data', (data) => {
        dataString += data
    })

    request.on('end', () => {
        // Add a press to a string
        let newTask = JSON.parse(dataString)
        newTask.priority = determinePriority(newTask.creation_date, newTask.due_date)
        appdata[appdata.length] = newTask
        sendListData(response)
    })
}

const sendFile = function (response, filename) {
    const type = mime.getType(filename)

    fs.readFile(filename, function (err, content) {

        // if the error = null, then we've loaded the file successfully
        if (err === null) {

            // status code: https://httpstatuses.com
            response.writeHeader(200, {'Content-Type': type})
            response.end(content)

        } else {

            // file not found, error code 404
            response.writeHeader(404)
            response.end('404 Error: File Not Found')

        }
    })
}

server.listen(process.env.PORT || port)