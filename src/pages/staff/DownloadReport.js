import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent } from "@mui/material";
import { Drawer } from 'antd';

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";
import { useParams } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import ReportTable from "../../components/Report/MultiReport.js";

const Report = () => {
  const { date } = useParams();
  const [staffData, setStaffData] = useState([]);
  const { userToken } = useAuth();
  const api = AuthAxios(userToken);
  const fileName = "Staff Report";
  const { toPDF, targetRef } = usePDF({ filename: fileName });
  useEffect(() => {
    getData(date);  
  }, []);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Split the date parameter to get the year and month parts
  const [year, month] = date.split("-");

  // 'month' variable now contains the extracted month value as a string
  const monthIndex = parseInt(month, 10) - 1; // Adjust for zero-based index
  const monthName = monthNames[monthIndex]; // Get the month name

  // Function to fetch data based on Months
  const getData = async (date) => {
    const params = {
      month: date,
    };
    try {
      const response = await api.get("staffsmonthlyreport", { params });
      setStaffData(response.data);
      return;
    } catch (error) {
      console.error("Error in request:", error);
    }
  };

  return (
    
    <div className="container" id="pdf-content">
      <Box m={2}>
        <Button variant="contained" color="warning" onClick={() => toPDF()}>
          Download PDF
        </Button>
      </Box>
      <Box m={2} ref={targetRef} style={{ marginTop: "50px", padding: "20px" }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
          {monthName} Report of all staff in {year}
        </h2>
        <Card>
          <CardContent>
            <ReportTable staffData={staffData } date={date} />
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Report;
