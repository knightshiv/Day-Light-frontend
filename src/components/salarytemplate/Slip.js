import React from 'react';
import './style/slip.scss'; // Import your CSS file

const SalarySlip = ({ salaryDate,logo, user , employeeDetails, monthly, components,basicSalary }) => {
  
  const additions =  components?.items?.filter(comp => comp.component_type === 'addition');
  const deductions = components?.items?.filter(comp => comp.component_type === 'deduction');

  const lengthDifference = additions?.length - deductions?.length
  console.log(lengthDifference)

  if(lengthDifference > 0){
    for(let i = 0; i < lengthDifference; i++){
      deductions.push({})
    }
  }else{
    for(let i = 0; i < lengthDifference; i++){
      additions.push({})
    }
  }

  const totalDaysInMonth = parseInt(monthly?.date_span)
  const totalHolidays = parseInt(monthly?.total_leaves)
   const totalAttendance = parseInt(monthly?.total_attendance)
  //const totalAttendance = 22
  const workingDays = parseInt(totalDaysInMonth - totalHolidays);
  const totalLeaves = workingDays - totalAttendance
  
  //basicSalary = parseFloat(basicSalary)
  const LOP = parseFloat(basicSalary/workingDays) * totalLeaves
  basicSalary = basicSalary - LOP 

  // Calculate total additions and deductions
  const totalAdditions =  additions?.reduce((total, item) => total + (parseFloat((parseFloat(item?.component_value)*parseFloat(basicSalary))/100)), 0);
  const totalDeductions = deductions?.reduce((total, item) => total + (item?.component_value?(parseFloat((parseFloat(item?.component_value)*parseFloat(basicSalary))/100)):0), 0);

  return (

    <div className="salary-slip">

      <div className="salary-header">
        <img
          alt="profile-user"
          width="100px"
          height="100px"
          src={
            logo ? 'data:image/png;base64,' + logo : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
          }
          style={{ cursor: "pointer", borderRadius: "50%" }}
        />
        <div className="company-name" >{user?.entity}</div>
      </div>

        <div style={{display: 'flex', alignment: "center",justifyContent: "center" , width: "100%" , marginTop: "10px"}}>
          <h3> Payment slip for the month of {salaryDate ? salaryDate.toLocaleDateString(undefined,{ year: 'numeric', month: 'long' }) :''} </h3>
        </div>
      <div className="employee-header">
        <div className="employee-details">
          <div className="detail-row">
            <span className="label">Name:</span>
            <span>{employeeDetails?.first_name + ' ' + employeeDetails?.last_name}</span>
          </div>
          <div className="detail-row">
            <span className="label">Employee ID:</span>
              <span>{employeeDetails?.employee_id }</span>
          </div>
          <div className="detail-row">
            <span className="label">Designation:</span>
              <span>{employeeDetails?.designation?.designation_name }</span>
          </div>
          <div className="detail-row">
            <span className="label">Email:</span>
              <span>{employeeDetails?.email }</span>
          </div>
        
        </div>

        <div className="employee-details">
          <div className="detail-row">
            <span className="label">PAN No:</span>
            <span>{employeeDetails?.pan_number}</span>
            
            {/* Add more employee details here */}
          </div>
          <div className="detail-row">
            <span className="label">Bank A/C No:</span>
              <span>{employeeDetails?.acc_no }</span>
          </div>
          <div className="detail-row">
            <span className="label">Bank Name:</span>
              <span>{employeeDetails?.bank_name }</span>
          </div>

          <div className="detail-row">
            <span className="label">Bank IFSC:</span>
              <span>{employeeDetails?.bank_ifsc }</span>
          </div>
        
          {/* Add more employee details rows here */}
      </div>
  </div>


      <div className="additions-deductions">

        <div className="total-additions">
          <table>
            <thead>
              <tr>
                <th className='name-align' style={{ borderBottom: '1px solid'}}>Particular</th>
                <th className='amount-align' style={{ borderBottom: '1px solid'}} >Amount (Rs.)</th>
              </tr>
            </thead>

            <tbody>
              {/* <tr><th colSpan="2">Additions</th></tr> */}
            <tr><th>Basic Salary</th> <th className='amount-align'>{basicSalary?.toFixed(2)}</th> </tr>
              {additions?.map((item, index) => (
                <tr key={index}>
                  <td className='name-align'>{item.component_name}</td>
                  <td className='amount-align' >{(item?.component_value?(parseFloat((parseFloat(item?.component_value)*parseFloat(basicSalary))/100)?.toFixed(2)):'')}</td>
                </tr>
              ))}
              <tr className="myBackground" style={{ borderRight: '0px solid'}} >
              <th >
                Total Payments
              </th>
              <td className="amount-align" >
                {parseFloat(parseFloat(basicSalary)+totalAdditions)?.toFixed(2)}
              </td>
             
            </tr >
            </tbody>
          </table>
        </div>
        <div className="total-deductions">
          <table>
            <thead>
              <tr>
                <th className='name-align' style={{ borderBottom: '1px solid'}}>Particular</th>
                <th className='amount-align' style={{ borderBottom: '1px solid'}} >Amount (Rs.)</th>
              </tr>
            </thead>

            <tbody>
            {/* <tr><th></th> <th className='amount-align'></th> </tr> */}
              <tr><th colSpan="2">Deductions</th></tr>
              {deductions?.map((item, index) => (
                <tr key={index}>
                   <td className='name-align'> {item.component_name}</td>
                  <td className='amount-align' >{(item?.component_value?(parseFloat((parseFloat(item?.component_value)*parseFloat(basicSalary))/100)?.toFixed(2)):'')}</td>
                </tr>
              ))}
               <tr className="myBackground" style={{ borderLeft: '0px solid'}}>
               <th  >
                Total Deductions
              </th >
              <td className="amount-align"   >
                {totalDeductions?.toFixed(2)}
              </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
      <div className="totals">

        <div className="sum-additions">
          <table>
            
            <tr>
              <td colSpan="4 " style={{fontWeight:'bold'}}> Gross Salary </td> 
              <td className="amount-align" style={{fontWeight:'bold'}} > {parseFloat(parseFloat(parseFloat(basicSalary)+totalAdditions) - totalDeductions)?.toFixed(2)}</td>
            </tr >

            <tbody className="border-center">

              <tr>
                <th>Month</th>
                <th>Total Days</th>
                <th>Leaves</th>
                <th colSpan="4"></th>
              </tr>

              <tr>
                <th >Current Month</th>
                <td >{monthly?.date_span}</td>
                <td >{totalLeaves}</td>
                <td colSpan="4" className='amount-align'>Authorized Signature</td>
              </tr >
 
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;
