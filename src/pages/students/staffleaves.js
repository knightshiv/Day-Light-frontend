import "./leaves.scss";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import {
  Box,
  IconButton,
  DialogActions,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import {  toast } from 'react-toastify';

import {
  useTheme,
  Checkbox,
  TextField,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addDays } from "date-fns"; // Import the addDays function from date-fns

// import Header from "../../components/Header";
import { tokens } from "../../theme";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";
// import { ToastContainer, toast } from 'react-toastify';

const StaffLeaves = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);
  const calendarRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [designation, setDesignations] = useState([]);

  const [selectedChip, setSelectedChip] = useState("days");

  const [singleDate, setSingleDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState([]); // Default to Sunday
  const [description, setDescription] = useState("");

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);

  const [selectedFilterDepartments, setSelectedFilterDepartments] = useState(
    []
  );
  const [selectedFilterDesignations, setSelectedFilterDesignations] = useState(
    []
  );

  // set these values with api with current session
  const minDate = new Date("07-01-2023");
  const maxDate = addDays(minDate, 365);

  const Weekdays = [
    { id: 0, label: "Sunday" },
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
  ];
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    getLeaves();
  }, [selectedFilterDepartments, selectedFilterDesignations]);

  useEffect(() => {
    api
      .get("departments")
      .then((standards) => {
        setDepartments(standards.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getDesignations = (departmentIds) => {
    api
      .get("designationbydepartment", {
        params: {
          departmentId: departmentIds,
        },
      })
      .then((designations) => {
        setDesignations(designations.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getLeaves = async () => {
    console.log("Getting leaves...");
    await api
      .get("staffleaves/", {
        params: {
          designationIds: selectedFilterDesignations,
        },
      })
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of sttaff data
        // eslint-disable-next-line array-callback-return
        if (calendarRef.current) {
          calendarRef.current.getApi().removeAllEvents();

          // Create a set to store unique event days
          const uniqueEventDays = new Set();
          data.map((event) => {
            if (!uniqueEventDays.has(event.day)) {
              calendarRef.current.getApi().addEvent({
                id: event.id,
                title:
                  event.desc != null && event.desc !== ""
                    ? event.desc
                    : "Leave",
                start: event.day,
              });
              // Add the event day to the set to mark it as added
              uniqueEventDays.add(event.day);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const updateLeaves = () => {
    if (selectedDesignations.length < 1) {
        toast.error('Please select at least one designation')
      return;
    }

    let postData = {
      designationIds: selectedDesignations,
      description: description,
      action: null,
    };

    if (selectedChip === "days") {
      postData.type = "days";
      postData.days = selectedDay;
    }

    if (selectedChip === "date") {
      postData.type = "single";
      postData.singleDate = singleDate;
    }

    if (selectedChip === "range") {
      postData.type = "range";
      postData.startDate = startDate;
      postData.endDate = endDate;
    }

    console.log("postData", postData);
    api
      .post("staffleaves/", postData)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("staff data", data);
        getLeaves();
        refreshData();
        toast.success('Leaves created succesfully!!!')
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error('Error creating Leaves:', error.response.data)
      });
  };

  const deleteLeaves = () => {
    if (selectedDepartments.length < 1) {
        toast.error('Please select at least one department')
      return;
    }

    if (selectedDesignations.length < 1) {
        toast.error('Please select at least one designation')
      return;
    }

    let postData = {
      designationIds: selectedDesignations,
      description: "",
      action: null,
    };

    if (selectedChip === "days") {
      postData.type = "days";
      postData.days = selectedDay;
    }

    if (selectedChip === "date") {
      postData.type = "single";
      postData.singleDate = singleDate;
    }

    if (selectedChip === "range") {
      postData.type = "range";
      postData.startDate = startDate;
      postData.endDate = endDate;
    }

    console.log("postData", postData);
    api
      .post("deletestaffleaves/", postData)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("delete data", data);
        getLeaves();
        refreshData();
        toast.success('Leaves deleted succesfully!!!')
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        toast.error('Error deleting Leaves:', error.response.data)
      });
  };

  const refreshData = () => {
    setDescription("");
    setSingleDate(null);
    setStartDate(null);
    setEndDate(null);
    setSelectedDay([]);
    setSelectedDepartments([]);
    setSelectedDesignations([]);
  };

  const handleChipClick = (chipLabel) => {
    setSelectedChip(chipLabel);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  const handleSingleDateChange = (newDate) => {
    setSingleDate(newDate);
  };

  const handleDayChange = (event, value) => {
    console.log(event, value);
    //setSelectedDay(value);
    setSelectedDay(event.target.value);
  };

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the attendance '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  const handleDepartmentChange = (event) => {
    event.stopPropagation();
    //console.log(event.target.value)
    if (event.target.value.includes("all")) {
      console.log("all selected");
      let ids = departments.map((value) => value.id);
      setSelectedDepartments(ids);
      getDesignations(ids);
    } else {
      getDesignations(event.target.value);
      setSelectedDepartments(event.target.value);
    }
  };

  const handleDesignationChange = (event) => {
    if (event.target.value.includes("all")) {
      console.log("all selected");
      let ids = designation.map((value) => value.id);
      setSelectedDesignations(ids);
    } else setSelectedDesignations(event.target.value);
  };

  const handleFilterDepartmentChange = (event) => {
    if (event.target.value.includes("all")) {
      console.log("all selected");
      let ids = departments.map((value) => value.id);
      setSelectedFilterDepartments(ids);
    } else setSelectedFilterDepartments(event.target.value);
  };

  const handleFilterDesignationChange = (event) => {
    if (event.target.value.includes("all")) {
      console.log("all selected");
      let ids = designation.map((value) => value.id);
      setSelectedFilterDesignations(ids);
    } else setSelectedFilterDesignations(event.target.value);
  };

  const DateRangePicker = () => {
    return (
      <LocalizationProvider
        localeText={{ clearButtonLabel: "Empty", todayButtonLabel: "Now" }}
        dateAdapter={AdapterDateFns}
      >
        <Box sx={{ ml: 2 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            minDate={minDate}
            maxDate={endDate || maxDate} // Make sure maxDate is within the selected range
            renderInput={(params) => <TextField {...params} />}
            format="dd/MM/yyyy" // Set the desired date format
          />
        </Box>
        <Box sx={{ ml: 2 }}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            minDate={startDate || minDate} // Make sure minDate is within the selected range
            maxDate={maxDate}
            renderInput={(params) => <TextField {...params} />}
            format="dd/MM/yyyy" // Set the desired date format
          />
        </Box>
      </LocalizationProvider>
    );
  };

  const SingleDatePicker = () => {
    return (
      <LocalizationProvider
        localeText={{ clearButtonLabel: "Empty", todayButtonLabel: "Now" }}
        dateAdapter={AdapterDateFns}
      >
        <DatePicker
          label="Select Date"
          value={singleDate}
          onChange={handleSingleDateChange}
          minDate={minDate}
          maxDate={endDate || maxDate} // Make sure maxDate is within the selected range
          renderInput={(params) => <TextField {...params} />}
          format="dd/MM/yyyy" // Set the desired date format
        />
      </LocalizationProvider>
    );
  };

  const MultiSelector = ({ label, options, selectedValues, onChange }) => {
    const isSelectAllChecked = options.every((item) =>
      selectedValues.includes(item.id)
    );
    const isDepartmentLabel =
      label === "Department" || label === "Filter By Departments";
    const padding = isDepartmentLabel ? { mr: 1 } : { ml: 1 };

    return (
      <TextField
        select
        label={label}
        variant="outlined"
        size="small"
        value={selectedValues}
        fullWidth
        onChange={onChange}
        sx={padding}
        SelectProps={{
          multiple: true,
          renderValue: (selected) => {
            // if (selected.includes('all')) {
            //   // "Select All" is selected, don't render checkboxes
            //   return 'Select All';
            // } else {
            // Individual options are selected, render them as a comma-separated string
            return selected
              .map((value) => {
                const option = options.find((item) => item.id === value);
                return isDepartmentLabel
                  ? option.department_name
                  : option.designation_name;
              })
              .join(", ");
            // }
          },
        }}
        MenuProps={{
          disableAutoFocusItem: true, // Prevent closing on checkbox selection
        }}
      >
        {options.length > 1 && (
          <MenuItem value="all">
            <Checkbox checked={isSelectAllChecked} />
            Select All
          </MenuItem>
        )}
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Checkbox checked={selectedValues.includes(item.id)} />
            {isDepartmentLabel ? item.department_name : item.designation_name}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const DayMultiSelector = ({ selectedValue, onChange }) => {
    return (
      <TextField
        select
        label={"Select Day"}
        variant="outlined"
        size="small"
        value={selectedValue}
        fullWidth
        onChange={onChange}
        MenuProps={{
          disableAutoFocusItem: true, // Prevent closing on checkbox selection
        }}
        disableCloseOnSelect
        SelectProps={{
          multiple: true,
          autoClose: false, // Disable automatic closing
          renderValue: (selected) => {
            return selected
              .map((value) => {
                const option = Weekdays.find((item) => item.id === value);
                return option.label;
              })
              .join(", ");
            // }
          },
        }}
      >
        {Weekdays.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Checkbox checked={selectedValue.includes(item.id)} />
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const DayMultiSelector2 = ({ selectedValue, onChange }) => {
    // <TextField
    //     select
    //     label={"Select Day"}
    //     variant="outlined"
    //     size="small"
    //     value={selectedValue}
    //     fullWidth="designation"
    //     onChange={onChange}
    //     MenuProps={{
    //       disableAutoFocusItem: true, // Prevent closing on checkbox selection
    //     }}
    //     disableCloseOnSelect
    //     SelectProps={{
    //       multiple: true,
    //       autoClose: false, // Disable automatic closing
    //       renderValue: (selected) => {
    //           return selected.map((value) => {
    //             const option = Weekdays.find((item) => item.id === value);
    //             return option.label;
    //           }).join(', ');
    //         // }
    //       },
    //     }}
    //   >

    //     {Weekdays.map((item) => (
    //       <MenuItem
    //         key={item.id}
    //         value={item.id}
    //       >
    //         <Checkbox checked={selectedValue.includes(item.id)} />
    //         {item.label}
    //       </MenuItem>
    //     ))}
    //   </TextField>

    return (
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={Weekdays}
        disableCloseOnSelect
        value={selectedValue} // This sets the selected values
        onChange={onChange} // This handles changes in selection
        getOptionLabel={(option) => option.label}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Days" placeholder="Favorites" />
        )}
      />
    );
  };

  return (
    <div className="single" >
      <div className="singleContainer">
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Manage Staffs Leaves</DialogTitle>
          <DialogContent>
            <Card style={{ padding: "5px", backgroundColor: "white" }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                mb={4}
              >
                <MultiSelector
                  label="Department"
                  options={departments}
                  selectedValues={selectedDepartments}
                  onChange={handleDepartmentChange}
                />
                <MultiSelector
                  label="Designation"
                  options={designation}
                  selectedValues={selectedDesignations}
                  onChange={handleDesignationChange}
                />
              </Box>
              <Box
                flex="1 1 20%"
                backgroundColor={colors.primary[400]}
                padding="0px"
                borderRadius="4px"
                justifyContent="center"
                alignItems="flex-end"
                display="flex"
              >
                <Tabs
                  value={selectedChip}
                  onChange={(event, newValue) => handleChipClick(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab
                    label="Select By Date"
                    value="date"
                    style={{ margin: "1px" }}
                  />
                  <Tab
                    label="Select Range of Dates"
                    value="range"
                    style={{ margin: "1px" }}
                  />
                  <Tab
                    label="Select By Weekdays"
                    value="days"
                    style={{ margin: "1px" }}
                  />
                </Tabs>
              </Box>
              <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
                sx={{ mt: 2 }}
              >
                {selectedChip === "date" && <SingleDatePicker />}
                {selectedChip === "range" && <DateRangePicker />}
                {selectedChip === "days" && (
                  <DayMultiSelector
                    selectedValue={selectedDay}
                    onChange={handleDayChange}
                  />
                )}
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
              >
                <TextField
                  fullWidth
                  label="Add Description(optional)"
                  multiline
                  rows={1}
                  variant="outlined"
                  name="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
              >
                <Button
                  variant="contained"
                  sx={{ mr: 1 }}
                  color="secondary"
                  onClick={updateLeaves}
                >
                  {" "}
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ ml: 1 }}
                  onClick={deleteLeaves}
                >
                  {" "}
                  Delete
                </Button>
              </Box>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>

        <Box style={{marginBottom:'120px'}}>
          <Card style={{ padding: "12px", backgroundColor: "white" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2
                style={{
                  color: "black",
                  marginRight: "auto",
                  marginLeft: "7px",
                }}
              >
                View Staff Leaves
              </h2>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
                sx={{ marginLeft: "auto" }}
              >
                Manage Leaves
              </Button>
            </div>

            <Box
              display="flex"
              justifyContent="space-between"
              className="section"
            >
              {/* CALENDAR */}
              <Box flex="1 1 100%">
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={2}
                  sx={{ mt: 2 }}
                >
                  <MultiSelector
                    label="Filter By Departments"
                    options={departments}
                    selectedValues={selectedFilterDepartments}
                    onChange={handleFilterDepartmentChange}
                  />

                  <MultiSelector
                    label="Filter By Designations"
                    options={designation}
                    selectedValues={selectedFilterDesignations}
                    onChange={handleFilterDesignationChange}
                  />
                </Box>

                <FullCalendar
                  height="75vh"
                  ref={calendarRef}
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
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  select={handleDateClick}
                  eventClick={handleEventClick}
                />
              </Box>
            </Box>
          </Card>
        </Box>
      </div>
    </div>
  );
};

export default StaffLeaves;
