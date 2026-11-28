/** 
 * 注意本电脑版本旧，需要安装固定版本yjs和y-websocket
 * npm i yjs@13.6.33 y-websocket@1.5.4
 * 两个浏览器窗口共用一个 Y.Doc，用 y-websocket 连一个极简同步服务（只转
发，不存）
项目根目录下运行node ./node_modules/y-websocket/bin/server.js，启动y-websocket服务，默认端口是1234.
如果执行node ./node_modules/y-websocket/bin/server.js默认启动的端口是1234.如果想用端口8080就执行 PORT=8080 node ./node_modules/y-websocket/bin/server.js
shapes（Y.Map：图形 id → 一个图形）
  "shape-1" → { type: "rect", x: 20, y: 30, width: 100, height: 60, color: "红", createdBy: "A" }
  "shape-2" → { type: "circle", x: 150, y: 80, width: 80, height: 80, color: "蓝", createdBy: "B" }

shapeOrder（Y.Array：图形 id 的顺序）
  ["shape-1", "shape-2"]

awareness（每人自己的状态，不进文档）
  A: { name: "A", color: "红" }
  B: { name: "B", color: "蓝" }

文档里的两个：shapes 是图形内容，shapeOrder 是显示顺序。

文档外的一个：awareness 是在线用户，临时状态，不进文档。
    const shapeList = [{
        id: 'shape-1',
        type: 'rect',
        x: 20,
        y: 30,
        width: 100,
        height: 60,
        color: 'red',
        createBy: 'A'
    }, {
        id: 'shape-2',
        type: 'circle',
        x: 150,
        y: 80,
        width: 80,
        height: 80,
        color: 'blue',
        createBy: 'B'
    }]
*/
import { Button } from 'antd';
import { useState, useEffect, useMemo, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

import styles from '@/styles/whiteboard.module.css';

const wsLink = 'ws://localhost:8080';
const roomName = 'my-room';
const initUser = {
    id: '',
    name: '',
    color: ''
}
const initColor = ['red', 'blue', 'green'];
const id = Date.now();
const info = {
    id: id,
    name: `访客${id.toString().slice(-6)}`,
    color: initColor[Math.floor(Math.random()*initColor.length)]
}

export default function CollaborativeEg() {
    const [myInfo, setMyInfo] = useState(initUser)
    const [linkStatus, setLinkStatus] = useState(false);
    const [ymapData, setYmapData] = useState(null);
    const [userList, setUserList] = useState([]);
    const wsProviderRef = useRef(null);
    const ymapRef = useRef(null);
    const undoManagerRef = useRef(null);

    useEffect(() => {
        if (!localStorage.getItem('myInfo')) {
            localStorage.setItem('myInfo', JSON.stringify(info));
            setMyInfo(info);
        } else {
            setMyInfo(JSON.parse(localStorage.getItem('myInfo')));
        }
    }, [])

    useEffect(() => {
        const ydoc = new Y.Doc();
        const ymap = ydoc.getMap('myRoom');
        ymapRef.current = ymap;
        ymap.observe((YMapEvent, Transaction) => {
            console.log('检测到ymap变化了...', ymap);
            const yShape = ymap.toJSON();
            setYmapData(yShape);
        })

        const undoManager = new Y.UndoManager(ymap);
        undoManagerRef.current = undoManager;

        const wsProvider = new WebsocketProvider(wsLink, roomName, ydoc);
        wsProviderRef.current = wsProvider;

        wsProvider.on('status', event => {
            console.log('wsProvider status is:', event.status);
            if (event.status === 'connected') {
                setLinkStatus(true);
            }
        })

        const awareness = wsProvider.awareness;
        awareness.on('change', changes => {
            // console.log('awareness:', Array.from(awareness.getStates().values()));
            // console.log('changes:', changes);
            let _users = Array.from(awareness.getStates().values());
            setUserList(_users);
        })
        if (myInfo.id) {
            awareness.setLocalStateField('user', myInfo);
        }
     
        return () => {
            // console.log('回收处理，销毁socket等');
            wsProvider.destroy();
            ydoc.destroy();
            setLinkStatus(false);
        }
    }, [myInfo])

    const ulList = useMemo(() => {
        if (!ymapData) return [];
        let _list = [];
        // console.log('ymapData:', ymapData.doc.clientID)
        for (let item in ymapData) {
            console.log('item:', ymapData[item]);
            _list.push(ymapData[item]);
        }
        return _list;
    }, [ymapData])

    const addRectHandle = () => {
        // console.log('加矩形...')
        // console.log('addRectHandle ymap:', ymapRef.current);
        let _graphId = `graph-rect-${Date.now()}`;
        let addShapeItem = {
            graphId: _graphId,
            type: 'rect',
            x: 20 + Math.random() * 100,
            y: 30 + Math.random() * 100,
            width: 100,
            height: 60,
            color: myInfo.color,
            createBy: myInfo.name
        }
        ymapRef.current.set(_graphId, addShapeItem)
        // console.log('ymap2:', ymapRef);
    }

    const addCircleHandle = () => {
        console.log('加圆形...')
        let _graphId = `graph-circle-${Date.now()}`;
        let addShapeItem = {
            graphId: _graphId,
            type: 'circle',
            x: 150 + Math.random() * 100,
            y: 80 + Math.random() * 100,
            width: 80,
            height: 80,
            color: myInfo.color,
            createBy: myInfo.name
        }
        ymapRef.current.set(_graphId, addShapeItem)
    }

    const undoHandle = () => {
        console.log('撤销...');
        undoManagerRef.current.undo();
    }

    const redoHandle = () => {
        console.log('重做...');
        undoManagerRef.current.redo();
    }

    const clearHandle = () => {
        console.log('清空...');
        ymapRef.current.clear();
    }

    const deleteHandle = (event, graphId) => {
        console.log('删除图形id:', graphId);
        ymapRef.current.delete(graphId)
    }

    return (
        <div className={styles.container}>
            <p>这是多人协作小例子</p>
            <div className={styles.content}>
                <p className={styles.pmsg}>
                    <span>房间:{roomName}</span>
                    <span>状态：{linkStatus ? '已连接' : '已断开'}</span>
                </p>
                <p className={styles.pmsg}>
                    <span>我的名字：{myInfo?.name || ''}</span>
                    <span>我的颜色：
                        {myInfo.id && <b style={{'color': myInfo.color }}>{myInfo.color}</b>}
                    </span>
                </p>
            </div>
            <div className={styles.content}>
                在线用户
                <ul className={styles.onlinelist}>
                    {userList.map(item => (
                        (item.user && (<li key={item.user.id}>
                            <span style={{'color': item.user.color}}>{item.user.name} ({item.user.color})</span>
                        </li>))
                    ))}
                </ul>
            </div>
            <div className={styles.content}>
                <p>操作按钮</p>
                <Button onClick={addRectHandle}>加矩形</Button>
                <Button onClick={addCircleHandle}>加圆形</Button>
                <Button onClick={undoHandle}>撤销</Button>
                <Button onClick={redoHandle}>重做</Button>
                <Button onClick={clearHandle}>清空数据</Button>
            </div>
            <div className={styles.content}>
                <p>图形列表</p>
                {ulList.map(item => (
                    <li key={item.graphId} className={styles.ullist}>
                        <p>
                            <span>{item.type}</span>
                            <span className={styles.septag}>|</span>
                            <span style={{'color': item.color}}>{item.color}</span>
                            <span className={styles.septag}>|</span>
                            <span>{item.createBy}加的</span>
                        </p>
                        <span className={styles.delBtn} onClick={event => deleteHandle(event, item.graphId)}>删除</span>
                    </li>
                ))}
            </div>
        </div>
    )
}