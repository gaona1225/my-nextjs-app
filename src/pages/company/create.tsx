
import { Form, Input, Button, message } from 'antd';

export default function Create() {
    interface DataType {
        key: string;
        name: string;
        age: number;
        address: string;
    }
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
                message.success(_data.msg);
                form.resetFields();
            } else {
                message.error('save fail')
            }
        } catch(e) {
            console.log('err:', e);
        }
    }
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
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
    </div>
    )
}