import { useState, useEffect } from "react";
import { Form, Input, Button, Alert } from 'antd';

export default function Create() {
    interface DataType {
        key: string;
        name: string;
        age: number;
        address: string;
    }
    const [alertFlag, setAlertFlag] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [msg, setMsg] = useState('');
    const [form] = Form.useForm();
    const onFinish = async(values: DataType) => {
        // const formData = new FormData();
        // formData.append("name", values.name);
        // formData.append("founder", values.founder);
        // formData.append("year", values.year);
        // formData.append("address", values.address);
        values.key = values.name + new Date().getTime();
        try {
            const resp = await fetch('/api/company', {method: 'POST', body: JSON.stringify(values)});
            if (resp.ok) {
                let _data = await resp.json();
                setMsg(_data.msg);
                setAlertType(_data.type);
                setAlertFlag(true);
                form.resetFields();
            }
        } catch(e) {
            console.log('err:', e);
        }
    }
    const handlerAfterClose = () => {
        setAlertFlag(false);
    }
    return (
        <div>
            <Form
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
        </Form>
        {alertFlag
        ?
        <div style={{position: "fixed", top: 0, width: "90%", padding: "10px", zIndex: 10}}>
            <Alert message={msg} type={alertType} closable={true} afterClose={handlerAfterClose}/>
        </div> : null}
    </div>
    )
}