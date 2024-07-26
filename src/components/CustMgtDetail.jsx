import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustMgt.css';

const Kokyakukanri = ({customerId = 1}) => {
  const [customers, setCustomers] = useState([]);
  // const [contacts, setcontacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [paramCustomerId, setParamCustomerId] = useState('');
  // const [paramCustomerName, setParamCustomerName] = useState('');
  // const [paramCustomerSerial, setParamCustomerSerial] = useState('');
  // const [paramCustomerDepName, setParamCustomerDepName] = useState('');
  // const [paramCustomerTel, setParamCustomerTel] = useState('');
  // const [paramCustomerDepTel, setParamCustomerDepTel] = useState('');
  // const [paramCustomerDepAddr, setParamCustomerDepAddr] = useState('');
  // const [paramRegEmpId, setParamRegEmpId] = useState(''); //register_employee_id
  const [businessError, setBusinessError] = useState('');

  const buildUrlWithParams = () => {
    const baseUrl = `http://localhost:8080/CustMgt/customers/${customerId}`;
    return `${baseUrl}`;
  };

  // const fetchContacts = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8080/react/WorkHourList', {
  //       params: {
  //         // name: paramName,
  //         // birthday: paramBirthday
  //       }
  //     });

  //     if (response.data.error) {
  //       setBusinessError(response.data.error);
  //       setcontacts([]);
  //     } else {
  //       setcontacts(response.data.results);
  //       setBusinessError('');
  //     }

  //     setLoading(false);
  //   } catch (err) {
  //     setError(err);
  //     setLoading(false);
  //   }
  // };

  const fetchCustomers = async () => {
    try {
      const url = buildUrlWithParams();
      const response = await axios.get(url)
      console.log(response.data); 

      if (response.status === 200) {
        const customerData = response.data;
        setCustomers(Array.isArray(customerData) ? customerData : [customerData]);
        setBusinessError('');
      } else {
        setCustomers([]);
        setBusinessError(response.data.error);
        setError(new Error(`Unexpected status code: ${response.status}`));
      }

      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setCustomers([]);
        setBusinessError('検索に一致する顧客は見つかりませんでした。');
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(false);
  }

  useEffect(() => {
    fetchCustomers();
    fetchContacts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="kokyaku-kanri">
      <h2>顧客管理</h2>
      {businessError && <p className="error-message">{businessError}</p>}
      <div className="search-bar">
        <div>
          <h4>詳細情報</h4>
        </div>
        <div>
          <div className='kokyaku-info'>
            <table>
              {customers.map(customer => (
              <tbody>
                <tr >
                  <td>顧客ID</td>
                  <td>{customer.customer_id}</td>
                  <td>法人番号</td>
                  <td>{customer.customer_serial}</td>
                </tr>
                <tr>
                  <td>会社名</td>
                  <td>{customer.customer_name}</td>
                  <td>会社電話</td>
                  <td>{customer.customer_tel}</td>
                </tr>
                <tr>
                  <td>部門名</td>
                  <td>{customer.customer_dep_name}</td>
                  <td>部門電話</td>
                  <td>{customer.customer_dep_tel}</td>
                </tr>
                <tr>
                  <td>部門所在地</td>
                  <td colSpan={3}>{customer.customer_dep_addr}</td>
                </tr>
              </tbody>
              ))}
            </table>
            <br/>
          </div>

          <div className='manage-button'>
            <button id="btn" onClick={fetchContacts}>顧客変更</button>
          </div>
        </div>
      </div>
      <br />
      <div className="result-fields">
        {customers.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>責任者氏名</th>
                  <th>メール</th>
                  <th>連絡電話</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {/* {contacts.map(contact => (
                  <tr key={contact.contactId}>
                    <td>{contact.name}</td>
                    <td>{contact.mail}</td>
                    <td>{contact.tel}</td>
                    <td>
                      <button id="btn" onClick={fetchContacts}>変更</button>
                    </td>
                  </tr>
                ))} */}
                <tr >
                  <td>contact.name</td>
                  <td>contact.mail</td>
                  <td>contact.tel</td>
                  <td>
                    <button className="control" id='contact-edit' onClick={fetchContacts}>変更</button>
                    <button className="control" id='contact-del' onClick={fetchContacts}>削除</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <div className='manage-button'>
              <button id="btn" onClick={fetchContacts}>責任者追加</button>
            </div>
            <div className='manage-button'>
              <button id="previous" onClick={fetchContacts}>戻る</button>
            </div>
          </div>
          ) : (
            <div className='error-message-box'><p className="error-message">{businessError}</p></div>
          )}
      </div>
    </div>
  );
};

export default Kokyakukanri;
