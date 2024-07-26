import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustMgt.css';

const Kokyakukanri = ({ employeeId =1002}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paramCustomerId, setParamCustomerId] = useState('');
  const [paramCustomerName, setParamCustomerName] = useState('');
  const [paramCustomerSerial, setParamCustomerSerial] = useState('');
  const [paramCustomerDepName, setParamCustomerDepName] = useState('');
  const [businessError, setBusinessError] = useState('');

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/CustMgt/searchCustomers/${employeeId}`, {
        params: {
          customer_id: paramCustomerId,
          customer_name: paramCustomerName,
          customer_serial: paramCustomerSerial,
          customer_dep_name: paramCustomerDepName,
          // customer_tel: paramC,
          // customer_dep_tel: paramC,
          // customer_dep_addr: paramC,
          // register_employee_id: paramRegEmpId,
          // created_date: 
          // last_modified_date:
        }
      });

      // console.log(response.data); 

      if (response.data.error) {
        setBusinessError(response.data.error);
        setCustomers([]);
      } else {
        const customerData = response.data;
        setCustomers(Array.isArray(customerData) ? customerData : [customerData]);
        setBusinessError('');
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
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
    <div className="kokyaku-kanri">
      <h2>顧客管理</h2>
      {businessError && <p className="error-message">{businessError}</p>}
      <div className="search-bar">
        <div>
          <h4>検索条件</h4>
        </div>
        <div>
            <table>
              <tbody>
                <tr>
                  <td>顧客ID</td>
                  <td>
                    <input
                      type="text"
                      placeholder="顧客IDで検索"
                      value={paramCustomerId}
                      onChange={(e) => setParamCustomerId(e.target.value)}
                    />
                    </td>
                  <td>法人番号</td>
                  <td>
                    <input
                      type="text"
                      placeholder="法人番号で検索"
                      value={paramCustomerSerial}
                      onChange={(e) => setParamCustomerSerial(e.target.value)}
                    />
                    </td>
                </tr>
                <tr>
                  <td>会社名</td>
                  <td>
                    <input
                      type="text"
                      placeholder="会社名で検索"
                      value={paramCustomerName}
                      onChange={(e) => setParamCustomerName(e.target.value)}
                    />
                    </td>
                  <td>部門名</td>
                  <td>
                    <input
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
            <button id="btn" onClick={fetchCustomers}>リセット</button>
            <button id="btn" onClick={fetchCustomers}>検索</button>
          </div>

        </div>
      </div>
      <br/>
      <div className="result-fields">
        <div><h4>検索結果</h4></div>
        <div>
          <table>
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
        </div>
      </div>
    </div>
  );
};

export default Kokyakukanri;
