import "./leaves.scss";

import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {  Tab, Tabs } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuIcon from '@mui/icons-material/Menu';
import Container from 'react-bootstrap/Container';
import {
  useTheme,
  Checkbox,
  TextField,   
  MenuItem,
  Chip
} from "@mui/material";

import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addDays } from "date-fns"; // Import the addDays function from date-fns

import { tokens } from "../../theme";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";
import {  toast } from 'react-toastify';

const StudentLeaves = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);
  const calendarRef = useRef(null);

  const [classes, setClasses] = useState([]);
  const [medium, setMediums] = useState([]);  

  const [selectedChip, setSelectedChip] = useState("days");

  const [singleDate, setSingleDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState([]); // Default to Sunday
  const [description, setDescription] = useState('');

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedMediums, setSelectedMediums] = useState([]);

  const [selectedFilterClasses, setSelectedFilterClasses] = useState([]);
  const [selectedFilterMediums, setSelectedFilterMediums] = useState([]);


  const handleTabChange = (event, newValue) => {
    setSelectedChip(newValue);
  };
  // set these values with api with current session
  const minDate = new Date("07-01-2023");
  const maxDate = addDays(minDate, 365);

  const Weekdays = [
    {id:0, label:"Sunday"},
    {id:1, label:"Monday"},
    {id:2, label:"Tuesday"},
    {id:3, label:"Wednesday"},
    {id:4, label:"Thursday"},
    {id:5, label:"Friday"},
    {id:6, label:"Saturday"},
  ]

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    getLeaves();
  }, [selectedFilterClasses, selectedFilterMediums]);

  useEffect(() => {
    api
      .get("mediums")
      .then((mediums) => {
        setMediums(mediums.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    api
      .get("standards")
      .then((standards) => {
        setClasses(standards.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getLeaves = async () => {
    console.log("Getting leaves...");
    await api
    .get('leaves/', {
      params: {
        classIds: selectedFilterClasses,
        mediumIds: selectedFilterMediums,
      },
    })
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of student data
        // eslint-disable-next-line array-callback-return
        if (calendarRef.current) {

          calendarRef.current.getApi().removeAllEvents();
          
          // Create a set to store unique event days
          const uniqueEventDays = new Set();
          data.map((event) => {
              if (!uniqueEventDays.has(event.day)) {
                calendarRef.current.getApi().addEvent({
                  id: event.id,
                  title: (event.desc != null && event.desc !== '') ? event.desc : 'Leave',
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
  }

  const updateLeaves = () => {

    if(selectedClasses.length < 1){
      toast.error('Please select at least one class')
      return
    }

    if(selectedMediums.length < 1){
      toast.error('Please select at least one medium')
      return
    }

    let postData =  { 
      classIds: selectedClasses,
      mediumIds : selectedMediums, 
      description: description ,
      action: null
    }

    if(selectedChip === 'days'){
      postData.type = 'days';
      postData.days = selectedDay
    }

    if(selectedChip === 'date'){
      postData.type = 'single';
      postData.singleDate = singleDate
    }

    if(selectedChip === 'range'){
      postData.type = 'range';
      postData.startDate = startDate;
      postData.endDate = endDate;
    }

    console.log("postData",postData);
    api.post('leaves/', postData)
      .then(response => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("staff data", data);
        getLeaves()
        refreshData()
        toast.success('Leaves created succesfully!!!')
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Error creating Leaves:', error.response.data)
    });
  }

  const deleteLeaves = () => {

    if(selectedClasses.length < 1){
      toast.error('Please select at least one class')
      return
    }

    if(selectedMediums.length < 1){
      toast.error('Please select at least one medium')
      return
    }

    let postData =  { 
      classIds: selectedClasses,
      mediumIds : selectedMediums, 
      description: '' ,
      action: null
    }

    if(selectedChip === 'days'){
      postData.type = 'days';
      postData.days = selectedDay
    }

    if(selectedChip === 'date'){
      postData.type = 'single';
      postData.singleDate = singleDate
    }

    if(selectedChip === 'range'){
      postData.type = 'range';
      postData.startDate = startDate;
      postData.endDate = endDate;
    }

    console.log("postData",postData);
    api.post('deleteleaves/', postData)
      .then(response => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("delete data", data);
        getLeaves()
        refreshData()
        toast.success('Leaves deleted succesfully!!!')
      })
      .catch(error => {
        console.error('Error deleting data:', error);
        toast.error('Error deleting Leaves:', error.response.data)
    });
  }

  const refreshData = () => {
    setDescription('')
    setSingleDate(null)
    setStartDate(null)
    setEndDate(null)
    setSelectedDay([])
    setSelectedClasses([])
    setSelectedMediums([])
  }

  const handleChipClick = (chipLabel) => {
    setSelectedChip(chipLabel);
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

  const handleDayChange = (event,value) => {
    console.log(event,value);
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

  const handleClassChange = (event) => {
    event.stopPropagation();
    //console.log(event.target.value)
    if(event.target.value.includes('all')){
      console.log('all selected');
      let ids = classes.map(value=>value.id);
      setSelectedClasses(ids);
    }else
      setSelectedClasses(event.target.value);
  };

  const handleMediumChange = (event) => {
    if(event.target.value.includes('all')){
      console.log('all selected');
      let ids = medium.map(value=>value.id);
      setSelectedMediums(ids);
    }else
      setSelectedMediums(event.target.value);
  };

  const handleFilterClassChange = (event) => {
    if(event.target.value.includes('all')){
      console.log('all selected');
      let ids = classes.map(value=>value.id);
      setSelectedFilterClasses(ids);
    }else
      setSelectedFilterClasses(event.target.value);
  };

  const handleFilterMediumChange = (event) => {
    if(event.target.value.includes('all')){
      console.log('all selected');
      let ids = medium.map(value=>value.id);
      setSelectedFilterMediums(ids);
    }else
      setSelectedFilterMediums(event.target.value);
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
  
    const isSelectAllChecked = options.every(item => selectedValues.includes(item.id));
    const isClassLabel = label === "Class" || label === "Filter By Classes"
    const padding = isClassLabel?{mr:1}:{ml:1}

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
              return selected.map((value) => {
                const option = options.find((item) => item.id === value);
                return isClassLabel ? option.class_name : option.type;
              }).join(', ');
            // }
          },
        }}
        MenuProps={{
          disableAutoFocusItem: true, // Prevent closing on checkbox selection
        }}
      >
        <MenuItem value='all'>
          <Checkbox checked={isSelectAllChecked} />
          Select All
        </MenuItem>
        {options.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
          >
            <Checkbox
              checked={selectedValues.includes(
                item.id
              )}
            />
            {isClassLabel ? item.class_name : item.type}
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
        fullWidth="medium"
        onChange={onChange}
        MenuProps={{
          disableAutoFocusItem: true, // Prevent closing on checkbox selection
        }}
        disableCloseOnSelect
        SelectProps={{
          multiple: true,
          autoClose: false, // Disable automatic closing
          renderValue: (selected) => {
              return selected.map((value) => {
                const option = Weekdays.find((item) => item.id === value);
                return option.label;
              }).join(', ');
            // }
          },
        }}
      >

        {Weekdays.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
          >
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
    //     fullWidth="medium"
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
    <div className="single">
      <div className="singleContainer">
        {/* <ToastContainer /> */}
        <Box m="20px">
        <Card style={{padding:'12px', backgroundColor:'white'}}>
        <Container>
         <h2 style={{color:"black",marginLeft:"7px"}}>Manage Student Leaves</h2>
        </Container>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            mb={2}
          >

            <MultiSelector
              label="Class"
              options={classes}
              selectedValues={selectedClasses}
              onChange={handleClassChange}
            />
            <MultiSelector
              label="Medium"
              options={medium}
              selectedValues={selectedMediums}
              onChange={handleMediumChange}
            />
          </Box>
          <Box
      flex="1 1 20%"
      backgroundColor={colors.primary[400]}
      p="15px"
      borderRadius="4px"
      justifyContent="center"
      alignItems="flex-end"
      justifyItems="center"
      display="flex"
    >
      <Tabs value={selectedChip} onChange={handleTabChange}>
        <Tab
          label="Select By Date"
          value="date"
          onClick={() => handleChipClick('date')}
          wrapped
        />
        <Tab
          label="Select Range of Dates"
          value="range"
          onClick={() => handleChipClick('range')}
          wrapped
        />
        <Tab
          label="Select By Weekdays"
          value="days"
          onClick={() => handleChipClick('days')}
          wrapped
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
                  name="desc" value={description} onChange={(e)=> setDescription(e.target.value)}
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
              sx={{mr:1}}
              color="secondary"
              onClick={updateLeaves}
            > Update</Button>
            <Button
              variant="contained"
              sx={{ml:1}}
              color="secondary"
              onClick={deleteLeaves}
            > Delete</Button>
          </Box>

      </Card>
      </Box>
      <Box m="20px">
      <Card style={{padding:'12px', backgroundColor:'white'}}>
        <Container>
         <h2 style={{color:"black",marginLeft:"7px"}}>View Students Leaves</h2>
        </Container>
          <Box
            display="flex"
            justifyContent="space-between"
            className="section"
          >  
   
            {/* CALENDAR */}     
            <Box flex="1 1 100%" >  
              <Box  flex="1"        
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                    sx={{ mt: 2 }} 
              >

                  <MultiSelector
                    label="Filter By Classes"
                    options={classes}
                    selectedValues={selectedFilterClasses}
                    onChange={handleFilterClassChange}
                  />
                
                  <MultiSelector  
                    label="Filter By Mediums"
                    options={medium}
                    selectedValues={selectedFilterMediums}
                    onChange={handleFilterMediumChange}    
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

export default StudentLeaves;
