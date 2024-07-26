import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Checkbox } from "antd";
import { Col, Row } from "antd";
import { Pagination } from "antd";

import { formatCurrency } from "../utils/utils";
import "./SalaryMgt.css";

const ShainIchiran = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paramName, setParamName] = useState("");
  const [paramSalaryDate, setParamSalaryDate] = useState("");
  const [businessError, setBusinessError] = useState("");
  const [paramDepartment, setParamDepartment] = useState("");
  const [paramPosition, setParamPosition] = useState("");
  const [paramID, setParamID] = useState("");
  const [checkedList, setCheckedList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [loginUser, setLoginUser] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/react/EmployeeList",
        {
          params: {
            name: paramName,
            birthday: paramSalaryDate,
          },
        }
      );

      if (response.data.error) {
        setBusinessError(response.data.error);
        setEmployees([]);
      } else {
        setEmployees(response.data.results);
        setBusinessError("");
        setCheckedList(new Array(response.data.results.length).fill(false));
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    let user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {};
    setLoginUser(user);
  }, []);

  const handleAllChecked = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    setCheckedList(new Array(employees.length).fill(checked));
    console.log(employees, "data");
  };

  const handleChecked = (index, id) => {
    const newCheckedList = [...checkedList];
    newCheckedList[index] = !newCheckedList[index];
    setCheckedList(newCheckedList);
    console.log(id, "id");

    const allChecked = newCheckedList.every((item) => item);
    setAllChecked(allChecked);
  };

  //クリア
  const reset = () => {
    setParamSalaryDate("");
    setParamDepartment("");
    setParamPosition("");
    setParamName("");
    setParamID("");
  };

  const items = [];

  // 根据 loginUser 的值设置 items
  if (loginUser === "admin") {
    items.push({
      key: "1",
      label: "未作成",
      children: (
        <>
          <table>
            <thead>
              <tr>
                <th className="force-center">
                  <Checkbox onChange={handleAllChecked}></Checkbox>
                </th>
                <th className="force-center">社員ID</th>
                <th className="force-center">社員名</th>
                <th className="force-center" colSpan="3">
                  勤怠
                </th>
                <th className="force-center" colSpan="3">
                  支給
                </th>
                <th className="force-center" colSpan="3">
                  控除
                </th>
                <th className="force-center" colSpan="2">
                  その他
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <React.Fragment key={employee.employeeId}>
                  <tr>
                    <td className="force-center">
                      <Checkbox
                        className="custom-checkbox"
                        onChange={() =>
                          handleChecked(index, employee.employeeId)
                        }
                        checked={checkedList[index]}
                      ></Checkbox>
                    </td>
                    <td className="force-center font-weight">
                      {employee.employeeId}
                    </td>
                    <td className="force-center font-weight">
                      {employee.name}
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          出勤日数:
                        </Col>
                        <Col span={9} className="col-data">
                          {20}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          基本給料:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency(500000)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          健康保険料:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency(24900)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr>
                    <td colSpan="3"></td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          勤務時間:
                        </Col>
                        <Col span={9} className="col-data">
                          {"168:00:00"}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          残業手当:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency()}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          厚生年金保険料:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency(44570)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          住宅手当:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency()}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          雇用保険料:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency(2040)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          通勤手当:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency(10000)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          社会保険料合計:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency(71510)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="6"></td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          その他手当:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency()}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title">
                          源泉所得税:
                        </Col>
                        <Col span={9} className="col-data">
                          {formatCurrency(19690)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3"></td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title font-weight">
                          支払総額:
                        </Col>
                        <Col span={9} className="col-data font-weight">
                          {formatCurrency(510000)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title font-weight">
                          控除額合計:
                        </Col>
                        <Col span={9} className="col-data font-weight">
                          {formatCurrency(91200)}
                        </Col>
                      </Row>
                    </td>
                    <td colSpan="3">
                      <Row>
                        <Col span={15} className="col-title font-weight">
                          差引支払額:
                        </Col>
                        <Col span={9} className="col-data font-weight">
                          {formatCurrency(418800)}
                        </Col>
                      </Row>
                    </td>
                  </tr>
                  <tr className="row-border"></tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      ),
    });
  }

  items.push({
    key: "2",
    label: "作成済み",
    children: (
      <table>
        <thead>
          <tr>
            <th className="force-center">社員ID</th>
            <th className="force-center">社員名</th>
            <th className="force-center" colSpan="3">
              勤怠
            </th>
            <th className="force-center" colSpan="3">
              支給
            </th>
            <th className="force-center" colSpan="3">
              控除
            </th>
            <th className="force-center" colSpan="2">
              その他
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <React.Fragment key={employee.employeeId}>
              <tr>
                <td className="force-center font-weight">
                  {employee.employeeId}
                </td>
                <td className="force-center font-weight">{employee.name}</td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      出勤日数:
                    </Col>
                    <Col span={9} className="col-data">
                      {20}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      基本給料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(500000)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      健康保険料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(24900)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      勤務時間:
                    </Col>
                    <Col span={9} className="col-data">
                      {"168:00:00"}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      残業手当:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency()}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      厚生年金保険料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(44570)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td colSpan="5"></td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      住宅手当:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency()}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      雇用保険料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(2040)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td colSpan="5"></td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      通勤手当:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(10000)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      社会保険料合計:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(71510)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="6"></td>
              </tr>
              <tr>
                <td colSpan="5"></td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      その他手当:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency()}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      源泉所得税:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(19690)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3"></td>
              </tr>
              <tr>
                <td colSpan="5"></td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title font-weight">
                      支払総額:
                    </Col>
                    <Col span={9} className="col-data font-weight">
                      {formatCurrency(510000)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title font-weight">
                      控除額合計:
                    </Col>
                    <Col span={9} className="col-data font-weight">
                      {formatCurrency(91200)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title font-weight">
                      差引支払額:
                    </Col>
                    <Col span={9} className="col-data font-weight">
                      {formatCurrency(418800)}
                    </Col>
                  </Row>
                </td>
              </tr>
              <tr className="row-border"></tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    ),
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="shain-ichiran">
      <h2>給料管理</h2>
      {businessError && <p className="error-message">{businessError}</p>}
      <div className="search-container">
        <div className="search-group">
          <div className="input-group">
            <input
              type="date"
              className="search-date"
              value={paramSalaryDate}
              onChange={(e) => {
                setParamSalaryDate(e.target.value);
                console.log("日期", e.target.value);
              }}
            />
            <span className="search-label margin-left-20">部門:</span>
            <select
              className="search-select"
              value={paramDepartment}
              onChange={(e) => {
                setParamDepartment(e.target.value);
                console.log("部門", e.target.value);
              }}
            >
              <option value=""></option>
              <option value="1">部門1</option>
              <option value="2">部門2</option>
              <option value="3">部門3</option>
            </select>
            <span className="search-label margin-left-20">職務:</span>
            <select
              className="search-select"
              value={paramPosition}
              onChange={(e) => {
                setParamPosition(e.target.value);
                console.log("職務", e.target.value);
              }}
            >
              <option value=""></option>
              <option value="1">職務1</option>
              <option value="2">職務2</option>
              <option value="3">職務3</option>
            </select>
            {loginUser && loginUser === "admin" && (
              <>
                <button className="search-button margin-left-20">
                  給料計算
                </button>
                <button className="search-button">控除設定</button>
              </>
            )}
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="社員名"
              className="search-input"
              value={paramName}
              onChange={(e) => {
                setParamName(e.target.value);
                console.log("社員名", e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="社員ID"
              className="search-input margin-left-20"
              value={paramID}
              onChange={(e) => {
                setParamID(e.target.value);
                console.log("社員ID", e.target.value);
              }}
            />
            <button className="search-button margin-left-85" onClick={reset}>
              クリア
            </button>
            <button className="search-button" onClick={fetchEmployees}>
              再検索
            </button>
          </div>
        </div>
      </div>

      <div>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
      <Pagination
        total={employees.length}
        className="pagination-wrapper"
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `合計件数 ( ${total} )`}
        pageSizeOptions={[3, 5, 10]}
        locale={{
          items_per_page: "/頁",
          jump_to: "",
          jump_to_confirm: "Confirm",
          page: "頁へ",
        }}
      />
    </div>
  );
};

export default ShainIchiran;
