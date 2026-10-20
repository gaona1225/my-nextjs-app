import { useState, useEffect } from "react";
import Link from "next/Link";
import { Table, Spin, Alert, Space, Button } from 'antd';


export default function List() {
    interface DataType {
        key: string;
        name: string;
        age: number;
        address: string;
    }

    const [loadFlag, setLoadFlag] = useState(true);
    const [alertFlag, setAlertFlag] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [msg, setMsg] = useState('');
    const [dataList, setDataList] = useState();

    const getData = async () => {
        try {
            const data = await fetch('/api/company');
            if (data.ok) {
                const _list = await data.json();
                // console.log('_list:', _list);
                setDataList(_list);
                setLoadFlag(false);
            }
        } catch(e) {
            console.log('error:', e);
        }
    }
    useEffect(() => {
        getData()
    }, [])

    const handlerDelete = async (row: DataType) => {
        try {
            let resp = await fetch(`/api/company?id=${row.key}`, {method: 'delete'});
            if (resp.ok) {
                let _data = await resp.json();
                setMsg(_data.msg);
                setAlertType(_data.type);
                setAlertFlag(true);
                getData();
            }
        } catch (e) {
            console.log('err:', e);
        }
    }
    
    const columns = [{
        title: 'Name',
        dataIndex: 'name',
    }, {
        title: 'Founder',
        dataIndex: 'founder',
    }, {
        title: 'Year',
        dataIndex: 'year',
    }, {
        title: 'Address',
        dataIndex: 'address',
    }, {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (_: any, record: DataType) => (<Space><Link href={`/company/modify?id=${record.key}`}>Edit</Link><a onClick={() => {handlerDelete(record)}}>Delete{record.dataIndex}</a></Space>),
    }];

    const handlerAfterClose = () => {
        setAlertFlag(false);
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Company List</h2>
                <Link href="/company/create">
                    <Button type="primary">Create Company</Button>
                </Link>
            </div>

            {alertFlag &&
                <Alert style={{ marginBottom: 16 }} message={msg} type={alertType} closable={true} afterClose={handlerAfterClose} />}

            {loadFlag ? <Spin fullscreen={true} />
            : <Table
            columns={columns}
            dataSource={dataList}
            />}
        </div>
    )
}