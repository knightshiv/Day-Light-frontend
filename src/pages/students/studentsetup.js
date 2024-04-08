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
import { toast } from 'react-toastify';
import "./style/setup.scss";
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
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [buttonType, setButtonType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  const [classRows, setClassRows] = useState([]);
  const [mediumRows, setMediumRows] = useState([]);
  const [classOrderCounter, setClassOrderCounter] = useState(1);
  const [mediumOrderCounter, setMediumOrderCounter] = useState(1);
  const [inputFields, setInputFields] = useState([{ id: 1, value: "" }]);

  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);

  const [initialClassOrder, setInitialClassOrder] = useState(0);
  const [initialMediumOrder, setInitialMediumOrder] = useState(0);

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
  const handleEditRow = (id,event) => {
    setButtonType('class');
    api
      .get("standards/" + id)
      .then((response) => {
        const data = response.data;
        setSelectedRow(data);
        handleOpenModal();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleMediumEditRow = (id) => {
    setButtonType('medium');

  //  return;
    api
      .get("mediums/" + id)
      .then((response) => {
        const data = response.data;
        console.log("datads",data);
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
  };
  useEffect(() => {
    api
      .get("mediums")
      .then((response) => {
        setMediums(response.data);
        setMediumRows(
          response.data.map((medium, index) => ({
            id:medium.id,
            order_no: medium.mid,
            medium_name: medium.type,
          }))
        );
        setMediumOrderCounter(response.data.length + 1);
        setInitialMediumOrder(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching mediums:", error);
      });

    api
      .get("standards")
      .then((response) => {
        setClasses(response.data);
        setClassRows(
          response.data.map((classItem, index) => ({
            id: classItem.id,
            order_no: classItem.order,
            class_name: classItem.class_name,
          }))
        );
        setClassOrderCounter(response.data.length + 1);
        setInitialClassOrder(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  const ModalComponent = ({ data, closeModal }) => {
    useEffect(() => {
      console.log(data); // Log the 'data' whenever it changes
    }, [data]);

    return (
      <div className="modal">
        <div className="modal-content">
          {data && data.class_name ? (
            <h1>{data.class_name}</h1>
          ) : (
            <p>No class name available</p>
          )}
          <button onClick={closeModal}>Close Modal</button>
        </div>
      </div>
    );
  };

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);

  const handleUpdateClasses = () => {
    // Call Axios function to update classes
    // For example:
    api
      .post("/standards", {
        classes: classRows,
      })
      .then((response) => {
        // Handle success
        console.log("Classes updated:", response.data);
        toast.success('Classes updated successfully');
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating classes:", error);
        toast.error('Error updating classes');
      });
  };

  const handleUpdateMediums = () => {
    console.log(inputFields);
   
    api
      .post("/mediums", {
        mediums: inputFields,
      })
      .then((response) => {
        // Handle success
        console.log("Classes updated:", response.data);
        toast.success('Classes updated successfully');
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating classes:", error);
        toast.error('Error updating classes');
      });
  };
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
  const handleAddClassRow = () => {
    const newClassRow = {
      order_no: classOrderCounter,
      class_name: "",
    };
    setClassOrderCounter(classOrderCounter + 1);
    setClassRows([...classRows, newClassRow]);
  };

  const handleAddMediumRow = () => {
    const newMediumRow = {
      order_no: mediumOrderCounter,
      medium_name: "",
    };
    setMediumOrderCounter(mediumOrderCounter + 1);
    setMediumRows([...mediumRows, newMediumRow]);
  };

  const handleUpdateData = () => {
    
    console.log(updatedData);
    api
      .post("/updateStandards", { data: updatedData })
      .then((response) => {
        // Handle success
        console.log("standard updated:", response.data);
        toast.success('Mediums updated successfully');
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating mediums:", error);
        toast.error('Error updating mediums');
      });
    handleCloseModal(); // Temporarily closing the modal without API interaction in this example
  };
  const handleMediumUpdateData = () => {
    
    console.log(updatedData);
    api
      .post("/updateMediums", { data: updatedData })
      .then((response) => {
        // Handle success
        console.log("standard updated:", response.data);
        toast.success('Mediums updated successfully');
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating mediums:", error);
        toast.error('Error updating mediums');
      });
    handleCloseModal(); // Temporarily closing the modal without API interaction in this example
  };
  const handleDeleteRow = (orderNo, type) => {
    if (type === "class") {
      // Check if the row is present in the initial classes data
      const initialClass = classes.find(
        (classItem, index) => classItem.order === orderNo
      );
      if (initialClass) {
        console.log("Cannot delete initial class:", initialClass.class_name);
        toast.error('Cannot delete initial class');
        return;
      }
      const updatedRows = classRows.filter((row) => row.order_no !== orderNo);
      // Adjust order numbers of remaining rows
      const updatedRowsWithAdjustedOrder = updatedRows.map((row, index) => ({
        ...row,
        order_no: index + 1,
      }));
      setClassRows(updatedRowsWithAdjustedOrder);

      setClassOrderCounter(classOrderCounter - 1);
    } else if (type === "medium") {
      // Check if the row is present in the initial mediums data
      const initialMedium = mediums.find(
        (medium, index) => medium.mid === orderNo
      );
      if (initialMedium) {
        console.log("Cannot delete initial medium:", initialMedium.medium_name);
        toast.error('Cannot delete initial medium');
        return;
      }
      const updatedRows = mediumRows.filter((row) => row.order_no !== orderNo);
      setMediumRows(updatedRows);
      setMediumOrderCounter(mediumOrderCounter - 1);
    }
  };

  const handleCellValueChange = (orderNo, key, value, type) => {
    if (type === "class") {
      const updatedRows = classRows.map((row) =>
        row.order_no === orderNo ? { ...row, [key]: value } : row
      );
      setClassRows(updatedRows);
    } else if (type === "medium") {
      const updatedRows = mediumRows.map((row) =>
        row.order_no === orderNo ? { ...row, [key]: value } : row
      );
      setMediumRows(updatedRows);
    }
  };

  const [openWarning, setOpenWarning] = useState(false);
  const [openEditBox, setOpenEditBox] = useState(false);
  const [popupType, setPopupType] = useState("");

  const handleOpenWarning = (e) => {
   
    setOpenWarning(true);
    setPopupType(buttonType);
  };
  const handleFieldChange = (event, id) => {
    const { name, value } = event.target;

    // Update 'updatedData' including the 'id' field
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
      id: id, // Update 'id' with the provided 'id'
    }));
  };

  const handleUpdateForm = () => {
    // Pass the array of objects to your function for further processing
    console.log(inputFields);
    api
      .post("/standards", {
        classes: inputFields,
      })
      .then((response) => {
        // Handle success
        console.log("Classes updated:", response.data);
        toast.success('Classes updated successfully');
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating classes:", error);
        toast.error('Error updating classes');
      });
  };
  // You can perform actions with inputFields array here

  const handleProceedUpdate = () => {
    console.log(inputFields);
    if (popupType === "class") {
      handleUpdateForm();
    } else if (popupType === "medium") {
      handleUpdateMediums();
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
          {buttonType === 'class' ? 'Add Class' : 'Add Medium'}&nbsp;
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
                  label={`Add ${buttonType === 'class' ? 'Class' : 'Medium'}`}
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
          <DialogTitle>Edit {buttonType === 'class' ? ' Class' : ' Medium'}
           </DialogTitle>
          <DialogContent>
            {selectedRow ? (
              <>
                <label>Order ID</label>
                <br />
                <TextField
                  // label="Order ID"
                  name="id"
                  disabled
                  value={selectedRow.id} // Set the ID value
                />
              <TextField
              label={buttonType === 'class' ? 'Class Name' : 'Type'} // Set label based on buttonType
              name={buttonType === 'class' ? 'class_name' : 'type'} // Set name based on buttonType
              value={
                buttonType === 'class'
                  ? updatedData.class_name || selectedRow.class_name // Display class_name if buttonType is 'class'
                  : updatedData.type || selectedRow.type // Display type otherwise
              }
              onChange={(e) => handleFieldChange(e, selectedRow.id)}
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
            <Button onClick={buttonType === 'class' ? handleUpdateData : handleMediumUpdateData} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container>
          <Grid item xs={6} className="section">
            <div className="">
              <TableContainer component={Paper}>
                <Box m="20px">
                  <Card style={{ padding: "7px", backgroundColor: "" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <h2 style={{ color: "", margin: 0 }}>Add Classes</h2>
                      <Button
                        btn-type="class"
                        variant="outlined"
                        color="error"
                        onClick={handleClickOpen}
                      >
                        Add Class
                      </Button>
                      {/* <Button
                    variant="outlined"
                    color="error"
                    onClick={handleAddClassRow}
                  >
                    Add
                  </Button> */}
                    </Box>
                  </Card>
                </Box>
                <Table sx={{ minWidth: 250 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Class Name</TableCell>
                      <TableCell align="right">Action&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classRows.map((row) => (
                      <TableRow
                        key={row.order_no}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left" component="th" scope="row">
                          {row.class_name}
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

          <Grid item xs={6} className="section">
            <div className="">
              <TableContainer component={Paper}>
                <Box m="20px">
                  <Card style={{ padding: "7px", backgroundColor: "" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <h2>Add Medium</h2>
                      <Button
                        btn-type="medium"
                        variant="outlined"
                        color="error"
                        onClick={handleClickOpen}
                      >
                        Add Medium
                      </Button>
                    </Box>
                  </Card>
                </Box>
                <Table sx={{ minWidth: 250 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Medium</TableCell>
                      <TableCell align="right">Action&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mediumRows.map((row) => (
                      <TableRow
                        key={row.order_no}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left" component="th" scope="row">
                          {row.medium_name}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                          btn-type="class"
                            variant="text"
                            color="primary"
                            onClick={() => {
                              handleMediumEditRow(row.id);
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
