/**
 * 执行npm run server，启动websocket服务ws://localhost:8080。
 * 然后观察命令行可以看到socket.js里的运行过程。
 */
const {WebSocketServer} = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    console.log('服务端消息：客户端已连接');
    
    ws.on('message', msg => {
        console.log('服务端消息：服务端收到消息：', msg.toString());
        ws.send(msg);
    })

    ws.on('close', () => {
        console.log('服务端消息：客户端已断开');
    })

    ws.on('error', err => {
        console.log('服务端消息：客户端连接失败:', err);
    })
});
