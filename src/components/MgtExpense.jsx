import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './MgtExpense.css';
import '../assets/css/global.css';
import { Pagination } from 'antd';


const ExpenseList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paramName, setParamName] = useState('');
  const [paramFirstDay, setParamFirstDay] = useState('');
  const [paramLastDay, setParamLastDay] = useState('');
  const [init, setInit] = useState('');
  const [departmentList, setDepartmentList] = useState('');
  const [paramDepartment, setParamDepartment] = useState('');
  const [positionList, setPositionList] = useState('');
  const [paramPosition, setParamPosition] = useState('');
  const [statusList, setStatusList] = useState('');
  const [paramState, setParamState] = useState('');
  const [businessError, setBusinessError] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();


  const showTotal = (total) => ` 合計件数 ${total}`;

  //排序键 -- 因为对象的键在JavaScript是无序的，所以使用Object.entries()遍历对象时
  //键的顺序不一定是按照插入的顺序来排列
  const sortedStatusKeys = Object.keys(statusList).sort();

  //checkbox全选
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allRowIds = expenses.map((item) => item.employee_id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  //checkbox单选
  const handleSelectRow = (event, id) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };



  const fetchExpense = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/MgtExpense/SelectExpense",
        {
          params: {
            test: 1
          },
        }
      );

      if (response.data.error) {
        console.log("error");
        setBusinessError(response.data.error);
        setExpenses([]);
      } else {
        console.log(response.data);
        setExpenses(response.data);
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const getInit = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/MgtExpense/init",
        {
          params: {
          },
        }
      );

      if (response.data.error) {
        console.log("error");
        setBusinessError(response.data.error);
        setInit([]);
      } else {
        console.log(response.data);
        // setInit(response.data);
        setPositionList(response.data[0]);
        setDepartmentList(response.data[1]);
        console.log(JSON.stringify(response.data[2],"状态")  );
        setStatusList(response.data[2]);
      }
    } catch (err) {
      setError(err);
    }
  };

  const getPositions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/MgtExpense/getPositions",
        {
          params: {
          },
        }
      );

      if (response.data.error) {
        console.log("error");
        setBusinessError(response.data.error);
        setPositionList([]);
      } else {
        console.log(response.data);
        setPositionList(response.data);
      }
    } catch (err) {
      setError(err);
    }
  };

  const getDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/MgtExpense/getDepartments",
        {
          params: {
          },
        }
      );

      if (response.data.error) {
        console.log("error");
        setBusinessError(response.data.error);
        setDepartmentList([]);
      } else {
        console.log(response.data);
        setDepartmentList(response.data);
      }
    } catch (err) {
      setError(err);
    }
  };


  const gotoRqt = () => {
    console.log("gotoRqt");
    navigate('/react/RqtExpense');

  };

  const approvalAll = () => {
    console.log("approvalAll");
  };

  useEffect(() => {
    fetchExpense();
    // getDepartments();
    // getPositions();
    getInit();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="shain-ichiran">
      <h2>経費管理一覧</h2>
      {businessError && <p className="error-message">{businessError}</p>}
      <div className='search-bar'>
        <div className="search-fields" >
          <span className='search-label'>社員ID:</span>
          <input
            type="text"
            placeholder="社員IDを入力してください"
            value={paramName}
            onChange={(e) => setParamName(e.target.value)}
          />
          <span className='search-label'>社員名:</span><input
            type="text"
            placeholder="社員名を入力してください"
            value={paramName}
            onChange={(e) => setParamName(e.target.value)}
          />
        </div>
      </div>
      <div className='search-bar'>
        <div className="search-fields">
          <span className='search-label'>部門:</span>
          <select className='search-select'
            value={paramPosition}
            onChange={(e) => setParamPosition(e.target.value)}
          >
            <option value=""></option>
            {Object.entries(positionList).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <span className='search-label'>職務:</span>
          <select className='search-select'
            value={paramDepartment}
            onChange={(e) => setParamDepartment(e.target.value)}
          >
            <option value=""></option>
            {Object.entries(departmentList).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <span className='search-label'>処理状態:</span>
          <select className='search-select'
            value={paramState}
            onChange={(e) => setParamState(e.target.value)}
          >
            <option value=""></option>
            {sortedStatusKeys.map(key => (
              <option key={key} value={key}>
                {statusList[key]}
              </option>
            ))}

          </select>
        </div>
      </div>
      <div className='search-bar'>
        <div className='search-fields'>
          <span className='search-label'>日付指定:</span>
          <input
            type="date"
            placeholder="最初日を選択してください"
            value={paramFirstDay}
            onChange={(e) => setParamFirstDay(e.target.value)}
          /><span>~</span>
          <input
            type="date"
            placeholder="最終日を選択してください"
            value={paramLastDay}
            onChange={(e) => setParamLastDay(e.target.value)}
          />
        </div>
      </div>
      <div className="search-bar">
        <button id="btn" onClick={fetchExpense}>検索</button>
        <button id="btn" className='margin-left-50' onClick={gotoRqt}>申請</button>
        <button id="btn" className='margin-left-50' onClick={approvalAll}>一括承認</button>
      </div>

      <div className='margin-bottom-20'>
        <table className='text-center'>
          <thead>
            <tr>
              <th>
                <input type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === expenses.length}
                />
              </th>
              <th>会社名</th>
              <th>経費申請ID</th>
              <th>社員ID</th>
              <th>社員名</th>
              <th>部門</th>
              <th>職務</th>
              <th>申請日</th>
              <th>申請金額</th>
              <th>処理状態</th>
              <th>精算金額</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.employee_id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectRow(e, expense.employee_id)}
                    checked={selectedRows.includes(expense.employee_id)}
                  />
                </td>

                <td>{expense.company_name}</td>
                <td>{expense.expense_application_id}</td>
                <td>{expense.employee_id}</td>
                <td>{expense.name}</td>
                <td>{expense.department}</td>
                <td>{expense.position}</td>
                <td>{expense.application_date}</td>
                <td>{expense.total_amount}</td>
                <td>{expense.processing_status}</td>
                <td>{expense.settlement_amount}</td>
                <td>
                  <button>取り消し</button>
                  <button>承認</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination className='pagination-wrapper' total={expenses.length} showSizeChanger showQuickJumper
        showTotal={showTotal}
        pageSizeOptions={[3, 5, 10]}
        locale={{
          items_per_page: "/頁",
          jump_to: "",
          jump_to_confirm: "Confirm",
          page: "頁へ",
        }} />
    </div>
  );
};

export default ExpenseList;
