import React, { useState, useEffect } from "react";
import { FaUsers, FaClock, FaChartBar } from "react-icons/fa";
import { MdEmail, MdEventAvailable } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";
import CustomerTable from "./CustomerTable";
import VisitorMap from "./VisitorMap";
const MainDash = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [totalEmailSubmits, setTotalEmailSubmits] = useState(0);
  const [avgTimePerUser, setAvgTimePerUser] = useState(0);
  const [timeSpentChartData, setTimeSpentChartData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("last_1_month"); // New state for filter

  useEffect(() => {
    axios.get(`http://localhost:3001/api/dashboard-stats`)
      .then((response) => {
        console.log("API Response:", response.data); // Debugging step
        const { totalUsers, totalTimeSpent, totalEmailSubmits, avgTimePerUser } = response.data;
        setTotalVisitors(totalUsers);  // Check if this is being set
        setTotalTimeSpent(totalTimeSpent);
        setTotalEmailSubmits(totalEmailSubmits);
        setAvgTimePerUser(avgTimePerUser);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      });
  }, []);
  

  // Fetch stats based on the selected time filter
  const fetchData = () => {
    axios
      .get(`http://localhost:3001/api/timeSpent-graph?filter=${timeFilter}`)
      .then((response) => {
        const {timeSpentChartData } = response.data;
        setTimeSpentChartData(timeSpentChartData);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component is mounted or filter changes
  }, [timeFilter]);

  // Handle the filter change
  const handleFilterChange = (e) => {
    setTimeFilter(e.target.value); // Update the selected filter
  };

  return (
    <div className="main-content p-6">
      <section className="section">
        {/* Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-blue-500 text-white shadow-lg rounded-2xl flex flex-col items-center">
            <FaUsers className="text-5xl mb-3" />
            <h5 className="text-lg font-semibold">Total Unique Visitors</h5>
            <h2 className="text-3xl font-bold">{totalVisitors}</h2>
          </div>

          <div className="p-6 bg-green-500 text-white shadow-lg rounded-2xl flex flex-col items-center">
            <FaClock className="text-5xl mb-3" />
            <h5 className="text-lg font-semibold">Total Time Spent (secs)</h5>
            <h2 className="text-3xl font-bold">{totalTimeSpent}</h2>
          </div>

          <div className="p-6 bg-red-500 text-white shadow-lg rounded-2xl flex flex-col items-center">
            <MdEmail className="text-5xl mb-3" />
            <h5 className="text-lg font-semibold">Collected Emails</h5>
            <h2 className="text-3xl font-bold">{totalEmailSubmits}</h2>
          </div>

          <div className="p-6 bg-yellow-500 text-white shadow-lg rounded-2xl flex flex-col items-center">
            <FaChartBar className="text-5xl mb-3" />
            <h5 className="text-lg font-semibold">Avg Time per Visitor (secs)</h5>
            <h2 className="text-3xl font-bold">{avgTimePerUser}</h2>
          </div>
        </div>

        {/* Time Filter Selector */}
        <div className="mb-6">
          <label htmlFor="timeFilter" className="text-lg font-semibold text-gray-900 mr-4">
            Select Time Period:
          </label>
          <select id="timeFilter" value={timeFilter} onChange={handleFilterChange} className="border p-2 rounded-lg">
            <option value="today">Today's Time</option>
            <option value="yesterday">Yesterday's Time</option>
            <option value="last_week">Last Week</option>
            <option value="last_15_days">Last 15 Days</option>
            <option value="last_1_month">Last 1 Month</option>
          </select>
        </div>

        {/* New Graph Section */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Time Spent</h3>

          {/* Bar Chart Visualization */}
          <ResponsiveContainer width="100%" height={300}>
  <BarChart data={timeSpentChartData}>
    <XAxis dataKey="date" stroke="#ccc" />
    <YAxis stroke="#ccc" />
    <Tooltip />
    <Bar dataKey="total_time_spent" barSize={40}>
      {timeSpentChartData.map((entry, index) => {
        const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];
        return (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]} // Assign colors dynamically
            stroke={colors[index % colors.length].replace("0.7", "1")} // Full opacity border
          />
        );
      })}
    </Bar>
  </BarChart>
</ResponsiveContainer>








        </div>

        {/* Visitor Map & Customer Table */}
        <div className="mt-6">
          <VisitorMap />
        </div>
        <div className="mt-6">
          <CustomerTable />
        </div>
      </section>
    </div>
  );
};

export default MainDash;
