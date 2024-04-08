import "./style/view.scss";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import Chart from "../../components/material/Chart";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

import {
  Box,
  List as List1,
  ListItem,
  ListItemText,
  useTheme,
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
import { tokens } from "../../theme";
import LineChart from "../components/chart/LineChart";
import profilavatar from "../../../src/assets/images/face-1.jpg";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";

const ViewStaff = () => {
  // change thse value dynamically
  const startSessionDate = new Date("2023-07-01"); // Set your desired start date
  const endSessionDate = new Date("2024-06-30"); // Set your desired end date
  const { Title, Paragraph } = Typography;

  const { id } = useParams();

  const [data, setData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const calendarRef = useRef();
  const [sessionAttendance, setSessionAttendance] = useState([]);

  const [staffPercentageData, setStaffPercentageData] = useState(null);
  const [staffsSessionData, setStaffSessionData] = useState([]);
  const [monthlyData, setMonthlyData] = useState();

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);
  // const { toPDF, targetRef } = usePDF({ filename: "salaryslip.pdf" });
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

  const getStaffAnalyticsData = () => {
    api
      .get("staffspercentagebyid/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("percentage", data);
        setStaffPercentageData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    api
      .get("staffssessionpercentagebyid/" + id)
      .then(async (response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("session", data);
        let chartData = await Promise.all(
          data.map((value, i) => {
            return {
              name: value.monthName,
              Total: parseFloat(value.staff_percentage).toFixed(2),
            };
          })
        );
        console.log("chartData", chartData);
        setStaffSessionData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    let params = {
      id: id,
      month: new Date(),
    };

    api
      .get("staffsmonthlypercentage", { params })
      .then(async (response) => {
        const data = response.data; // Assuming the response contains the array of student data
        console.log("monthly", data);
        setMonthlyData(data);
      })
      .catch((error) => {
        console.error("Error fetching monthly data:", error);
      });
  };

  const getAttendanceData = async () => {
    // Fetch data from an API using Axios
    await api
      .get("staffattendance/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data

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

        let events = data.map((item) => ({
          id: item.id,
          title: item.status,
          start: combineDateTime(item.day, item.entrance_time),
          end: combineDateTime(item.day, item.exit_time),
          allDay: false,
        }));
        setCurrentEvents(events); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    console.log("heaven");
    // Fetch data from an API using Axios
    api
      .get("staffs/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("staff data", data);
        setData(data); // Update the state with the fetched data

        console.log("image", data.staff_image);
        //setFilteredRows(data); // Set initial filtered rows
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    getStaffAnalyticsData();
  }, [id]);

  useEffect(() => {
    const temp = [
      { name: "July", Total: 1200 },
      { name: "Aug", Total: 2100 },
      { name: "Sep", Total: 800 },
      { name: "Oct", Total: 1600 },
      { name: "Nov", Total: 900 },
      { name: "Dec", Total: 1700 },
      { name: "Jan", Total: 1200 },
      { name: "Feb", Total: 2100 },
      { name: "March", Total: 800 },
      { name: "April", Total: 1600 },
      { name: "May", Total: 900 },
      { name: "June", Total: 1700 },
    ];

    setSessionAttendance(temp);
    getAttendanceData();
  }, [id]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  function combineDateTime(dateOnly, timeOnly) {
    // Assuming dateOnly is in 'YYYY-MM-DD' format and timeOnly is in 'HH:mm:ss' format
    const [dateYear, dateMonth, dateDay] = dateOnly.split("-").map(Number);
    const [timeHour, timeMinute, timeSecond] = timeOnly.split(":").map(Number);

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

  // const handleDateClick = (selected) => {
  //     const title = prompt("Please enter a new title for your event");
  //     const calendarApi = selected.view.calendar;
  //     calendarApi.unselect();

  //     if (title) {
  //         calendarApi.addEvent({
  //             id: `${selected.dateStr}-${title}`,
  //             title,
  //             start: selected.startStr,
  //             end: selected.endStr,
  //             allDay: selected.allDay,
  //         });
  //     }
  // };

  // const handleEventClick = (selected) => {
  //     if (
  //         window.confirm(
  //             `Are you sure you want to delete the event '${selected.event.title}'`
  //         )
  //     ) {
  //         selected.event.remove();
  //     }
  // };

  const [addPopup, setAddPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [popupEntranceTime, setPopupEntranceTime] = useState(null);
  const [popupExitTime, setPopupExitTime] = useState(null);

  const handleDateClick = (date, jsEvent, view) => {
    console.log(date, jsEvent, view);
    setAddPopup(true);
    setSelectedDate(date.start);
    setPopupEntranceTime(null);
    setPopupExitTime(null);
  };

  const handleEventClick = (selected) => {
    console.log(selected.event.start);
    if (selected.event.start) {
      setDeletePopup(true);
      setSelectedDate(selected.event.start);
    } else {
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
      .post("/createstaffattendance", {
        staffId: id,
        day: selectedDate,
        entranceTime: popupEntranceTime,
        exitTime: popupExitTime,
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStaffAnalyticsData();
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
  };

  const deleteAttendanceEvent = () => {
    console.log(selectedDate);

    api
      .post("/deletestaffattendance", {
        staffId: id,
        day: selectedDate,
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStaffAnalyticsData();
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
  };

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
          <Col xs={24} sm={24} md={12} lg={12} xl={7} className="mb-24">
            <Card bordered={true} className="circle-box h-full">
              <Row gutter={[24, 0]}>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  className="mb-24"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column", // Center content vertically on small screens
                  }}
                >
                  <Avatar.Group>
                    <Avatar
                      size={74}
                      shape="square"
                      src={
                        data?.staff_image_thumbnail
                          ? "data:image/png;base64," +
                            data?.staff_image_thumbnail
                          : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                      }
                    />
                  </Avatar.Group>
                  <Title
                    level={4}
                    style={{ marginLeft: "10px", marginBottom: "0" }}
                  >
                    {(data?.first_name ? data?.first_name : "") +
                      " " +
                      (data?.last_name ? data?.last_name : "")}
                  </Title>
                </Col>
              </Row>
              <div className="detailsInfos">
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
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{data?.address}</span>
                </div>
              </div>

              <div
                className="col-action"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  margin: "10px", // Adjust this value to add some space between the buttons and the bottom/right edges
                }}
              >
                <Button type="link" href={"update/" + id}>
                  {pencil} EDIT
                </Button>
                <Button
                  className="infoButton"
                  href={"salaryslip/" + id}
                  type="link"
                >
                  {reportIcon} Salary Slip
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={17} className="mb-24">
            <Card bordered={true} className="criclebox h-full">
              <LineChart data={staffsSessionData} />
            </Card>
          </Col>
        </Row>
        <div className="bottom">
          <Box m="5px">
            <Box display="flex" justifyContent="space-between">
              {/* Featured Card */}
              <Box flex="1 1 15%">
                <div className="featured">
                  <div className="">
                    <p className="title">Average Attendance</p>
                  </div>
                  <div className="feature-bottom">
                    <h2 className="desc">Monthly</h2>
                    <div className="featuredChart">
                      <CircularProgressbar
                        value={monthlyData?.staff_percentage}
                        text={
                          parseFloat(monthlyData?.staff_percentage)
                            ?.toFixed(2)
                            ?.toString() + "%"
                        }
                        strokeWidth={5}
                      />
                    </div>
                    <p className="title">
                      Attendance: &nbsp;<b>{monthlyData?.total_attendance}</b>
                    </p>
                    <h2 className="desc">Annually</h2>
                    <div className="featuredChart">
                      <CircularProgressbar
                        value={staffPercentageData?.staff_percentage}
                        text={
                          parseFloat(staffPercentageData?.staff_percentage)
                            ?.toFixed(2)
                            ?.toString() + "%"
                        }
                        strokeWidth={5}
                      />
                    </div>
                    <p className="title">
                      Attendance <b>{staffPercentageData?.total_attendance}</b>
                    </p>
                  </div>
                </div>
              </Box>

              <Box flex="1 1 75%" ml="2vh">
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
                    left: "prev",
                    center: "title",
                    right:
                      "next today dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                  }}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  select={handleDateClick}
                  eventClick={handleEventClick}
                  validRange={{ start: startSessionDate, end: endSessionDate }}
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
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ViewStaff;
