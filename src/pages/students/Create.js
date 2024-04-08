import React, { useState,useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import "./style/create.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {  toast } from 'react-toastify';
import { tokens } from "../../theme";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DownloadIcon from '@mui/icons-material/Download';
import UploadPopup from '../../components/UploadPopup.js';

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';

const CreateStudentForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {userToken} = useAuth();
  const api = AuthAxios(userToken);

 
  useEffect(() => {
    // Fetch data from an API using Axios
    api
      .get('mediums')
      .then(response => {
        const data = response.data;
        setMediums(data); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      api
      .get('standards')
      .then(response => {
        const data = response.data;
        setClasses(data); 
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, []);

  const handleSampleDownload = async () => {
    try {
      const response = await api.get('download-sample-excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample-excel.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading sample Excel file:', error);
    }
  };

  const handleBulkUpload = async  (file) => {
    // Implement your file upload logic here
    console.log('Uploading file:', file);
    try {
      
      const formData = new FormData();
  
      if (file) {
        formData.append("excel_sheet", file);
      }
  
      // Make an HTTP POST request to the backend API to create the user
      const response = await api.post('upload-student-excel', 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // The created user data will be available in the response object
      console.log("Upload Succesful:", response.data);
      toast.success('Students uploaded successfully !', {
        position: toast.POSITION.TOP_RIGHT
      });
      //toast("User created Succesfully!")
      return response.data;
    } catch (error) {
      // Handle errors if the request fails
      toast.error('Error creating students !', {
        position: toast.POSITION.TOP_CENTER
      });
      console.error("Error uploading sheet:", error);
      throw error;
    }
  };

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    class_id: "",
    medium_id: "",
    section:"",
    admission_no: "",
    sr_no: "",
    roll_no: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    gender: "",
    dob: "",
    joining_date: "",
    address: "",
  });


const createUser = async (userData) => {
  try {
    console.log(userData);

    const formData = new FormData();

      for (const key in userData) {
        formData.append(key, userData[key]);
      }

      // Append the selectedFile to the FormData
      if (selectedFile) {
        formData.append("student_image", selectedFile);
      }

    // Make an HTTP POST request to the backend API to create the user
    const response = await api.post(
      'students', 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // The created user data will be available in the response object
    console.log("User created:", response.data);
    toast("User created Succesfully!")
    return response.data;
  } catch (error) {
    // Handle errors if the request fails
    console.error("Error creating user:", error);
    throw error;
  }
};


const handleSubmit = async (event) => {
  event.preventDefault();
  console.log("Submit")
  try {
    // Call the createUser function with the userData to create the user
    const createdUser = await createUser(userData);
    // Handle the success case, e.g., show a success message

    refresh();
    toast.success('User created successfully !', {
      position: toast.POSITION.TOP_RIGHT
    });
    //toast("User created successfully:", createdUser);
    console.log("User created successfully:", createdUser);
  } catch (error) {
    // Handle the error case, e.g., show an error message
    toast.error('Error creating user ! \n' + error?.response?.data?.error, {
      position: toast.POSITION.TOP_CENTER
    });
    console.error("Error creating user:", error?.response?.data?.error);
  }
};

const handleChange = (event) => {
  const { name, value } = event.target;
  setUserData((prevUserData) => ({
    ...prevUserData,
    [name]: value,
  }));
};


const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};

  const refresh = () => {
    Object.keys(userData).forEach(key => userData[key]="");
    setSelectedFile(null);
  };

  return (
    <div className="new">
      <div style={{float: 'left'}}>
        </div>
      <div className="newContainer">
        <Box m="20px">
          <Box display='flex' justifyContent="flex-end" >
            
            <Button 
              variant="contained" 
              startIcon={<GroupAddIcon />} 
              endIcon = {<TextSnippetIcon/>}
              color = "primary" 
              sx={{  mr:1}} 
              onClick={() => setPopupOpen(true)}>
              
              Add Students(Bulk)
            </Button>

            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />} 
              endIcon = {<TextSnippetIcon/>}
              color = "secondary" 
              sx={{  mr:2}} 
              onClick={ handleSampleDownload}>
              Download Sample
            </Button>

          </Box>
        </Box>  

        <UploadPopup open={isPopupOpen} onClose={() => setPopupOpen(false)} onUpload={handleBulkUpload} />

        <div className="bottom">
        
        <Box 
          minHeight="100vh" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          // bgcolor="#e2e2e2"
        >
          <form enctype="multipart/form-data" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="left">
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                    }
                    alt=""
                  />
                </div>
              </Grid>
                    
              <Grid item xs={6} rowSpan={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  height="100%"
                >
                  <input 
                    type="file"
                    name="student_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="image-upload"
                  />

                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      startIcon={<DriveFolderUploadOutlinedIcon />}
                      color="primary"
                      component="span"
                    >
                      Upload Image
                    </Button>
                  </label>
                  {selectedFile && (
                    <div>Selected file: {selectedFile.name}</div>
                  )}
                </Box>
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="First Name" variant="outlined" name="first_name" value={userData?.first_name} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Last Name" variant="outlined" name="last_name" value={userData?.last_name} onChange={handleChange} />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Section" variant="outlined" name="section" value={userData?.section} onChange={handleChange} />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Standard</InputLabel>
                  <Select label="Standard" name="class_id" value={userData?.class_id} onChange={handleChange} >
                  <MenuItem disabled value="">Select Class</MenuItem>
                    {classes.map(item => (
                      <MenuItem key={item.order} value={item.order}>{item.class_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>


              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Medium</InputLabel>
                  <Select label="Medium" name="medium_id" value={userData?.medium_id} onChange={handleChange} >
                  <MenuItem disabled value="">Select Class</MenuItem>

                    {mediums.map(item => (
                      <MenuItem key={item.id} value={item.id}>{item.type}</MenuItem>
                    ))}
                    
                  </Select>
                </FormControl>
              </Grid>


              <Grid item xs={6}>
                <TextField fullWidth label="Admission No" variant="outlined" name="admission_no" value={userData?.admission_no} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Roll No" variant="outlined" name="roll_no" value={userData.roll_no} onChange={handleChange}/>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Parent Name" variant="outlined" name="parent_name" value={userData.parent_name} onChange={handleChange}/>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Parent Phone" variant="outlined" name="parent_phone" value={userData.parent_phone} onChange={handleChange}/>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Parent Email" variant="outlined" name="parent_email" value={userData.parent_email} onChange={handleChange}/>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="SR No" variant="outlined" name="sr_no" value={userData.sr_no} onChange={handleChange}/>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Gender</InputLabel>
                  <Select label="Gender" name="gender" value={userData.gender} onChange={handleChange}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    {/* Add more options as needed */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="DOB"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true, // This will remove the placeholder text
                }}
                  name="dob" value={userData.dob} onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true, // This will remove the placeholder text
                }}
                  name="joining_date" value={userData.joining_date} onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  variant="outlined"
                  name="address" value={userData.address} onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default CreateStudentForm;
