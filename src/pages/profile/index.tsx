import React from "react";
import { Form, Input, Radio, DatePicker, Tabs, Button } from "antd";
import UploadAvatar from "../../components/upload-avatar";
import "./index.css";

function Profile() {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <Tabs
      defaultActiveKey="1"
      onChange={onChange}
      items={[
        {
          label: `Profile`,
          key: "1",
          children: (
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              layout="horizontal"
              className="form-wrapper"
            >
              <Form.Item label="Avatar" valuePropName="avatar">
                <UploadAvatar />
              </Form.Item>
              <Form.Item label="Email">
                <Input placeholder="Ex: abc@gmail.com" />
              </Form.Item>
              <Form.Item label="Full name">
                <Input placeholder="Ex: John Smith" />
              </Form.Item>
              <Form.Item label="Phone number">
                <Input maxLength={10} placeholder="Ex: 0123456789" />
              </Form.Item>
              <Form.Item label="Gender">
                <Radio.Group>
                  <Radio value="male"> Male </Radio>
                  <Radio value="female"> Female </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Date of birth">
                <DatePicker />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
                <Button type="primary" htmlType="submit">
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          )
        },
        {
          label: `Security`,
          key: "2",
          children: (
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              layout="horizontal"
              className="form-wrapper"
            >
              <Form.Item label="Current password">
                <Input.Password />
              </Form.Item>
              <Form.Item label="New password">
                <Input.Password />
              </Form.Item>
              <Form.Item label="Re-enter new password">
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
                <Button type="primary" htmlType="submit">
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          )
        }
      ]}
    />
  );
}

export default Profile;
