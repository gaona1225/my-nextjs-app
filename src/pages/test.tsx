import { useState, useEffect } from "react";
import Link from "next/Link";
import Image from 'next/image';
import vercel from '../../public/vercel.svg';
import { Button } from 'antd';

export default function Test() {
    // const initData = testData();
    const [renderDone, setRenderDone] = useState(false);
    const [initInfo, setInitInfo] = useState({
        name: 'defaultName',
        count: 0,
        pid: 'defaultPid'
    });
    useEffect(() => {
        setRenderDone(true)
    }, []);
    useEffect(() => {
        if (renderDone) {
            const initData = async () => {
                try {
                    const data = await fetch('/api/hello?count=10&pid=test');
                    console.log('data:', data);
                    if (data.ok) {
                        const resp = await data.json();
                        console.log('data.json resp:', resp, '===typeof resp:', typeof(resp), '===name:', resp.name);
                        setInitInfo(resp);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            initData();
        }
    }, [renderDone]);

    // getInfo
    useEffect(() => {
        const initData = async () => {
            try {
                const data = await fetch('/api/hello', {method: 'post'});
                console.log('data:', data);
                if (data.ok) {
                    const resp = await data.json();
                    console.log('post request data.json resp:', resp, '===typeof resp:', typeof(resp));
                }
            } catch (e) {
                console.log(e);
            }
        }
        initData();
    })
    return (
        (initInfo.count > 0) ? 
            <div>
                <p>Good Luck {initInfo.name}!</p>
                <p>you came here {initInfo.count} times.</p>
                <p>pid is {initInfo.pid}.</p>
                <Link href="/" style={{color: "red"}}>Link to Home</Link>
                {/* <Image src={vercel} alt="vercel" width={100} height={100} priority />
                <Image src="/dragon.png" alt="dragon" width={100} height={100} priority /> */}
                <div><Button type="primary">Button</Button></div>
            </div>
        : <div style={{display: 'none'}}></div>
    )
}