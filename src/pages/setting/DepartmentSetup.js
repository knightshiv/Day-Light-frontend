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
  Paper,
  Box,
  Grid,
  Card,
} from "@mui/material";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import axios from "axios";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";
import Slide from "@mui/material/Slide";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const StudentSetup = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [buttonType, setButtonType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    id: null, // assuming 'id' is always present
    department_name: "",
  });

  const [departmentRows, setdepartmentRows] = useState([]);
  const [mediumRows, setMediumRows] = useState([]);
  const [classOrderCounter, setClassOrderCounter] = useState(1);
  const [inputFields, setInputFields] = useState([{ id: 1, value: "" }]);

  const [classes, setClasses] = useState([]);

  const [initialClassOrder, setInitialClassOrder] = useState(0);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (event) => {
    const btnType = event.currentTarget.getAttribute("btn-type");
    console.log("btn-type:", btnType); // Output: 'class' when the button is clicked
    setButtonType(btnType);
    setOpen(true);
  };

  // In your JSX:
  <Button
    btn-type="class"
    variant="outlined"
    color="error"
    onClick={handleClickOpen}
  >
    Click me
  </Button>;

  const handleCloseWarning = () => {
    setOpenWarning(false);
  };
  const handleEditRow = (id) => {
    api
      .get("departments/" + id)
      .then((response) => {
        const data = response.data;
        setSelectedRow(data);
        handleOpenModal();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setInputFields([{ id: 1, value: "" }]);
  };
  useEffect(() => {
    api
      .get("departments")
      .then((response) => {
        setClasses(response.data.data);
        setdepartmentRows(
          response.data.data.map((classItem, index) => ({
            id: classItem.id,
            dep_id: classItem.dep_id,
            department_name: classItem.department_name,
          }))
        );
        setClassOrderCounter(response.data.length + 1);
        setInitialClassOrder(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);

  const handleAddInputField = () => {
    const newId = inputFields.length + 1;
    const newInputFields = [...inputFields, { id: newId, value: "" }];
    setInputFields(newInputFields);
  };

  const handleRemoveInputField = (id) => {
    const updatedInputFields = inputFields.filter((field) => field.id !== id);
    setInputFields(updatedInputFields);
  };

  const handleInputChange = (id, value) => {
    const updatedInputFields = inputFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setInputFields(updatedInputFields);
  };

  const handleUpdateData = () => {
    console.log(selectedRow);
    api
      .post("/updateDepartments", { data: selectedRow })
      .then((response) => {
        // Handle success
        console.log("standard updated:", response.data);
        toast.success("Mediums updated successfully");
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating mediums:", error);
        toast.error("Error updating mediums");
      });
    handleCloseModal();
  };

  const [openWarning, setOpenWarning] = useState(false);
  const [openEditBox, setOpenEditBox] = useState(false);
  const [popupType, setPopupType] = useState("");

  const handleOpenWarning = (e) => {
    setOpenWarning(true);
    setPopupType(buttonType);
  };
  const handleFieldChange = (field, value) => {
    const updatedRow = {
      ...selectedRow,
      [field]: value,
    };
    setSelectedRow(updatedRow);
  };

  const handleUpdateForm = () => {
    // Pass the array of objects to your function for further processing
    console.log(inputFields);
    api
      .post("/departments", {
        departments: inputFields,
      })
      .then((response) => {
        // Handle success
        console.log("Classes Department:", response.data);
        toast.success(" Department successfully");
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating Department:", error);
        toast.error("Error updating Department");
      });
    handleClose();
  };
  // You can perform actions with inputFields array here

  const handleProceedUpdate = () => {
    console.log(inputFields);
    if (popupType === "class") {
      handleUpdateForm();
    }
    handleCloseWarning();
  };

  return (
    <div className="new">
      <div className="newContainer">
        {/* Warning Dialog */}
        <Dialog open={openWarning} onClose={handleCloseWarning}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Once you create classes or mediums, they cannot be deleted within
              the current session. However, you can update and add new ones
              anytime.
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

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ textAlign: "center" }}>
            Add Department&nbsp;
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={handleAddInputField}
            >
              <AddIcon />
            </Button>
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {inputFields.map((field) => (
              <div
                key={field.id}
                style={{ marginBottom: "10px", textAlign: "right" }}
              >
                <TextField
                  value={field.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  label={`Add Department`}
                  variant="outlined"
                />
                &nbsp;
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveInputField(field.id)}
                >
                  <RemoveIcon />
                </Button>
              </div>
            ))}
          </DialogContent>
          <hr style={{ backgroundColor: "black" }} />
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleOpenWarning} btn-type="class">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditBox} onClose={handleClose}>
          <DialogTitle sx={{ textAlign: "center" }}>
            {"Add Class"} &nbsp;
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={handleAddInputField}
            >
              <AddIcon />
            </Button>
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {inputFields.map((field) => (
              <div
                key={field.id}
                style={{ marginBottom: "10px", textAlign: "right" }}
              >
                <TextField
                  value={field.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  label={`Add Class`}
                  variant="outlined"
                />
                &nbsp;
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveInputField(field.id)}
                >
                  <RemoveIcon />
                </Button>
              </div>
            ))}
          </DialogContent>
          <hr style={{ backgroundColor: "black" }} />
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleOpenWarning} btn-type="class">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogContent>
            {selectedRow ? (
              <>
                <label>Dep ID</label>
                <br />
                <TextField
                  // label="Order ID"
                  name="id"
                  disabled
                  value={selectedRow.dep_id} // Set the ID value
                />
                <TextField
                  label="Department Name" // Set label based on buttonType
                  name="department_name" // Set name based on buttonType
                  value={selectedRow.department_name || ""}
                  onChange={(e) =>
                    handleFieldChange("department_name", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              </>
            ) : (
              <p>No data available</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
            <Button onClick={() => handleUpdateData()} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container>
          <Grid item xs={12} className="section">
            <div className="">
              <TableContainer component={Paper}>
                <Box m="20px">
                  <Card style={{ padding: "7px", backgroundColor: "" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <h2 style={{ color: "", margin: 0 }}>
                        {" "}
                        Departments List
                      </h2>
                      <Button
                        btn-type="class"
                        variant="outlined"
                        color="error"
                        onClick={handleClickOpen}
                      >
                        Add Department
                      </Button>
                    </Box>
                  </Card>
                </Box>
                <Table sx={{ minWidth: 250 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Department Name</TableCell>
                      <TableCell align="right">Action&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departmentRows.map((row) => (
                      <TableRow
                        key={row.dep_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left" component="th" scope="row">
                          {row.department_name}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            btn-type="class"
                            variant="text"
                            color="primary"
                            onClick={() => {
                              handleEditRow(row.id);
                            }}
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

export default StudentSetup;
