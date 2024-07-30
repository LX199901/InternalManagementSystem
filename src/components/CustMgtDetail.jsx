import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal } from 'antd';
import CustMgtDetailForm from './CustMgtDetailForm';
import './CustMgt.css';


const KokyakukanriDetail  = () => {
  const { customerId } = useParams();
  const [customerDetail, setCustomerDetail] = useState([]);
  const [contacts, setContacts] = useState([]);
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
  const [contactError, setContactError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      const response = await axios.post('http://localhost:8080/CustMgt/customers', values);
      if (response.status === 200) {
        setIsModalVisible(false);
        // fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  useEffect(() => {

    const fetchCustomerDetail  = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/CustMgt/customers/${customerId}`)
        console.log(response.data); 

        if (response.status === 200) {
          setCustomerDetail(response.data);
          setBusinessError('');
        } else {
          setCustomerDetail(null);
          setBusinessError(response.data.error);
          setError(new Error(`Unexpected status code: ${response.status}`));
        }

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCustomerDetail(null);
          console.log('顧客が存在しないようです。');
          navigate('/react/CustMgt'); 
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchContacts = async () => {
      try {
        const responseContacts = await axios.get(`http://localhost:8080/CustMgt/contacts/${customerId}`)
        console.log(responseContacts.data); 

        if (responseContacts.status === 200) {
          const contactsData = responseContacts.data;
          setContacts(Array.isArray(contactsData) ? contactsData : [contactsData]);
          setContactError('');
          console.log(`(200)contactError = ${contactError}`)
        } else {
          setContacts([]);
          // setBusinessError(responseContacts.data.error);
          setContactError('責任者が存在しないようです。');
          setError(new Error(`Unexpected status code: ${responseContacts.status}`));
          console.log(`(200else)contactError = ${contactError}`)
        }
        
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setContacts([]);
          setContactError('責任者が存在しないようです。');
          console.log(`(404)contactError = ${contactError}`)
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }


    fetchCustomerDetail ();
    fetchContacts();
  }, [customerId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="kokyaku-kanri search-label">
      <h2>顧客管理</h2>
      {/* {businessError && <p className="error-message">{businessError}</p>} */}
      <div className="search-bar">
        <div className="condition-and-createBtn">
          <h4>詳細情報</h4>
        </div>
        <div>
          <div className='kokyaku-info'>
          {customerDetail ? (
            <table>
              <tbody >
                <tr >
                  <td>顧客ID</td>
                  <td>{customerDetail.customer_id}</td>
                  <td>法人番号</td>
                  <td>{customerDetail.customer_serial}</td>
                </tr>
                <tr>
                  <td>会社名</td>
                  <td>{customerDetail.customer_name}</td>
                  <td>会社電話</td>
                  <td>{customerDetail.customer_tel}</td>
                </tr>
                <tr>
                  <td>部門名</td>
                  <td>{customerDetail.customer_dep_name}</td>
                  <td>部門電話</td>
                  <td>{customerDetail.customer_dep_tel}</td>
                </tr>
                <tr>
                  <td>部門所在地</td>
                  <td colSpan={3}>{customerDetail.customer_dep_addr}</td>
                </tr>
              </tbody>
            </table>
            ) : (
              <p>顧客情報が見つかりませんでした。</p>
            )}
            <br/>
          </div>

          <div className='manage-button'>
            <Button id="btn" >顧客変更</Button>
          </div>
        </div>
      </div>
      <br />
      <div className="result-fields">
          <div>
        {customerDetail.length > 0 ? (
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
                {contacts.map(contact => (
                  <tr key={contact.contactId}>
                    <td>{contact.name}</td>
                    <td>{contact.mail}</td>
                    <td>{contact.tel}</td>
                    <td>
                      <button id="btn" >変更</button>
                    </td>
                  </tr>
                ))}
                <tr >
                  <td>contact.name</td>
                  <td>contact.mail</td>
                  <td>contact.tel</td>
                  <td>
                    <button className="control" id='contact-edit' >変更</button>
                    <button className="control" id='contact-del' >削除</button>
                  </td>
                </tr>
              </tbody>
            </table>
            ) : (
            <div className='error-message-box'><p className="error-message">{contactError}</p></div>
          )}
          <br />
            <div className='manage-button'>
              <Button onClick={showModal}>責任者追加</Button>
            </div>
            <div className='manage-button'>
              <Button id="previous" >戻る</Button>
            </div>
          </div>
      </div>
      <Modal title="責任者追加" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <CustMgtDetailForm onSubmit={handleOk} onCancel={handleCancel} customerId = {customerId}/>
      </Modal>
    </div>
  );
};


export default KokyakukanriDetail ;
