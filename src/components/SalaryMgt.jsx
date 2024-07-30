import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Checkbox, Col, Row, Pagination, Modal } from "antd";

import { formatCurrency } from "../utils/utils";
import "./SalaryMgt.css";

const ShainIchiran = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [calSalaryData, setCalSalaryData] = useState([]);
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
  const [deductionModel, setDeductionModel] = useState(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [tabKey, setTabKey] = useState("2");
  const [salaryTotal, setSalaryTotal] = useState("2");
  const [resetFlag, setResetFlag] = useState(false);
  const [shouldResetPage, setShouldResetPage] = useState(false); // 是否重置页码

  const getParams = () => {
    return {
      param_name: paramName,
      salary_date: paramSalaryDate,
      department_id: paramDepartment,
      position_id: paramPosition,
      param_id: paramID,
      page: page,
      page_size: pageSize,
      tab_key: tabKey,
    };
  };

  const fetchSalary = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/react/salary/getSalaryRecord",
        getParams()
      );

      if (response.data.error) {
        setBusinessError(response.data.error);
        setSalaryData([]);
      } else {
        setSalaryData(response.data.results);
        setBusinessError("");
        setCheckedList(new Array(response.data.results.length).fill(false));
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchTotal = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/react/salary/getSalaryTotal",
        getParams()
      );

      if (response.data.error) {
        setBusinessError(response.data.error);
      } else {
        setSalaryTotal(response.data.data);
        setBusinessError("");
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const calculateSalary = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/react/salary/calculateSalary",
        getParams()
      );

      if (response.data.error) {
        setBusinessError(response.data.error);
      } else {
        setBusinessError("");
      }

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // // 仅在组件初始化时设置 tabKey
  // useEffect(() => {
  //   const initializeData = async () => {
  //     const user = localStorage.getItem("user")
  //       ? JSON.parse(localStorage.getItem("user"))
  //       : {};
  //     setLoginUser(user);

  //     // 根据用户类型设置 tabKey 的默认值
  //     if (user === "admin") {
  //       setTabKey("1");
  //     } else {
  //       setTabKey("2");
  //     }

  //     // 发请求以获取数据
  //     await fetchSalary();
  //   };

  //   initializeData();
  // }, []); // 空依赖数组，确保只在组件首次渲染时运行

  useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {};
    setLoginUser(user);
    fetchTotal();
    fetchSalary();
  }, [page, pageSize, tabKey, resetFlag]);

  useEffect(() => {
    setPage(1);
  }, [shouldResetPage]);

  const handleAllChecked = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    setCheckedList(new Array(salaryData.length).fill(checked));
    console.log(salaryData, "data");
  };

  const handleChecked = (index, id) => {
    const newCheckedList = [...checkedList];
    newCheckedList[index] = !newCheckedList[index];
    setCheckedList(newCheckedList);
    console.log(id, "id");

    const allChecked = newCheckedList.every((item) => item);
    setAllChecked(allChecked);
  };
  //page 变化的回调
  const pageChange = (page, pageSize) => {
    console.log("pageSize", page, pageSize);
    setPage(page);
    setPageSize(pageSize);
  };

  //tab 被点击的回调
  const tabClick = (key, event) => {
    console.log("tabClick", key, event);
    setTabKey(key);
  };

  //控除設定ポップアップ
  const showModal = () => {
    setDeductionModel(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setDeductionModel(false);
  };

  //クリア
  const reset = () => {
    setParamSalaryDate("");
    setParamDepartment("");
    setParamPosition("");
    setParamName("");
    setParamID("");
    setResetFlag((prevFlag) => !prevFlag);
  };

  const resetToFirstPage = () => {
    setShouldResetPage((prevFlag) => !prevFlag); // 设置重置页码标识
  };

  const items = [];

  // 根据 loginUser 的值设置 items
  // 这里面的salaryData和标签变量要替换
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
              {salaryData.map((employee, index) => (
                <React.Fragment key={employee.salary_id}>
                  <tr>
                    <td className="force-center">
                      <Checkbox
                        className="custom-checkbox"
                        onChange={() =>
                          handleChecked(index, employee.salary_id)
                        }
                        checked={checkedList[index]}
                      ></Checkbox>
                    </td>
                    <td className="force-center font-weight">
                      {employee.employee_id}
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
          <div className="button-container">
            <button className="search-button">作成処理</button>
          </div>
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
          {salaryData.map((data, index) => (
            <React.Fragment key={data.salary_id}>
              <tr>
                <td className="force-center font-weight">{data.employee_id}</td>
                <td className="force-center font-weight">{data.name}</td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      出勤日数:
                    </Col>
                    <Col span={9} className="col-data">
                      {data.attendance_days}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      基本給料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(data.basic_salary)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      健康保険料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(data.health_insurance_premium)}
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
                      {data.working_hours}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      残業手当:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(data.overtime_allowance)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      厚生年金保険料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(data.pension_insurance_premium)}
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
                      {formatCurrency(data.residential_allowance)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      雇用保険料:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(data.employment_insurance_premium)}
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
                      {formatCurrency(data.transportation_allowance)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      社会保険料合計:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(
                        data.employment_insurance_premium +
                          data.pension_insurance_premium +
                          data.health_insurance_premium
                      )}
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
                      {formatCurrency(data.other_allowance)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title">
                      源泉所得税:
                    </Col>
                    <Col span={9} className="col-data">
                      {formatCurrency(data.withholding_tax)}
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
                      {formatCurrency(data.payment)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title font-weight">
                      控除額合計:
                    </Col>
                    <Col span={9} className="col-data font-weight">
                      {formatCurrency(data.deduction)}
                    </Col>
                  </Row>
                </td>
                <td colSpan="3">
                  <Row>
                    <Col span={15} className="col-title font-weight">
                      差引支払額:
                    </Col>
                    <Col span={9} className="col-data font-weight">
                      {formatCurrency(data.total_salary)}
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
              type="month"
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
                <button
                  className="search-button margin-left-20"
                  onClick={calculateSalary}
                >
                  給料計算
                </button>
                <button className="search-button" onClick={showModal}>
                  控除設定
                </button>
                <Modal
                  title="控除設定"
                  open={deductionModel}
                  onCancel={handleCancel}
                >
                  <div className="modal-content">
                    <div className="modal-item">
                      <span className="search-label">健康保険料率:</span>
                      <input
                        type="text"
                        className="search-input"
                        value={paramName}
                        onChange={(e) => {
                          setParamName(e.target.value);
                          console.log("健康保険料率", e.target.value);
                        }}
                      />
                    </div>
                    <div className="modal-item">
                      <span className="search-label">厚生年金保険料率:</span>
                      <input
                        type="text"
                        className="search-input"
                        value={paramName}
                        onChange={(e) => {
                          setParamName(e.target.value);
                          console.log("厚生年金保険料率", e.target.value);
                        }}
                      />
                    </div>
                    <div className="modal-item">
                      <span className="search-label">雇用保険料率:</span>
                      <input
                        type="text"
                        className="search-input"
                        value={paramName}
                        onChange={(e) => {
                          setParamName(e.target.value);
                          console.log("雇用保険料率", e.target.value);
                        }}
                      />
                    </div>
                    <div className="modal-item">
                      <span className="search-label">源泉所得税率:</span>
                      <input
                        type="text"
                        className="search-input"
                        value={paramName}
                        onChange={(e) => {
                          setParamName(e.target.value);
                          console.log("源泉所得税率", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </Modal>
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
            <button
              className="search-button margin-left-85"
              onClick={() => {
                resetToFirstPage();
                reset();
              }}
            >
              クリア
            </button>
            <button
              className="search-button"
              onClick={() => {
                resetToFirstPage();
                fetchTotal();
                fetchSalary();
              }}
            >
              再検索
            </button>
          </div>
        </div>
      </div>

      <div>
        <Tabs items={items} onTabClick={tabClick} />
      </div>
      <Pagination
        total={salaryTotal}
        className="pagination-wrapper"
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `合計件数 ( ${total} )`}
        pageSizeOptions={[3, 5, 10]}
        defaultPageSize={3}
        onChange={pageChange}
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
