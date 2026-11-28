/**
 * 执行npm run server，启动websocket服务ws://localhost:8080。
 * 然后观察命令行可以看到socket.js里的运行过程。
 */
import { Form, Input, Button } from 'antd';
import {useState, useEffect, useRef} from 'react';

const wsLink = 'ws://localhost:8080';
export default function WebsocketEg() {
    const [linkStatus, setLinkStatus] = useState(false);
    const [msg, setMsg] = useState('');
    const [ulList, setUlList] = useState([]);
    const socketRef = useRef(null);
    const connectSocket = () => {
        const socket = new WebSocket(wsLink);
        socketRef.current = socket;

        socket.addEventListener('open', event => {
            // console.log('客户端消息：服务连接上了:', event);
            setLinkStatus(true);
        })

        socket.addEventListener('message', async event => {
            console.log('客户端消息：服务端发来消息', event);
            // setUlList(list => JSON.parse(event.data))
            let msg = '';
            if (typeof event.data === 'string') {
                msg = event.data;
            } else if (event.data instanceof Blob) {
                msg = await event.data.text();
            } else {
                return;
            }
            try {
                setUlList(list => JSON.parse(msg))
            } catch(e) {
                console.log('error:', e);
            }
        })

        socket.addEventListener('close', event => {
            console.log('客户端消息：服务关闭了:', event);
            setLinkStatus(false);
        })
    }
    useEffect(() => {
        connectSocket();
        return () => {
            const socket = socketRef.current;
            if (!socket) return;
            socket.close();
        }
    }, [])
    const keyupHandle = event => {
        // console.log('keyupHandle:', event.target.value);
        setMsg(event.target.value);
    }
    const clickHandle = () => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        let _newList = [...ulList, msg];
        socket.send(JSON.stringify(_newList));
    }

    const optionHandle = () => {
        if (linkStatus) {
            console.log('关闭连接')
            const socket = socketRef.current;
            if (!socket || socket.readyState !== WebSocket.OPEN) return;
            socket.close();
        } else {
            console.log('重新连接');
            connectSocket();
        }
    }

    return (
        <div style={{'margin': '16px'}}>
            <p>这一页展示websocket示例,当前连接状态<span style={linkStatus ? {'color': 'green'} : {'color': 'red'}}>{linkStatus ? '已连接' : '已断开'}</span></p>
            <Form style={{'display': 'flex'}}>
                <Form.Item
                    label="Message"
                    name="message"
                    rules={[{ required: true, message: "Please input message!" }]}
                    >
                    <Input placeholder = "Please input the message" onKeyUp={keyupHandle} />
                </Form.Item>
                <Button type="primary" onClick={clickHandle} style={{'marginLeft': '6px'}}>
                    Send
                </Button>
                <Button onClick={optionHandle} style={{'marginLeft': '6px'}}>
                    {linkStatus ? '断开' : '重连'}
                </Button>
            </Form>
            <ul>
                {ulList.map((item, index) => (<li key={index}>{item}</li>))}
            </ul>
        </div>
    )
}