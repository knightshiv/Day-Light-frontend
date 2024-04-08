import { Table, TableBody,  TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React from "react";

const MultiReport = ({staffData,date}) => {


  //generate table sheet
  const generateTable = (selectedMonth, attendanceDetails) => {
    const tableRows = attendanceDetails.map((staffData, index) => {
      let entryDate, exitDate;
    
      if (staffData.entry_time && staffData.exit_time) {
          const entryTime = staffData.entry_time.split(':'); // Split the time string into hours, minutes, and seconds
          const exitTime = staffData.exit_time.split(':');
  
          entryDate = new Date(2000, 0, 1, parseInt(entryTime[0]), parseInt(entryTime[1]), parseInt(entryTime[2] || 0)); // Hours, Minutes, Seconds
          exitDate = new Date(2000, 0, 1, parseInt(exitTime[0]), parseInt(exitTime[1]), parseInt(exitTime[2] || 0));
      } else {
          // Handle the situation when entry_time or exit_time is null or undefined
          // For example, mark as 'Missing' or provide default dates
          entryDate = new Date(2000, 0, 1, 0, 0, 0); // Default date for entry
          exitDate = new Date(2000, 0, 1, 0, 0, 0); // Default date for exit
      }
    // Create Date objects with a dummy date, using the parsed hour and minute values

    // Calculate the difference in milliseconds
    const timeDifference = exitDate.getTime() - entryDate.getTime();

    // Convert the time difference from milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 3600); // 1 hour = 1000 milliseconds * 60 seconds * 60 minutes

          const TableRowData = [];
          for (let i = 0; i < staffData.attendanceDetails.length; i++) {
            const dayData = staffData.attendanceDetails[i];
            const days = (<td>Day {i+1}</td>);
            const statusCell = (
              <td key={`status-${index}-${i}`}>
                <span
                  style={{
                    fontWeight:
                      dayData.status === "present" ? "bold" : dayData.leaves === 1 ? "bold" : "normal",
                    color:
                      dayData.status === "present" ? "green" : dayData.leaves === 1 ? "orange" : "darkred",
                  }}
                >
                  {dayData.status === "present" ? "Present" : dayData.leaves === 1 ? "Holiday" : "Absent"}
                </span>
              </td>
            );
          
            const entranceTimeCell = (
              <td key={`entrance-time-${index}-${i}`}>
                <span
                  style={{
                    fontWeight:
                      dayData.status === "present" ? "bold" : dayData.leaves === 1 ? "bold" : "normal",
                    color:
                      dayData.status === "present" ? "green" : dayData.leaves === 1 ? "orange" : "darkred",
                  }}
                >
                  {dayData.status === "present" ? dayData.entrance_time || "-" : dayData.leaves === 1 ? "Holiday" : "Absent"}
                </span>
              </td>
            );
          
            const exitTimeCell = (
              <td key={`exit-time-${index}-${i}`}>
                <span
                  style={{
                    fontWeight:
                      dayData.status === "present" ? "bold" : dayData.leaves === 1 ? "bold" : "normal",
                    color:
                      dayData.status === "present" ? "green" : dayData.leaves === 1 ? "orange" : "darkred",
                  }}
                >
                  {dayData.status === "present" ? dayData.exit_time || "-" : dayData.leaves === 1 ? "Holiday" : "Absent"}
                </span>
              </td>
            );
          
            const totalHoursCell = (() => {
                if (
                  dayData.status === "present" &&
                  dayData.entrance_time &&
                  dayData.exit_time
                ) {
                  const entranceTime = new Date(`1970-01-01T${dayData.entrance_time}`);
                  const exitTime = new Date(`1970-01-01T${dayData.exit_time}`);
                  const timeDiff = Math.abs(exitTime - entranceTime);
                  const hours = Math.floor(
                    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                  );
                  const minutes = Math.floor(
                    (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
                  );
                  return (
                    <td
                      style={{ fontWeight: "bold" }}
                      key={`total-hours-${index}-${i}`}
                    >
                      {`${hours} hours ${minutes} minutes`}
                    </td>
                  );
                } else if (dayData.leaves === 1) {
                  return (
                    <td
                      key={`total-hours-${index}-${i}`}
                      style={{ color: "orange", fontWeight: "bold" }}
                    >
                      Holiday
                    </td>
                  );
                } else if (
                  dayData.leaves === 0 &&
                  !dayData.entrance_time &&
                  !dayData.exit_time
                ) {
                  return (
                    <td
                      key={`total-hours-${index}-${i}`}
                      style={{ color: "darkred" }}
                    >
                      Absent
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={`total-hours-${index}-${i}`}
                      style={{ fontWeight: "bold" }}
                    >
                      -
                    </td>
                  );
                }
              })();

              const upTimeCell = (() => {
                let content;
                if (
                  dayData.status === "present" &&
                  dayData.entrance_time &&
                  dayData.exit_time
                ) {
                  const entranceTime = new Date(`1970-01-01T${dayData.entrance_time}`);
                  const exitTime = new Date(`1970-01-01T${dayData.exit_time}`);
                  const timeDiff = Math.abs(exitTime - entranceTime);
                  const hours = Math.floor(
                    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                  );
                  const minutes = Math.floor(
                    (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
                  );
                  const totalHours = hours + minutes / 60;
            
                  if (totalHours > hoursDifference) {
                    const extraHours = Math.floor(totalHours - hoursDifference);
                    const extraMinutes = Math.floor(
                      (totalHours - hoursDifference - extraHours) * 60
                    );
                    content = `${extraHours} hours ${extraMinutes} minutes extra`;
                  } else {
                    content = "-";
                  }
                } else if (dayData.leaves === 1) {
                  content = "Holiday";
                } else {
                  content = "-";
                }
            
                let cellStyle = {};
                if (content === "Holiday") {
                  cellStyle = { color: "orange", fontWeight: "bold" };
                } else if (content !== "-") {
                  cellStyle = { color: "green", fontWeight: "bold" };
                }
            
                return (
                  <td key={`uptime-${index}-${i}`} style={cellStyle}>
                    {content}
                  </td>
                );
              })();
            
              const downTimeCell = (() => {
                let content;
                if (
                  dayData.status === "present" &&
                  dayData.entrance_time &&
                  dayData.exit_time
                ) {
                  const entranceTime = new Date(`1970-01-01T${dayData.entrance_time}`);
                  const exitTime = new Date(`1970-01-01T${dayData.exit_time}`);
                  const timeDiff = Math.abs(exitTime - entranceTime);
                  const hours = Math.floor(
                    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                  );
                  const minutes = Math.floor(
                    (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
                  );
                  const totalHours = hours + minutes / 60;
            
                  if (totalHours > hoursDifference) {
                    content = "N/A";
                  } else {
                    const lessThanNineHours = hoursDifference - totalHours;
                    const lessHours = Math.floor(lessThanNineHours);
                    const lessMinutes = Math.floor(
                      (lessThanNineHours - lessHours) * 60
                    );
                    content = `${lessHours} hours ${lessMinutes} minutes less`;
                  }
                } else if (dayData.leaves === 1) {
                  content = "Holiday";
                } else {
                  content = "-";
                }
            
                let cellStyle = {};
                if (content === "Holiday") {
                  cellStyle = { color: "orange", fontWeight: "bold" };
                } else if (content !== "-") {
                  cellStyle = { color: "red", fontWeight: "bold" };
                }
            
                return (
                  <td key={`downtime-${index}-${i}`} style={cellStyle}>
                    {content}
                  </td>
                );
              })();

            const row = (
              <tr key={`row-${index}-${i}`}>
                {days}
                {statusCell}
                {entranceTimeCell}
                {exitTimeCell}
                {totalHoursCell}
                {upTimeCell}
                {downTimeCell}
              </tr>
            );
          
            TableRowData.push(row);
          }
          
     

      return (

        <div key={`table-${index}`} style={{ marginBottom: '20px'}}>
<h2 style={{ textAlign: "left", fontWeight: "bold" }}>
              Name : {staffData.staffName} <br />
              designation : { staffData.designation_name} <br /> employee ID : {staffData.staffId}
            </h2>
        <TableContainer component={Paper}>
          <Table style={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <th>Day</th>
                <th>Status</th>
                <th>Enter Time</th>
                <th>Exit Time</th>
                <th>Total Hours</th>
                <th>Up Time</th>
                <th>Down Time</th>
              </TableRow>
            </TableHead>
            <TableBody>
           { TableRowData}
              </TableBody>
          </Table>
        </TableContainer>
    
          <br />          <br />
          <br />

        </div>
      );
    
    });

    return tableRows;
  };

  const table = generateTable(new Date(date), staffData);

return (
    <>
    {table}
    </>
)
}
export default MultiReport;
