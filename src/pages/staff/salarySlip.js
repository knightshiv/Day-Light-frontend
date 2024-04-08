import "./style/salary.scss";

import React, { useState, useEffect,useRef } from 'react';
import { Button, TextField, Box,} from '@mui/material';
import {  toast } from 'react-toastify';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';
import { useParams } from 'react-router-dom';
  
import Slip from '../../components/salarytemplate/Slip.js';
import { usePDF } from "react-to-pdf";

const SalarySlip = () => {

    const [salaryDate, setSalaryDate] = useState(null);
    const [basicSalary, setBasicSalary] = useState('');
    const [data, setData] = useState(null);
    const [bonus, setBonus] = useState('');

    const [monthlyData, setMonthlyData] = useState(null);
    const [salaryComponents, setSalaryComponents] = useState([]);

    const user =  localStorage.getItem("user");
    const userObject = JSON.parse(user);
    const logo = userObject?.logo

    const { id } = useParams();

    const fileName = "Salary_Slip_"+data?.first_name + "_" + data?.last_name +'_'+ data?.employee_id + "_"+ salaryDate?.toLocaleDateString(undefined,{ year: 'numeric', month: 'long' })?.trim()
    const { toPDF, targetRef } = usePDF({ filename: fileName });

    useEffect(() => {
        api
            .get('staffs/' + id)
            .then(response => {
                const data = response.data; // Assuming the response contains the array of staff data
                console.log("staff data", data);
                setData(data); // Update the state with the fetched data
                setBasicSalary(data?.basic_salary)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

    const { userToken } = useAuth();
    const api = AuthAxios(userToken);


    const generateSalarySlip = async  () => {

        console.log(salaryDate, basicSalary, bonus)
        console.log(new Date())

        if(salaryDate === null || basicSalary === null){
            toast.error('Please Select all fields')
            return
        }

        let params = {
            id: id,
            month: salaryDate
        };

        await api
            .get("staffsmonthlypercentage", { params })
            .then(async (response) => {
                const data = response.data; // Assuming the response contains the array of student data
                console.log("monthly", data);
                setMonthlyData(data);
            })
            .catch((error) => {
                console.error("Error fetching monthly data:", error);
            });


        await api
            .get("salarycomponentsbysalary", {
                params: {
                    salary: basicSalary
                }
            })
            .then(async (response) => {
                const data = response.data; // Assuming the response contains the array of student data
                console.log("monthly", data);
                setSalaryComponents(data);
            })
            .catch((error) => {
                console.error("Error fetching monthly data:", error);
            });
    };

    return (
        <div className="new">
            <div className="newContainer">
                <Box m="20px">
                    <Box style={{ display: 'flex', flexDirection: 'column'}} alignItems="center" justifyContent="center" mb={2}>
                        <Box m={2}  >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    inputFormat="yyyy-MM"
                                    views={['year', 'month']}
                                    label="Year and Month"
                                    minDate={new Date('2012-03-01')}
                                    maxDate={new Date('2024-06-01')}
                                    value={salaryDate}
                                    onChange={setSalaryDate}
                                    renderInput={(params) => <TextField {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box m={2}>
                            <TextField
                                type="number"
                                label="Basic Salary"
                                multiline
                                rows={1}
                                variant="outlined"
                                name="basic_salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)}
                            />
                        </Box>
                        <Box m={2}>
                            <TextField
                                type="number"
                                label="Add Bonus"
                                multiline
                                rows={1}
                                variant="outlined"
                                name="bonus" value={bonus} onChange={(e) => setBonus(e.target.value)}
                            />
                        </Box>
                        <Box m={2}  >
                            <Button
                                variant="contained"
                                color="error"
                                onClick={generateSalarySlip}
                            >
                                Calculate Salary
                            </Button>
                        </Box>
                        <Box m={2} ref={targetRef}>
                            <Slip salaryDate = {salaryDate} logo = {logo} user = {userObject} employeeDetails={data} monthly={monthlyData} components = {salaryComponents} basicSalary = {basicSalary}/>
                        </Box>
                        <Box m={2} >
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => toPDF()}
                            >
                                Download Salary Slip
                            </Button>
                        </Box>
                    </Box>

                </Box>
            </div>
        </div>
    );
};

export default SalarySlip;
