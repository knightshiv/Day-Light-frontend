import React, { useState,useEffect } from "react";
import { useParams } from 'react-router-dom';

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
  Typography,
} from "@mui/material";
import "./style/update.scss";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import { tokens } from "../../theme";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DownloadIcon from '@mui/icons-material/Download';
import {BASE_URL, API_BASE_URL, STUDENTS_API, MEDIUMS_API,STANDARDS_API } from "../../config/constants";
import { toast } from 'react-toastify';

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';


const UpdateStudentForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentImage, setStudentImage] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);

  const {userToken} = useAuth();
  const api = AuthAxios(userToken);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
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


  useEffect(() => {
    //console.log("starting")
    api.get('students/' + id).then(response =>{
        const data = response.data;
        userData.first_name = data?.first_name;
        userData.last_name = data?.last_name;
        userData.parent_name = data?.parent_name;
        userData.parent_email = data?.parent_email;
        userData.parent_phone = data?.parent_phone;
        userData.address = data?.address;
        userData.admission_no = data?.admission_no;
        userData.roll_no = data?.roll_no;
        userData.sr_no = data?.sr_no;
        userData.dob = data?.dob;
        userData.gender = data?.gender;
        userData.section = data?.section;
        userData.class_id = data.class_id;
        userData.medium_id = data.medium_id;
        userData.joining_date = data.joining_date;
        
        setThumbnail(data.student_image_thumbnail)
        console.log(data.student_image_thumbnail)
        //userData.student_image = data?.student_image;

        setStudentImage(data.student_image);

    }).catch(err => {
        console.error('Error fetching data:', err);
    });

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

  }, [id,refreshPage]);

 
const updateUser = async (userData) => {
  try {
    console.log(userData);

    const formData = new FormData();

      for (const key in userData) {
        if( userData[key] != null && userData[key] !== "") 
            formData.append(key, userData[key]);
      }

      // Append the selectedFile to the FormData
      if (selectedFile) {
        formData.append("student_image", selectedFile);
      }

    // Make an HTTP POST request to the backend API to create the user
    const response = await api.put(
        'students/' + id, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // The updated user data will be available in the response object
    console.log("User updated:", response.data);
    toast.success('Excel updloaded successfully !', {
      position: toast.POSITION.TOP_CENTER
    });
    return response.data;
  } catch (error) {
    toast.error('Error updating excel !', {
      position: toast.POSITION.TOP_CENTER
    });
    console.error("Error creating user:", error.message);
    throw error;
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log("Submit")
  try {
    // Call the updateUser function with the userData to create the user
    const createdUser = await updateUser(userData);
    // Handle the success case, e.g., show a success message

    refresh();
    setRefreshPage(!refreshPage);
    toast.success('User updated successfully !', {
      position: toast.POSITION.TOP_RIGHT
    });
    //toast("User updated successfully:", createdUser);
    console.log("User updated successfully:", createdUser);
  } catch (error) {
    // Handle the error case, e.g., show an error message
    toast.error('Error creating user !', {
      position: toast.POSITION.TOP_CENTER
    });
    console.error("Error creating user:", error);
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
    //Object.keys(userData).forEach(key => userData[key]="");
    setSelectedFile(null);
  };

  return (
    <div className="new" >
      <div className="newContainer">
       

        <div className="top" style={{backgroundColor:'white'}}> 
        
        <Box 
          minHeight="80vh" 
          // style={{marginTop:'0px'}}
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          //bgcolor="#e2e2e2"
        >
          <form enctype="multipart/form-data" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="left">
                  <img
                    src={
                      selectedFile ? URL.createObjectURL(selectedFile)
                        : thumbnail? 'data:image/png;base64,' + thumbnail  :"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                    }
                    alt=""
                  />
                </div>
              </Grid>
              <Grid item xs={6} >
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
              <Grid item xs={4}>
                <TextField fullWidth label="First Name" variant="outlined" name="first_name" value={userData?.first_name} onChange={handleChange} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Last Name" variant="outlined" name="last_name" value={userData?.last_name} onChange={handleChange} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Section" variant="outlined" name="section" value={userData?.section} onChange={handleChange} />
              </Grid>
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
                <TextField fullWidth label="Admission No" variant="outlined" name="admission_no" value={userData?.admission_no} onChange={handleChange} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Roll No" variant="outlined" name="roll_no" value={userData.roll_no} onChange={handleChange}/>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Parent Name" variant="outlined" name="parent_name" value={userData.parent_name} onChange={handleChange}/>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Parent Phone" variant="outlined" name="parent_phone" value={userData.parent_phone} onChange={handleChange}/>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Parent Email" variant="outlined" name="parent_email" value={userData.parent_email} onChange={handleChange}/>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="SR No" variant="outlined" name="sr_no" value={userData.sr_no} onChange={handleChange}/>
              </Grid>
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={1}
                  variant="outlined"
                  name="address" value={userData.address} onChange={handleChange}
                />
              </Grid>

              {/* <Grid container justifyContent="center"> */}
              <Grid item xs={12} sm={4} ml={40}> {/* Adjust the sm value to your preference */}
                <Button type="submit" fullWidth={true} variant="contained" color="primary" style={{ textAlign: 'center' }}>
                  UPDATE
                </Button>
              </Grid>
            </Grid>

            {/* </Grid> */}
          </form>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default UpdateStudentForm;
