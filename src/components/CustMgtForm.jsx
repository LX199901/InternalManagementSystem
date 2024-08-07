import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import './CustMgt.css';

const layout = {
  labelCol: { span: 5},
  wrapperCol: { offset: 0.5, span: 18 }
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const CustMgtForm = ({ onSubmit, onCancel ,employeeId, customerInfo}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (customerInfo) {
        form.setFieldsValue(customerInfo);
    } else {
        form.resetFields();
    }
  }, [customerInfo]);
  

  const handleFinish = (values) => {
    const formData = {
        ...values,
        register_employee_id: employeeId,
      };

    onSubmit(formData);
    form.resetFields();
    onCancel();
  };

  const handleReset = () => {
    form.resetFields();
  };
  
  return (
    <Form {...layout} form={form} name="customer-form" onFinish={handleFinish}>
        {/* <h4 className='form-desc'>顧客{customerInfo ? '変更' : '追加'}</h4> */}
        <h4 className='form-desc'>顧客情報</h4>
        <Form.Item
            name="customerId"
            label="顧客ID"
            rules={[{ required: false }]}
        >
            <Input 
                placeholder={customerInfo ? customerInfo.customer_id : 'システム指定'}
                disabled />
        </Form.Item>

        <Form.Item
            name="customer_name"
            label="会社名"
            rules={[{ required: true, message: '会社名をご入力ください。' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="customer_serial"
            label="法人番号"
            rules={[{ message: '法人番号は、株式会社などの法人等が持つ13桁の番号です。' }]}>
            <Input type="tel" 
                placeholder="半角数字で入力してください"
                pattern="\d{13}"
                title="正しい法人番号をご入力ください。（13桁の番号です）"
                maxLength={13}
            />
        </Form.Item>

         <Form.Item
            name="customer_tel"
            label="会社電話"
            rules={[{ required: true, message: '会社電話をご入力ください。' }]}
        >
            <Input type="tel"
                placeholder="半角数字で入力してください"
                pattern="\d{10}"
                title="正しい電話番号をご入力ください。（123 123 1234）"
                maxLength={10}
            />
        </Form.Item>
        
        <Form.Item
            name="customer_dep_name"
            label="部門名"
            rules={[{ required: true, message: '部門名をご入力ください。' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="customer_dep_tele"
            label="部門電話"
            rules={[{ message: '正しい電話番号をご入力ください。' }]}
        >
            <Input type="tel"
                placeholder="半角数字で入力してください"
                pattern="\d{10}"
                title="正しい電話番号をご入力ください。（123 123 1234）"
                maxLength={10}
            />
        </Form.Item>

        <Form.Item
            name="customer_dep_addr"
            label="部門所在地"
            rules={[{ required: true,  message: '部門所在地をご入力ください。' }]}
        >
            <Input />
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

export default CustMgtForm;
