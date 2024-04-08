import { useState, useEffect } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
} from "antd";


import LineChart from "../components/chart/LineChart";
import { useAuth } from "../providers/AuthProvider";
import AuthAxios from "../config/AuthAxios";
function Home() {
  const { Title, Text } = Typography;

  const profile = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
        fill="#fff"
      ></path>
      <path
        d="M17 6C17 7.65685 15.6569 9 14 9C12.3431 9 11 7.65685 11 6C11 4.34315 12.3431 3 14 3C15.6569 3 17 4.34315 17 6Z"
        fill="#fff"
      ></path>
      <path
        d="M12.9291 17C12.9758 16.6734 13 16.3395 13 16C13 14.3648 12.4393 12.8606 11.4998 11.6691C12.2352 11.2435 13.0892 11 14 11C16.7614 11 19 13.2386 19 16V17H12.9291Z"
        fill="#fff"
      ></path>
      <path
        d="M6 11C8.76142 11 11 13.2386 11 16V17H1V16C1 13.2386 3.23858 11 6 11Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const [topData, setTopData] = useState([]);
  const [bottomData, setBottomData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);

  const [todayStudent, setTodayStudent] = useState(0);
  const [todayStaff, setTodayStaff] = useState(0);
  const [arrayCount, setArrayCount] = useState([]);


  const [studentSessions, setStudentSession] = useState([]);

  const [studentLimit, setStudentLimit] = useState(5);

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);

  // Now 'datas' contains the transformed data based on 'topData' with keys using the map function.

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await api.get("getstudentscount/", {});
        setTotalStudents(students.data.studentCount);

        const staffs = await api.get("getstaffscount/", {});
        setTotalStaffs(staffs.data.staffCount);

        const departments = await api.get("departments", {});
        setTotalDepartments(departments.data.count);

        const todayStudentAttendance = await api.get(
          "todaystudentattendance/",
          {}
        );
        setTodayStudent(todayStudentAttendance.data.count);

        const todayStaffAttendance = await api.get("todaystaffattendance/", {});
        setTodayStaff(todayStaffAttendance.data.count);

        // Set the count array once all data is fetched and state is updated
        const count = [
          {
            today: "Total Departments",
            title: totalDepartments,
            persent: "",
            icon: profile,
            bnb: "bnb2",
          },
          {
            today: "Total Staffs",
            title: staffs.data.staffCount,
            persent: "",
            icon: profile,
            bnb: "bnb2",
          },
          {
            today: "Staffs Present Today",
            title: todayStaffAttendance.data.count,
            persent: "",
            icon: profile,
            bnb: "bnb2",
          },
        ];
        setArrayCount(count);

        await api
          .get("studentssessionpercentage/", {})
          .then(async (students) => {
            let data = students?.data;
            let chartData = await Promise.all(
              data.map((value, i) => {
                return {
                  name: value.monthName,
                  Total: parseFloat(value.overallAveragePercentage).toFixed(2),
                };
              })
            );
            setStudentSession(chartData);
          })

          .catch((error) => {
            console.log("Error", error);
            console.error("Error fetching data:", error?.response?.data);
          });
        await api
          .get("studentspercentage/", {
            params: {
              limit: studentLimit,
              order: "top",
            },
          })
          .then((students) => {
            setTopData(students.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error?.response?.data);
          });
        await api
          .get("studentspercentage/", {
            params: {
              limit: studentLimit,
              order: "bottom",
            },
          })
          .then((students) => {
            setBottomData(students.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error?.response?.data);
          });
      } catch (error) {
        console.error("Error fetching data:", error?.response?.data);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {arrayCount.map((c, index) => (
           <Col
           key={index}
           xs={24}
           sm={24}
           md={8}
           lg={8}
           xl={8}
           className="mb-24"
         >
              <Card
                bordered={false}
                className="criclebox"
                style={{ padding: 0, height: "90px", marginTop: -10 }}
              >
                <div className="number" style={{ marginTop: -12 }}>
                  <Row align="middle" gutter={[, 0]}>
                    <Col xs={19}>
                      <span>{c.today}</span>
                      <Title level={2}>
                        {c.title} <small className={c.bnb}>{c.persent}</small>
                      </Title>
                    </Col>
                    <Col xs={3}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              {studentSessions.length > 0 && (
                <LineChart
                  data={studentSessions}
                  title="This Session (Attendance)"
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
