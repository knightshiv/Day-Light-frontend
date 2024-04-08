import React, { useState, useEffect } from "react";
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
import "./style/create.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import {  toast } from 'react-toastify';
import { tokens } from "../../theme";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DownloadIcon from '@mui/icons-material/Download';
import UploadPopup from '../../components/UploadPopup';

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';


const CreateStudentForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [designation, setDesignation] = useState([]);
    //const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const maritalStatus = ['Single', 'Married', 'Divorced', 'Widowed', 'Other']

    const { userToken } = useAuth();
    const api = AuthAxios(userToken);


    useEffect(() => {
        // Fetch data from an API using Axios
        api
            .get('departments')
            .then(response => {
                const data = response.data.data;
                setDepartments(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const handleBulkUpload = async (file) => {
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

            toast("User created Succesfully!")
            return response.data;
        } catch (error) {
            // Handle errors if the request fails
            console.error("Error uploading sheet:", error);
            throw error;
        }
    };

    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        dob: "",
        joining_date: "",
        employee_id:"",
        marital_status:"",
        aadhar_no: "",
        mobile_no: "",
        email: "",
        blood_group: "",
        emergency_contact: "",
        department_id: "",
        designation_id:"",
        r_address: "",
        r_city: "",
        r_state: "",
        r_pincode: "",
        p_address: "",
        p_city: "",
        p_state: "",
        p_pincode: "",
        bank_name: "",
        bank_branch: "",
        bank_ifsc: "",
        acc_no: "",
        pf_no: "",
        pan_number: "",
        basic_salary:"",
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
                formData.append("staff_image", selectedFile);
            }

            // Make an HTTP POST request to the backend API to create the user
            const response = await api.post(
                'staffs',
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
            console.error("Error creating user:", error.response.data);
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
            toast("User created successfully:", createdUser);
            console.log("User created successfully:", createdUser);
        } catch (error) {
            toast.error('Error creating user ! \n' + error?.response?.data?.error, {
                position: toast.POSITION.TOP_CENTER
              });
              console.error("Error creating user:", error?.response?.data?.error);
        }
    };

    const getDesignationByDepartments = (departmentId) => {
        api
        .get('designationbydepartment', {
            params: {
              departmentId: departmentId,
            },
          })
        .then(response => {
            const data = response.data;
            setDesignation(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        if(name === 'department_id'){
            getDesignationByDepartments(value);
        }
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const refresh = () => {
        Object.keys(userData).forEach(key => userData[key] = "");
        setSelectedFile(null);
    };

    return (
        <div className="new">
            <div className="newContainer">
                <UploadPopup open={isPopupOpen} onClose={() => setPopupOpen(false)} onUpload={handleBulkUpload} />
                <div className="bottom">
                    <Box
                        minHeight="100vh"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
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
                                            name="staff_image"
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
                                    <TextField fullWidth label="Employee ID" variant="outlined" name="employee_id" value={userData?.employee_id} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Aadhar No" variant="outlined" name="aadhar_no" value={userData?.aadhar_no} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Mobile No" variant="outlined" name="mobile_no" value={userData?.mobile_no} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Email" variant="outlined" name="email" value={userData?.email} onChange={handleChange} />
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
                                <FormControl fullWidth variant="outlined">
                                        <InputLabel>Marital Status</InputLabel>
                                        <Select label="Marital Status" name="marital_status" value={userData?.marital_status} onChange={handleChange} >
                                            <MenuItem disabled value="">Select Status</MenuItem>
                                            {maritalStatus.map(item => (
                                                <MenuItem key={item} value={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Department</InputLabel>
                                        <Select label="Department" name="department_id" value={userData?.department_id} onChange={handleChange} >
                                            <MenuItem disabled value="">Select Department</MenuItem>
                                            {departments.map(item => (
                                                <MenuItem key={item.id} value={item.id}>{item.department_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Designation</InputLabel>
                                        <Select label="Designation" name="designation_id" value={userData?.designation_id} onChange={handleChange} >
                                            <MenuItem disabled value="">Select Department</MenuItem>
                                            {designation.map(item => (
                                                <MenuItem key={item.id} value={item.id}>{item.designation_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Joining Date"
                                        type="date"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        name="joining_date"
                                        value={userData?.joining_date}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Date of Birth"
                                        type="date"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        name="dob"
                                        value={userData?.dob}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Blood Group" variant="outlined" name="blood_group" value={userData?.blood_group} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Emergency Contact" variant="outlined" name="emergency_contact" value={userData?.emergency_contact} onChange={handleChange} />
                                </Grid>
                               
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Residential Address"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        name="r_address"
                                        value={userData?.r_address}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Basic Salary" variant="outlined" name="basic_salary" value={userData?.basic_salary} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="PAN Number" variant="outlined" name="pan_number" value={userData?.pan_number} onChange={handleChange} />
                                </Grid>


                                <Grid item xs={4}>
                                    <TextField fullWidth label="Residential City" variant="outlined" name="r_city" value={userData?.r_city} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Residential State" variant="outlined" name="r_state" value={userData?.r_state} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Residential Pincode" variant="outlined" name="r_pincode" value={userData?.r_pincode} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Permanent Address"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        name="p_address"
                                        value={userData?.p_address}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Permanent City" variant="outlined" name="p_city" value={userData?.p_city} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Permanent State" variant="outlined" name="p_state" value={userData?.p_state} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Permanent Pincode" variant="outlined" name="p_pincode" value={userData?.p_pincode} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Bank Name" variant="outlined" name="bank_name" value={userData?.bank_name} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Bank Branch" variant="outlined" name="bank_branch" value={userData?.bank_branch} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Bank IFSC" variant="outlined" name="bank_ifsc" value={userData?.bank_ifsc} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Account No" variant="outlined" name="acc_no" value={userData?.acc_no} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="PF No" variant="outlined" name="pf_no" value={userData?.pf_no} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit"  variant="contained" color="primary">
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
