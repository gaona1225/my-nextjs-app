/**
 * Hocuspocus 是基于 Yjs 的 WebSocket 同步服务器(TypeScript，跑在 Node.js 上)
 * Yjs 只管同步算法、不管服务器; Hocuspocus 把“接 WebSocket、按房间分文档、持久化”这些现成的事都包了，不 用自己写。注意:Hocuspocus 是现成开源包，做好了 WebSocket 通信 + Yjs 同步 + 光标广播 + 房间管理;
 */

const { Server } = require('@hocuspocus/server');

Server.configure({
    onConnect: data => {
        console.log('room connected, room name is:', data.documentName);
        // console.log(data);
    },
    onLoadDocument: data => {
        console.log('onLoadDocument:', data.documentName);
    },
    onStoreDocument: data => {
        console.log('user count:', data.clientsCount)
        console.log('save doc:', data.document)
    },
    onDisconnect: data => {
        console.log('room disconnect')
    }
})

Server.listen(1234); // 不传，默认端口是80