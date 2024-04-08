import "./style/view.scss";
import axios from "axios";
import React, { useRef } from 'react';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
// import { usePDF } from "react-to-pdf";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import LineChart from "../components/chart/LineChart";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import profilavatar from "../../../src/assets/images/face-1.jpg";
import { store } from 'react-notifications-component';    
import 'react-notifications-component/dist/theme.css';import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material";
import {
  Card,
  Col,
  Row,
  Tooltip,
  Avatar,
  Progress,
  Upload,
  message,
  Timeline,
  Typography,
  Radio,
  Button,

} from "antd";
 
import Chart from "../../components/material/Chart";

import {  toast } from "react-toastify";
  
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import styled from "@emotion/styled";
// import { usePDF } from "react-to-pdf";

import {
  Box,
  List as List1,
  ListItem,
  ListItemText,
  // Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";

const ViewStudent = () => {
  // change thse value dynamically
  const calendarRef = useRef(null);
  const startSessionDate = new Date("2023-07-01"); // Set your desired start date
  const endSessionDate = new Date("2024-06-30"); // Set your desired end date
  const { Title, Paragraph } = Typography;

  const { id } = useParams();

  const [data, setData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [sessionAttendance, setSessionAttendance] = useState([]);

  const [studentPercentageData, setStudentPercentageData] = useState(null);
  const [studentsSessionData, setStudentSessionData] = useState([]);

  const [monthlyData, setMonthlyData] = useState();

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);
  // const { toPDF, targetRef } = usePDF({ filename: "salaryslip.pdf" });

  // const { toPDF, targetRef } = usePDF({filename: 'salary.pdf'});
  const reportIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={1}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 18H5C3.89543 18 3 17.1046 3 16V4C3 2.89543 3.89543 2 5 2H15C16.1046 2 17 2.89543 17 4V16C17 17.1046 16.1046 18 15 18ZM5 0C2.23858 0 0 2.23858 0 5V16C0 18.7614 2.23858 21 5 21H15C17.7614 21 20 18.7614 20 16V5C20 2.23858 17.7614 0 15 0H5ZM10 15C10.5523 15 11 14.5523 11 14V8C11 7.44772 10.5523 7 10 7C9.44772 7 9 7.44772 9 8V14C9 14.5523 9.44772 15 10 15ZM10 5C10.5523 5 11 4.55228 11 4C11 3.44772 10.5523 3 10 3C9.44772 3 9 3.44772 9 4C9 4.55228 9.44772 5 10 5Z"
        fill="#111827"
      />
    </svg>
  );
  
  const pencil = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path
        d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
        className="fill-gray-7"
      ></path>
    </svg>,
  ];
  const getStudentAnalyticsData = () => {

    api
    .get("studentspercentagebyid/" + id)
    .then((response) => {
      const data = response.data; // Assuming the response contains the array of student data
      console.log("percentage", data);
      setStudentPercentageData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  api
    .get("studentssessionpercentagebyid/" + id)
    .then(async (response) => {
      const data = response.data; // Assuming the response contains the array of student data
      console.log("session", data);
      let chartData = await Promise.all(
        data.map((value, i) => {
          return {
            name: value.monthName,
            Total: parseFloat(value.student_percentage).toFixed(2),
          };
        })
      );
      console.log("chartData", chartData);
      setStudentSessionData(chartData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  let params = {
    id: id,
    month: new Date(),
  };

  api
    .get("studentsmonthlypercentage", { params })
    .then(async (response) => {
      const data = response.data; // Assuming the response contains the array of student data
      console.log("monthly", data);
      setMonthlyData(data);
    })
    .catch((error) => {
      console.error("Error fetching monthly data:", error);
    });
  }

  useEffect(() => {
  
    // Fetch data from an API using Axios
    api
      .get("students/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of student data
        console.log(data);
        setData(data); // Update the state with the fetched data

        console.log("image", data.student_image);
        //setFilteredRows(data); // Set initial filtered rows
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

      getStudentAnalyticsData();
  }, [id]);


  const getAttendanceData = async (id) => {
    await api
      .get("attendance/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of student data
        // eslint-disable-next-line array-callback-return
        if (calendarRef.current) {
          calendarRef.current.getApi().removeAllEvents();
          data.map((event) => {
            calendarRef.current.getApi().addEvent({
              id: event.id,
              title: event.status,
              start: event.day,
              end: event.exit_time,
              //allDay:true
            });
          });
        }

        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Fetch data from an API using Axios
    getAttendanceData(id);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  function combineDateTime(dateOnly, timeOnly) {
    // Assuming dateOnly is in 'YYYY-MM-DD' format and timeOnly is in 'HH:mm:ss' format
    const [dateYear, dateMonth, dateDay] = dateOnly?.split("-")?.map(Number);
    const [timeHour, timeMinute, timeSecond] = timeOnly
      ?.split(":")
      ?.map(Number);

    const combinedDate = new Date(
      dateYear,
      dateMonth - 1,
      dateDay,
      timeHour,
      timeMinute,
      timeSecond
    );
    return combinedDate;
  }


  const [addPopup, setAddPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [popupEntranceTime , setPopupEntranceTime] = useState(null);
  const [popupExitTime , setPopupExitTime] = useState(null);

  const handleDateClick = (date, jsEvent, view) => {
    console.log(date, jsEvent, view)
    setAddPopup(true);
    setSelectedDate(date.start)
    setPopupEntranceTime(null)
    setPopupExitTime(null)
  };

  const handleEventClick = (selected) => {
    console.log(selected.event.start);
    if(selected.event.start){
      setDeletePopup(true);
      setSelectedDate(selected.event.start)
    }else{
      toast.error("Error...");
    }
  };

  const handleCloseWarning = () => {
    setAddPopup(false);
    setDeletePopup(false);
    setSelectedDate(null);
  };

  const addAttendanceEvent = () => {

    console.log(selectedDate);

    api
      .post("/createattendance", {
        studentId: id,
        day: selectedDate,
        entranceTime: popupEntranceTime,
        exitTime: popupExitTime
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStudentAnalyticsData();
        console.log("Attendance added:", response.data);
        toast.success("Attendance added successfully");
        handleCloseWarning();
      })
      .catch((error) => {
        // Handle error
        console.error("Error adding attendance:", error.response.data);
        toast.error("Error Adding attendance: " + error.response.data.error);
        handleCloseWarning();
      });
  }

  const deleteAttendanceEvent = () => {

    console.log(selectedDate);

    api
      .post("/deleteattendance", {
        studentId: id,
        day: selectedDate,
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStudentAnalyticsData();
        console.log("Attendance deleted:", response.data);
        toast.success("Attendance deleted successfully");
        handleCloseWarning();
      })
      .catch((error) => {
        // Handle error
        console.error("Error deleting attendance:", error.response.data);
        toast.error("Error Deleting attendance: " + error.response.data.error);
        handleCloseWarning();
      });
  }

  
  const AddAttendancePopup = () => {
    return (
      <Dialog open={addPopup} onClose={handleCloseWarning}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You Sure you want to add the attendance.
          </DialogContentText>
          <TextField
          label="Entrance Time"
          type="time"
          value={popupEntranceTime}
          onChange={(e) => setPopupEntranceTime(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Exit Time"
          type="time"
          value={popupExitTime}
          onChange={(e) => setPopupExitTime(e.target.value)}
          fullWidth
          margin="normal"
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => addAttendanceEvent()} color="primary">
            Proceed
          </Button>
          <Button
            onClick={() => handleCloseWarning()}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const DeleteAttendancePopup = () => {
    return (
      <Dialog open={deletePopup} onClose={handleCloseWarning}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You Sure you want to Delete Attendance.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteAttendanceEvent()} color="primary">
            Proceed
          </Button>
          <Button
            onClick={() => handleCloseWarning()}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="single">
      <div className="singleContainer">
        <AddAttendancePopup />
        <DeleteAttendancePopup />

    
        <Row gutter={[24, 0]}>
       
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
            <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24" style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar.Group>
                <Avatar size={74} shape="square" src={profilavatar} />
              </Avatar.Group>
              <Title level={4} style={{ marginLeft: '10px', marginBottom: '0' }}>
                {(data?.first_name ? data?.first_name : '') + ' ' + (data?.last_name ? data?.last_name : '')}
              </Title>
            </Col>
          </Row>
        <div className="detailsInfos">
                  <div className="detailItem">
                    <span className="itemKey">Standard:</span>
                    <span className="itemValue">{data?.class?.class_name}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Roll No:</span>
                    <span className="itemValue">{data?.roll_no}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Gender:</span>
                    <span className="itemValue">{data?.gender}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">DOB:</span>
                    <span className="itemValue">{data?.dob}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Joining Date:</span>
                    <span className="itemValue">{data?.joining_date}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Parent Name:</span>
                    <span className="itemValue">{data?.parent_name}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Parent Phone:</span>
                    <span className="itemValue">{data?.parent_phone}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Parent Email:</span>
                    <span className="itemValue">{data?.parent_email}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{data?.address}</span>
                  </div>
                </div>
                <div className="col-action" >
                    <Button type="link" href={"update/" + id}>
                    {pencil} EDIT
                    </Button>
                    <Button className="infoButton" type="link" >
                       {reportIcon} Report
                      </Button>
                    </div>
       </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
        
            <Card bordered={false} className="criclebox h-full" >
              <LineChart  data={studentsSessionData} />
            </Card>
          </Col>
        </Row>
        <div className="">
          <Box m="20px">
            <Box display="flex" justifyContent="space-between">
              <Box flex="1 1 15%">
                <div className="featured">
                  <div className="top">
                    <p className="title">Average Attendance</p>
                  </div>

                  <div className="feature-bottom">
                    <h2 className="desc">Monthly</h2>
                    <div className="featuredChart">
                      {" "}
                      <CircularProgressbar
                        value={monthlyData?.student_percentage}
                        text={
                          parseFloat(monthlyData?.student_percentage)
                            ?.toFixed(2)
                            ?.toString() + "%"
                        }
                        strokeWidth={5}
                      />{" "}
                    </div>
                    <p className="title">Attendance</p>
                    <p className="amount">{monthlyData?.total_attendance}</p>

                    <h2 className="desc">Anually</h2>
                    <div className="featuredChart">
                      {" "}
                      <CircularProgressbar
                        value={studentPercentageData?.student_percentage}
                        text={
                          parseFloat(studentPercentageData?.student_percentage)
                            ?.toFixed(2)
                            ?.toString() + "%"
                        }
                        strokeWidth={5}
                      />{" "}
                    </div>
                    <p className="title">Attendance</p>
                    <p className="amount">
                      {studentPercentageData?.total_attendance}
                    </p>
                  </div>
                </div>
              </Box> 

              {/* CALENDAR */}
              <Box flex="1 1 85%" ml="4vh" >
                {/* <StyleWrapper> */}
                <div className="calendar-container">
                  <FullCalendar
                    ref={calendarRef}
                    height="75vh"
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      listPlugin,
                    ]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                    }}
                    initialView="dayGridMonth"
                    // events={[{
                    //       id: "12344",
                    //       title: "Hello",
                    //       start: "2022-07-28",
                    //       end: "2022-07-28",
                    //       allDay: true,
                    //     }]}

                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select={handleDateClick}
                    eventClick={handleEventClick}
                    validRange={{
                      start: startSessionDate,
                      end: endSessionDate,
                    }}
                    eventsSet={(events) => setCurrentEvents(events)}
                    initialEvents={[
                      {
                        id: "12344",
                        title: "Hello",
                        start: "2022-07-28",
                        end: "2022-07-28",
                        allDay: true,
                      },
                    ]}
                  />
                </div>
                {/* </StyleWrapper> */}
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
