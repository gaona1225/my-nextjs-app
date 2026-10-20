import { useState, useEffect } from "react";
import Link from "next/Link";
import { Table, Spin, Space, message, Popconfirm } from 'antd';

export default function List() {
    interface DataType {
        key: string;
        name: string;
        age: number;
        address: string;
    }

    const [loadFlag, setLoadFlag] = useState(true);
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
                message.success(_data.msg);
                getData();
            } else {
                message.error('delete fail')
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
        render: (_: any, record: DataType) => 
        (<Space><Link href={`/company/modify?id=${record.key}`}>Edit</Link>
            <Popconfirm
                title="Delete this company?"
                description="This cannot be undone."
                onConfirm={() => handlerDelete(record)}
                okText="Delete"
                cancelText="Cancel"
            >
                <a>Delete</a>
            </Popconfirm>
    </Space>),
    }];

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            {loadFlag ? <Spin fullscreen={true} />
            : <Table
            columns={columns}
            dataSource={dataList}
            />}
        </div>
    )
}