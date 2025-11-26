import { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Spin } from 'antd';

export default function Modify() {
    interface DataType {
        key: string;
        name: string;
        age: number;
        address: string;
    }

    const [form] = Form.useForm();
    const [loadFlag, setLoadFlag] = useState(true);
    const [urlId, setUrlId] = useState('');

    const getData = async () => {
        const id = location.search.split('?')[1].split('=')[1];
        setUrlId(id);
        try {
            const data = await fetch(`/api/companyDetail?id=${id}`);
            if (data.ok) {
                const _resp = await data.json();
                setLoadFlag(false);
                form.setFieldsValue({
                    name: _resp.name,
                    founder: _resp.founder,
                    year: _resp.year,
                    address: _resp.address
                })
            }
        } catch(e) {
            console.log('error:', e);
        }
    }
    useEffect(() => {
        getData()
    }, [])
    
    const onFinish = async(values: DataType) => {
        // const formData = new FormData();
        // formData.append("name", values.name);
        // formData.append("founder", values.founder);
        // formData.append("year", values.year);
        // formData.append("address", values.address);
        values.key = urlId;
        try {
            const resp = await fetch('/api/company', {method: 'PUT', body: JSON.stringify(values)});
            if (resp.ok) {
                let _data = await resp.json();
                location.href = `/company/list`;
            }
        } catch(e) {
            console.log('err:', e);
        }
    }
    return (
        <div>
            {loadFlag ? <Spin fullscreen={true} />
                : <Form
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input company's name!" }]}
                >
                <Input placehoder = "company name" />
            </Form.Item>

            <Form.Item
                label="Founder"
                name="founder"
                rules={[{ required: true, message: "Please input company's founder" }]}
                >
                <Input placehoder = "company founder" />
            </Form.Item>


            <Form.Item
                label="Year"
                name="year"
                rules={[{ required: true, message: "Please input company's year" }]}
                >
                <Input placehoder = "company year" />
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please input company's address" }]}
                >
                <Input placehoder = "company address" />
            </Form.Item>

            <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>}
        </div>
    )
}