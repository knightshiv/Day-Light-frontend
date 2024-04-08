import "./style/chart.css";  
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const Chart = ({ aspect, title , data }) => {
  const toPercent = (decimal, fixed = 0) => `${decimal}%`

  return (
    <div className="chart">
      <div className="title"><p>{title}</p></div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#cc3939" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#cc3939" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis tickMargin='10'  dataKey="name" stroke="gray" />
          <YAxis
            dataKey="Total" 
            tickMargin="10"
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            tickFormatter={(tick) => `${tick}%`}
            />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          {/* <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
          <ReferenceLine y={100} label="Percentage" stroke="red" strokeDasharray="3 3" /> */}
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
      
    </div>
  );
};

export default Chart;
 