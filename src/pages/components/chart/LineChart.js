/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import { useEffect } from "react";

function LineChart({  title  }) {
  useEffect(() => {
    console.log('data',data);
  }, []);
  const data = [
    { name: 'July', Total: '4.76' },
    { name: 'August', Total: '8.70' },
    { name: 'September', Total: '0.00' },
    { name: 'October', Total: '33.33' },
    { name: 'November', Total: '11.11' },
    { name: 'December', Total: '14.29' },
    { name: 'January', Total: '0.00' },
    { name: 'February', Total: '0.00' },
    { name: 'March', Total: '0.00' },
    { name: 'April', Total: '0.00' },
    { name: 'May', Total: '0.00' },
    { name: 'June', Total: '0.00' },
  ];
  
  const { Title, Paragraph } = Typography;
  const toPercent = (decimal, fixed = 0) => `${decimal}%`;
  const j = [];
  const k = [];
    for (let i = 0; i < data.length; i++) {
    j.push(data[i].name);
    k.push(data[i].Total);
  }
  const lineChart = {
    series: [
     
      {
        name: "Total",
        data: k,
        offsetY: 0,
      },
    ],
  
    options: {
      chart: {
        width: "80%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
  
      legend: {
        show: false,
      },
  
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
  
    xaxis: {
        labels: {
          style: {
            fontSize: "11px",
            fontWeight: 600,
            colors: [
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
            ],
          },
        },
        categories: j,
      },
  
      tooltip: {
        y: {
          formatter: function (val) {
            return val +'%';
          },
        },
      },
      yaxis: {
        min: 0,
        max: 100, // Adjust this value to set the 20% gap
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 800,
            colors: ["#8c8c8c"],
          },
          formatter: function (val) {
            return val + '%';
          }
        }
      }
    },
  };
  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>{title}</Title>
          
        </div>
       
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
