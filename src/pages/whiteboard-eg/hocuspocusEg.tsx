/** 
 * 注意本电脑版本旧，需要安装固定版本hocuspocus
 * npm i @hocuspocus/server@2.15.x @hocuspocus/provider@2.15.x
 * y-websocket 自带的服务器只会原样转发，什么都干不了：不能存数据库、不能在有人进房间时做事，服务器一重启所有房间都没了。
    白板要“保存/加载”，房间得留下来，就得有地方在有人打开房间时从数据库读出来、改动时存回去。Hocuspocus 就是干这个的，它有 onConnect、onLoadDocument、onStoreDocument 这些钩子。
*/
import { Button } from 'antd';
import { useState, useEffect, useMemo, useRef } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider'

import styles from '@/styles/whiteboard.module.css';

const wsLink = 'ws://localhost:1234';
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

export default function HocuspocusEg() {
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

        const wsProvider = new HocuspocusProvider({
            url: wsLink,
            name: roomName,
            document: ydoc,
        })
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