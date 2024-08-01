import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import './CustMgt.css';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { offset: 0.5, span: 17 }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const CustMgtDetailForm = ({ onSubmit, onCancel ,customerId, contact}) => {
  const [customerDetailForm] = Form.useForm();
  
  useEffect(() => {
    if (contact) {
        customerDetailForm.setFieldsValue(contact);
    } else {
        customerDetailForm.resetFields();
    }
  }, [contact]);

  const handleFinish = (values) => {
    const formData = {
        ...values,
        customer_id: contact?.customer_id || null,
    };

    onSubmit(formData);
    customerDetailForm.resetFields();
    // onCancel();
  };

  const handleReset = () => {
    customerDetailForm.resetFields();
    // console.log(customerDetailForm);
  };
  
  return (
    <Form {...layout} form={customerDetailForm} name="contact-form" onFinish={handleFinish}>
        {/* <h4 className='form-desc'>責任者{contact ? '変更' : '追加'}</h4> */}
        <h4 className='form-desc'>会社/部門責任者情報</h4>
        <Form.Item
            name="contact_name"
            label="責任者氏名"
            rules={[{ required: true, message: '責任者氏名をご入力ください。' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="contact_mail"
            label="責任者メール"
            rules={[{ required: true, message: '責任者メールをご入力ください。' }]}>
            <Input type="email"
                placeholder="半角で入力してください"
                title="正しいメールをご入力ください。"
            />
        </Form.Item>

        <Form.Item
            name="contact_tel"
            label="連絡電話"
            rules={[{ required: false, message: '責任者連絡電話をご入力ください。' }]}
        >
            <Input type="tel"
                placeholder="半角数字で入力してください"
                pattern="\d{10}"
                title="正しい電話番号をご入力ください。（123 123 1234）"
                maxLength={10}
            />
        </Form.Item>
        
        <Form.Item {...tailLayout}>
            <Button 
                className='form-button' 
                htmlType="button" 
                onClick={handleReset}
            >
                リセット
            </Button>
            <Button 
                className='form-button' 
                type="primary" 
                htmlType="submit" 
            >
                提出
            </Button>
        </Form.Item>
        </Form>
  );
};

export default CustMgtDetailForm;
