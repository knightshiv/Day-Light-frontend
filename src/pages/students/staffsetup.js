import React, { useState, useEffect } from "react";
import { Modal } from "antd"; // Assuming you are using Ant Design components

import {
  Button,
  Table,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Box,
  Grid,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./style/setup.scss";
import { toast } from "react-toastify";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";

const StaffSetup = () => {
  const [designationDataRows, setDesignationDataRows] = useState([]);
  const [designationOrderCounter, setDesignationOrderCounter] = useState(1);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [initialDesignationOrder, setInitialDesignationOrder] = useState(0);
  const [designationRows, setDesignationRows] = useState([
    {
      order_no: 1,
      designation_name: "",
      department_id: "",
      entry_time: "",
      exit_time: "",
    },
  ]);
  const initialDesignationRow = {
    order_no: 0,
    designation_name: "",
    department_id: "",
    entry_time: "",
    exit_time: "",
  };
  const handleDialogOpen = () => {
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    // Reset designationRows to initial state
    setDesignationRows([initialDesignationRow]);
    setDialogVisible(false);
  };
  const handleEditCellValueChange = (order_no, field, value) => {
    // Assuming selectedRow is an object in your state
    // Create a new object with the updated field
    const updatedRow = {
      ...selectedRow,
      [field]: value,
    };
  
    // Update the state with the new object
    setSelectedRow(updatedRow);
  };
  

  const handleCellValueChange = (orderNo, field, value) => {
    const updatedRows = designationRows.map((row) =>
      row.order_no === orderNo ? { ...row, [field]: value } : row
    );
    setDesignationRows(updatedRows);
  };

  const handleAddDesignationRow = () => {
    const newDesignationRow = {
      order_no: designationRows.length + 1,
      designation_name: "",
      department_id: "",
      entry_time: "",
      exit_time: "",
    };
    setDesignationRows([...designationRows, newDesignationRow]);
  };
  useEffect(() => {
    api
      .get("departments")
      .then((response) => {
        setDepartments(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  useEffect(() => {
    api
      .get("designations")
      .then((response) => {
        setDesignations(response.data);
        setDesignationDataRows(
          response.data.map((designation, index) => ({
            id: designation.id,
            order_no: designation.des_id,
            designation_name: designation.designation_name,
            department_name: designation.department.department_name,
            entry_time: designation.entry_time,
            exit_time: designation.exit_time,
          }))
        );
        setDesignationOrderCounter(response.data.length + 1);
        setInitialDesignationOrder(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching designations:", error);
      });
  }, []);

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);

  const handleUpdatedesignations = () => {
    const isValid = designationDataRows.every(
      (row) => row.entry_time < row.exit_time
    );
    if (!isValid) {
      toast.error("Start time must be less than end time for all rows");
      return;
    }

    api
      .post("/designations", { designations: designationDataRows })
      .then((response) => {
        console.log("Designations updated:", response.data);
        toast.success("Designations updated successfully");
      })
      .catch((error) => {
        console.error("Error updating designations:", error);
        toast.error("Error updating designations");
      });
  };

  const [openWarning, setOpenWarning] = useState(false);
  const handleFormSubmit = () => {
    // Validation: Check if entry time is not smaller than exit time
    if (selectedRow.entry_time > selectedRow.exit_time) {
      // Show an error message or take appropriate action
      console.error("Entry time must be less than exit time.");
      return;
    }
    return;
    // Call the submit function
    handleSubmit(selectedRow);

    // Close the modal
    handleEditModalClose();
  };
  const handleOpenWarning = () => {
    const isValid = designationDataRows.every(
      (row) => row.entry_time < row.exit_time
    );
    if (!isValid) {
      toast.error("Start time must be less than end time for all rows");
      return;
    }
    setOpenWarning(true);
  };
  const handleSubmit = () => {
    // Validate entry time and exit time for each row
    const isValid = designationRows.every(
      (row) =>
        new Date(`2000-01-01 ${row.entry_time}`) <
        new Date(`2000-01-01 ${row.exit_time}`)
    );

    // If any row has an invalid time range, show an error message and return
    if (!isValid) {
      toast.error("Start time must be less than end time for all rows");
      return;
    }

    // Proceed with the form submission logic
    console.log("Submitting data:", designationRows);
    api
      .post("/designations", { designations: designationRows })
      .then((response) => {
        console.log("Designations updated:", response.data);
        toast.success("Designations updated successfully");
      })
      .catch((error) => {
        console.error("Error updating designations:", error);
        toast.error("Error updating designations");
      });

    // You can perform actions like sending data to the server here
    // Reset the dialog state or close the dialog if needed
    handleDialogClose();
  };

  const handleEditFormSubmit = () => {
    // Add your validation logic here if needed
    if (selectedRow.entry_time >= selectedRow.exit_time) {
      // Show an error message or handle the error as needed
      toast.error("Start time must be less than end time");
      return;
    }
    api
    .post("/updateDesignation", { data: selectedRow })
    .then((response) => {
      // Handle success
      console.log("Designation updated:", response.data);
      toast.success('Designation updated successfully');
    })
    .catch((error) => {
      // Handle error
      console.error("Error updating Designation:", error);
      toast.error('Error updating Designation');
    });
    // Close the edit modal after submission
    handleEditModalClose();
  };
  const handleCloseWarning = () => {
    setOpenWarning(false);
  };

  const handleProceedUpdate = () => {
    handleUpdatedesignations();
    handleCloseWarning();
  };
  const handleDeleteRow = (orderNo) => {
    const updatedRows = designationRows.filter(
      (row) => row.order_no !== orderNo
    );
    setDesignationRows(updatedRows);
  };
  const handleEditRow = (id, type) => {
    api
    .get("designations/" + id)
    .then((response) => {
      const data = response.data;
      console.log(data);
      setSelectedRow(data);
      // handleOpenModal();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

    setEditModalVisible(true);
  };
  const handleEditModalClose = () => {
    // Close the edit modal or form and reset the editingRow state
    setEditModalVisible(false);
    setEditingRow(null);
  };
  return (
    <div className="new">
      <div className="newContainer">
        <Dialog open={openWarning} onClose={handleCloseWarning}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Once you created designations, they cannot be deleted within the
              current session. However, you can update and add new ones anytime.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProceedUpdate} color="primary">
              Proceed
            </Button>
            <Button onClick={handleCloseWarning} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isDialogVisible}
          onClose={handleDialogClose}
          maxWidth="lg" // You can adjust the size as needed
        >
          <DialogTitle>
            Add Designation &nbsp;{" "}
            <Button variant="outlined" onClick={handleAddDesignationRow}>
              Add Row
            </Button>
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              {designationRows.map((row) => (
                <Grid item xs={12} key={row.order_no}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <TextField
                        label="Designation Name"
                        value={row.designation_name}
                        onChange={(e) =>
                          handleCellValueChange(
                            row.order_no,
                            "designation_name",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Select
                        label="Designation"
                        name="department_id"
                        value={
                          row?.department_id ? row?.department_id : "select"
                        }
                        onChange={(event) =>
                          handleCellValueChange(
                            row.order_no,
                            "department_id",
                            event.target.value
                          )
                        }
                      >
                        <MenuItem disabled value="select">
                          Select Department
                        </MenuItem>
                        {departments.map((item) => (
                          <MenuItem key={item?.id} value={item?.id}>
                            {item?.department_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Entry Time"
                        type="time"
                        value={row.entry_time}
                        onChange={(e) =>
                          handleCellValueChange(
                            row.order_no,
                            "entry_time",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Exit Time"
                        type="time"
                        value={row.exit_time}
                        onChange={(e) =>
                          handleCellValueChange(
                            row.order_no,
                            "exit_time",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleDeleteRow(row.order_no)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined" onClick={handleDialogClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        
    <Dialog open={isEditModalVisible} onClose={handleEditModalClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Designation</DialogTitle>
      <DialogContent>
      <Grid container spacing={2} alignItems="center">
          {selectedRow ? (
            <>
              <Grid item xs={2}>
                <TextField
                  label="Order ID"
                  name="id"
                  disabled
                  value={selectedRow.id}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Designation Name"
                  value={selectedRow.designation_name}
                  onChange={(e) =>
                    handleEditCellValueChange(
                      selectedRow.order_no,
                      "designation_name",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <Select
                  label="Designation"
                  name="department_id"
                  value={selectedRow?.department_id ? selectedRow?.department_id : "select"}
                  onChange={(event) =>
                    handleEditCellValueChange(
                      selectedRow.order_no,
                      "department_id",
                      event.target.value
                    )
                  }
                >
                  <MenuItem disabled value="select">
                    Select Department
                  </MenuItem>
                  {departments.map((item) => (
                    <MenuItem key={item?.id} value={item?.id}>
                      {item?.department_name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Entry Time"
                  type="time"
                  value={selectedRow.entry_time}
                  onChange={(e) =>
                    handleEditCellValueChange(
                      selectedRow.order_no,
                      "entry_time",
                      e.target.value
                    )
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Exit Time"
                  type="time"
                  value={selectedRow.exit_time}
                  onChange={(e) =>
                    handleEditCellValueChange(
                      selectedRow.order_no,
                      "exit_time",
                      e.target.value
                    )
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </>
          ) : (
            <p>No data available</p>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
      <Button variant="outlined" onClick={handleEditFormSubmit}>
          Submit
        </Button>
        <Button variant="outlined" onClick={handleEditModalClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
        <Grid container>
          <Grid item xs={12} className="section">
            <Box m="20px">
              <h2>Add designations</h2>
              <Box display="flex" justifyContent="flex-start">
                <Button variant="outlined" onClick={handleDialogOpen}>
                  Create Designation
                </Button>
              </Box>
            </Box>
            <div className="bottom">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order No</TableCell>
                      <TableCell>Designation Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {designationDataRows.map((row) => (
                      <TableRow key={row.order_no}>
                        <TableCell>{row.order_no}</TableCell>
                        <TableCell>{row.designation_name}</TableCell>
                        <TableCell>{row.department_name}</TableCell>
                        <TableCell>{row.entry_time}</TableCell>
                        <TableCell>{row.exit_time}</TableCell>
                        <TableCell>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              handleEditRow(row.id, "designation")
                            }
                          >
                            <EditIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default StaffSetup;
