import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  Paper,
  Box,
  Grid,
  MenuItem,
  Checkbox,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import { toast } from "react-toastify";
import "./style/setup.scss";
// import Header from "../../components/Header";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";

const StudentSetup = () => {
  const [componentRows, setComponentRows] = useState([]);
  const [salary, setSalary] = useState([]);
  const [componentOrderCounter, setComponentOrderCounter] = useState(1);
  const [openSetUpModal, setOpenModal] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [designation, setDesignations] = useState([]);

  const getData = () => {
    api
      .get("salarycomponents")
      .then((response) => {
        console.log('response :>> ', response);
        setSalary(response.data);
      })
      .catch((error) => {
        console.error("Error fetching mediums:", error);
      });
  };
  const getDesignations = (departmentIds) => {
    console.log("departmentIds :>> ", departmentIds);
    api
      .get("designationbydepartment", {
        params: {
          departmentId: departmentIds,
        },
      })
      .then((designations) => {
        console.log("designations.data :>> ", designations.data);
        setDesignations(designations.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleCloseModal = () => {
    setSelectedDepartments([]);
    setMinSalary("");
    setMaxSalary("");
    getData();
    setOpenModal(false);
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    api
      .get("departments")
      .then((standards) => {
        setDepartments(standards.data.data);
        console.log('standards.data.dat :>> ', standards.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const { userToken } = useAuth();
  const api = AuthAxios(userToken);

  const UpdateSalary = () => {
    api
      .post("/salarycomponent", {
        components: componentRows,
      })
      .then((response) => {
        // Handle success
        console.log("Classes updated:", response.data);
        toast.success("Classes updated successfully");
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating classes:", error);
        toast.error("Error updating classes");
      });
  };
  const handleDepartmentChange = (event) => {
    console.log("event :>> ", event);
    event.stopPropagation();
    //console.log(event.target.value)
    if (event.target.value.includes("all")) {
      console.log("all selected");
      let ids = departments.map((value) => value.id);
      console.log("ids :>> ", ids);
      setSelectedDepartments(ids);
      getDesignations(ids);
    } else {
      getDesignations(event.target.value);
      setSelectedDepartments(event.target.value);
    }
  };
  const compTypes = [
    { id: 1, name: "addition" },
    { id: 2, name: "deduction" },
  ];

  const AddSalaryComponent = () => {
    console.log("AddSalaryComponent", componentRows);
    api
      .post("salarycomponents", {
        components: {
          min_range: minSalary,
          max_range: maxSalary,
          departmentIds : selectedDepartments,
          items: componentRows,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSelectedDepartments([]);
        setMinSalary("");
        setMaxSalary("");
        getData();
        toast.success("Salary Component added successfully");
      })
      .catch((error) => {
        toast.error("Error adding component: " + error?.response?.data?.error);
        console.error("Error adding component:", console.error);
      });
  };

  const DeleteSalaryComponents = (id) => {
    console.log('id :>> ', id);
    api
      .post("deletesalarycomponents", {
        ids: [id],
      })
      .then((response) => {
        getData();
        toast.success("Salary Component deleted successfully");
      })
      .catch((error) => {
        console.error("Error fetching mediums:", error);
        toast.error(
          "Error deleting component: " + error?.response?.data?.error
        );
      });
  };

  const handleCellValueChange = (orderNo, key, value) => {
    const updatedRows = componentRows.map((row) =>
      row.order_no === orderNo ? { ...row, [key]: value } : row
    );
    setComponentRows(updatedRows);
  };

  const handleAddRowComponent = () => {
    const newCompoentRow = {
      order_no: componentOrderCounter,
      component_name: "",
      component_type: "",
      component_value: "",
    };
    setComponentOrderCounter(componentOrderCounter + 1);
    setComponentRows([...componentRows, newCompoentRow]);
  };

  const handleDeleteRowComponent = (orderNo) => {
    const updatedRows = componentRows.filter((row) => row.order_no !== orderNo);
    setComponentRows(updatedRows);
    //setComponentOrderCounter(componentRows - 1);
  };
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

  const handleCloseWarning = () => {
    setAddPopup(false);
    setDeletePopup(false);
    setSelectedDate(null);
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
  const proceed = () => {
    if (popupEntranceTime >= popupExitTime) {
      alert("Entry time cannot be equal to or greater than exit time.");
      return;
    }
    api
      .post("/setTime", {
        entranceTime: popupEntranceTime,
        exitTime: popupExitTime,
      })
      .then((response) => {
        console.log("Time Set:", response.data);
        // Proceed with other actions if the check passes
        setAddPopup(false);
        setDeletePopup(false);
        setSelectedDate(null);
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

  const openModal = () => {
    setAddPopup(true);
  };
  return (
    <div className="new">
      <Dialog open={addPopup} onClose={handleCloseWarning}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Set the Time?
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
          <Button onClick={() => proceed()} color="primary">
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
      <Dialog open={openSetUpModal} onClose={handleCloseModal}>
        <DialogTitle>Salary Component</DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%", backgroundColor: "white", p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Minimum Salary"
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Maximum Salary"
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MultiSelector
                  label="Department"
                  options={departments}
                  selectedValues={selectedDepartments}
                  onChange={handleDepartmentChange}
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Component Name</TableCell>
                    <TableCell>Component Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {componentRows.map((row) => (
                    <TableRow key={row.order_no}>
                      <TableCell>
                        <TextField
                          type="text"
                          variant="outlined"
                          size="small"
                          value={row.component_name}
                          onChange={(event) =>
                            handleCellValueChange(
                              row.order_no,
                              "component_name",
                              event.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell style={{ padding: "4px", fontSize: "12px" }}>
                        <Select
                          label="Type"
                          name="component_type"
                          value={row?.component_type || "select"}
                          onChange={(event) =>
                            handleCellValueChange(
                              row.order_no,
                              "component_type",
                              event.target.value
                            )
                          }
                          size="small"
                        >
                          <MenuItem disabled value="select">
                            Select Component Type
                          </MenuItem>
                          {compTypes.map((item) => (
                            <MenuItem key={item?.id} value={item?.name}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          value={row.component_value}
                          onChange={(event) =>
                            handleCellValueChange(
                              row.order_no,
                              "component_value",
                              event.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteRowComponent(row.order_no)}
                          size="small"
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="tableButtons">
                <Button
                  btn-type="class"
                  variant="outlined"
                  color="primary"
                  onClick={handleAddRowComponent}
                >
                  Add Component
                </Button>
              </div>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="small" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={AddSalaryComponent}
            sx={{ marginRight: "10px" }}
          >
            Add Salary Component
          </Button>
        </DialogActions>
      </Dialog>
      <div className="newContainer">
        <Grid container>
          <Grid item xs={12} className="section">
         
            <Box m="15px" display="flex" alignItems="center">
              <h2 style={{ marginRight: "15px" }}>Add Component</h2>
             
              <Button variant="outlined" size="small" onClick={openModal}>
                Set Entry Time
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
                sx={{ marginLeft: "auto" }}
              >
                Manage Salary Component
              </Button>
            </Box>
            <div className="bottom">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Min Range</TableCell>
                      <TableCell>Max Range</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salary.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.min_range}</TableCell>
                        <TableCell>{row.max_range}</TableCell>
                        <TableCell>{row.department && row.department.department_name}</TableCell>
                        <TableCell>
                          <Button
                            variant="text"
                            color="error"
                            onClick={() => DeleteSalaryComponents(row.id)}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="tableButtons">
                  {/* <Button btn-type="medium" variant="outlined" color="primary" onClick={handleOpenWarning}>
                                    Update Salary Component
                                </Button> */}
                </div>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default StudentSetup;
