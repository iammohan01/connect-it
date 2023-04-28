const express = require('express')
const app = express()
const ClipboardListener = require('clipboard-listener');
const webSocket = require("ws");
const server = require("http").createServer(app);
const path = require('path');
const handler = require('serve-handler');
const Connections = new Map();

const listener = new ClipboardListener({
    timeInterval: 1000, // Default to 250
    immediate: true, // Default to false
});
listener.on('change', value => {
    //   console.log(value);
    console.log("Value changed");
});

// console.log(server);
const wss = new webSocket.Server({ server: server ,path: '/123'});
wss.on('connection', function connection(ws, req, client) {

    const clientId  = req.headers['sec-websocket-key'];
    Connections.set(clientId,ws);

    ws.on('message', function incoming(message) {
       console.log("got new message");
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                
                client.send(message);

            }
        });

    });
});

app.use((req, res) => {
    // express.static(path.join(__dirname, ''));
    // console.log(express.static(path.join(__dirname, '')));
    handler(req, res);
    console.log('====================================');
    console.log("client request");
    console.log('====================================');
})
server.listen(3001)