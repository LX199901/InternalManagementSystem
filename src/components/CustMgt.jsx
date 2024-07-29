import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Tooltip, Modal } from 'antd';
import CustMgtForm from './CustMgtForm';
import './CustMgt.css';

const NumericInput = ({ value, onChange, placeholder, title, maxLength }) => {
  // const { onChange } = props;
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^\d*$/; // 修改為只允許輸入數字
    if (reg.test(inputValue) || inputValue === '') {
      onChange(inputValue);
    }
  };

  return (
    <Tooltip trigger={['focus']} placement="topLeft" overlayClassName="numeric-input">
      <Input
        {...{value, onChange:handleChange, placeholder, title, maxLength}}
      />
    </Tooltip>
  );
};

const Kokyakukanri = ({ employeeId =1002}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paramCustomerId, setParamCustomerId] = useState('');
  const [paramCustomerName, setParamCustomerName] = useState('');
  const [paramCustomerSerial, setParamCustomerSerial] = useState('');
  const [paramCustomerDepName, setParamCustomerDepName] = useState('');
  const [businessError, setBusinessError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const buildUrlWithParams = () => {
    const baseUrl = `http://localhost:8080/CustMgt/searchCustomers/${employeeId}`;
    const params = new URLSearchParams();
    if (paramCustomerId) params.append('customerId', paramCustomerId);
    if (paramCustomerName) params.append('customerName', paramCustomerName);
    if (paramCustomerSerial) params.append('customerSerial', paramCustomerSerial);
    if (paramCustomerDepName) params.append('customerDepName', paramCustomerDepName);
    return `${baseUrl}?${params.toString()}`;
  };

  const fetchCustomers = async () => {
    try {
      const url = buildUrlWithParams();
      const response = await axios.get(url)
      // console.log(response.data); 

      if (response.status === 200){
        const customerData = response.data;
        setCustomers(Array.isArray(customerData) ? customerData : [customerData]);
        setBusinessError('');
      // } else if (response.status === 404) {
      //   setCustomers([]);
      //   setBusinessError('検索に一致する顧客は見つかりませんでした。');
      } else {
        setCustomers([]);
        setBusinessError(response.data.error);
        setError(new Error(`Unexpected status code: ${response.status}`));
      }

      setLoading(false);
    } catch (err) {
      if (err.response.status === 404) {
        setCustomers([]);
        setBusinessError('検索に一致する顧客は見つかりませんでした。');
      } else {
        setError(err);
      }
    }finally {
      setLoading(false);
    }
  };

  const onClickReset = () =>     {
    console.log('onClickReset');
    setParamCustomerId('');
    setParamCustomerName('');
    setParamCustomerSerial('');
    setParamCustomerDepName('');
    setCustomers([]);
    setBusinessError('検索条件をご入力ください。');
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      const response = await axios.post('http://localhost:8080/CustMgt/customers', values);
      if (response.status === 200) {
        setIsModalVisible(false);
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="kokyaku-kanri search-label">
      <h2>顧客管理</h2>
      <div className="search-bar">
        <div className="condition-and-createBtn">
          <h4>検索条件</h4>
          <button onClick={showModal}>新規顧客</button>
        </div>
        <div>
            <table>
              <tbody>
                <tr>
                  <td>顧客ID</td>
                  <td>
                    <NumericInput
                      placeholder="顧客IDで検索"
                      title={'半角数字で入力してください'}
                      maxLength={50}
                      value={paramCustomerId}
                      onChange={(value) => setParamCustomerId(value)}
                    />
                    </td>
                  <td>法人番号</td>
                  <td>
                    {/* <Input
                      type="text"
                      placeholder="法人番号で検索"
                      showCount maxLength={13}
                      value={paramCustomerSerial}
                      onChange={(e) => setParamCustomerSerial(e.target.value)}
                    /> */}
                    <NumericInput
                      placeholder="法人番号で検索"
                      title={'法人番号は、株式会社などの法人等が持つ13桁の番号です。'}
                      maxLength={13}
                      value={paramCustomerSerial}
                      onChange={(value) => setParamCustomerSerial(value)}
                   />
                  </td>
                </tr>
                <tr>
                  <td>会社名</td>
                  <td>
                    <Input
                      type="text"
                      placeholder="会社名で検索"
                      value={paramCustomerName}
                      onChange={(e) => setParamCustomerName(e.target.value)}
                    />
                    </td>
                  <td>部門名</td>
                  <td>
                    <Input
                      type="text"
                      placeholder="部門名で検索"
                      value={paramCustomerDepName}
                      onChange={(e) => setParamCustomerDepName(e.target.value)}
                    />
                    </td>
                </tr>
              </tbody>
            </table>
          <div className='search-bar-button'>
            <button type="reset" onClick={onClickReset}>リセット</button>
            <button onClick={fetchCustomers}>検索</button>
          </div>

        </div>
      </div>
      <div className="result-fields">
        <div><h4>検索結果</h4></div>
        {businessError ? (
          <div className="error-message-box">
            <p className="error-message">{businessError}</p>
          </div>
        ) : (
          <div>
          {customers.length > 0 ? (
            <table  className='shain-ichiran' >
              <thead>
                <tr>
                  <th>顧客ID</th>
                  <th>法人番号</th>
                  <th>会社名</th>
                  <th>部門名</th>
                  <th>詳細情報</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(customers) && customers.map(customer => (
                  <tr key={customer.customer_id}>
                    <td>{customer.customer_id}</td>
                    <td>{customer.customer_serial}</td>
                    <td>{customer.customer_name}</td>
                    <td>{customer.customer_dep_name}</td>
                    <td><a href={`/react/CustMgtDetail/${customer.customer_id}`}>チェック</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='error-message-box'><p className="error-message">{businessError}</p></div>
          )}
          </div>
        )}
      </div>
      <Modal title="新規顧客" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <CustMgtForm onSubmit={handleOk} onCancel={handleCancel} />
      </Modal>
    </div>
  );
};

export default Kokyakukanri;
