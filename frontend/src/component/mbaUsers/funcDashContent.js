import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import image1 from "../../bundles/4108210.png";
import image3 from "../../bundles/6385707.png";
import ChartComponent from "./chartt";
import ContentLoader from "../contentloader";
import axios from "axios";
import moment from "moment";
import PieChartComponent from "../PieChart";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import GetLink from "../apiLink";
const UserDashContentFun = ({ id }) => {
  console.log("id", id);
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery("userDashboardData", () => fetchUserDashboardData());

  const { data: data1, isLoading: isLoading1 } = useQuery(
    "seconddata",
    async () => {
      const res = await axios.get(`${GetLink()}/mba2/${id}`, {
        withCredentials: true,
      });
      return res.data;
    }
  );

  const [label, setLabel] = useState([]);
  useEffect(() => {
    const labels = [];

    for (let i = 11; i >= 0; i--) {
      const monthLabel = moment().subtract(i, "months").format("MMM");
      labels.push(monthLabel);
    }
    setLabel(labels);
  }, [data1]);

  const fetchUserDashboardData = async () => {
    try {
      const response = await fetch(`${GetLink()}/mba/${id}`, {
        withCredentials: true,
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching user dashboard data:", error);
      throw new Error("Failed to fetch user dashboard data");
    }
  };

  if (error2) {
    return <div>Error: {error2.message}</div>;
  }

  if (isLoading1 || isLoading2) {
    return (
      <div className="main-content">
        <ContentLoader></ContentLoader>
      </div>
    );
  }
  const currentDate = new Date();
  const currentMonth2 = currentDate.getMonth();
  const months = Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(0, index);
    return monthDate.toLocaleString("en-US", { month: "long" });
  });

  return (
    <div className="main-content">
      <section className="section">
        <div className="row ">
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div
              className="card card-style"
              style={{ borderLeft: "2px solid #7a117a", pointerEvents: "none" }}
            >
              <div className="card-statistic-4">
                <div className="align-items-center justify-content-between">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <div className="banner-img">
                        <img src={image1} alt="" />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6  pt-4">
                      <div
                        className="card-content"
                        style={{ alignItems: "center" }}
                      >
                        <h1
                          className="font-25"
                          style={{
                            textAlign: "left",
                            padding: "0",
                            margin: "0",
                            color: "rgb(65 71 76)",
                          }}
                        >
                          {data2.total_points || 0}
                        </h1>
                        <h2
                          className="font-15"
                          style={{ color: "grey", textAlign: "left" }}
                        >
                          Total Points
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div
              class="card card-style"
              title="click to expand"
              style={{ borderLeft: "2px solid #7a117a", pointerEvents: "none" }}
            >
              <div class="card-statistic-4">
                <div class="align-items-center justify-content-between">
                  <div class="row ">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
                      <div class="banner-img">
                        <img src={image3} alt=""></img>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-2 pt-4">
                      <div class="card-content">
                        <h2
                          class="mb-3 font-18"
                          className="font-25"
                          style={{
                            textAlign: "left",
                            padding: "0",
                            margin: "0",
                            color: "rgb(65 71 76)",
                          }}
                        >
                          {data2.totalPrograms}
                        </h2>
                        <h5
                          class="font-15"
                          className="font-15"
                          style={{ color: "grey", textAlign: "left" }}
                        >
                          {" "}
                          Total Programs
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div
              class="card card-style"
              title="click to expand"
              style={{ borderLeft: "2px solid #7a117a", pointerEvents: "none" }}
            >
              <div class="card-statistic-4">
                <div class="align-items-center justify-content-between">
                  <div className="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
                      <div className="progress-bar-container">
                        {/* <ProgressBar
                          progress={(data2.monthRank / data2.total) * 100}
                          radius={30}
                          style={{ stroke: "blue" }}
                        /> */}
                        <CircularProgressbar
                          value={
                            100 - 10 - (data2.monthRank / data2.total) * 100
                          }
                          text={`${data2.monthRank}/${data2.total}`}
                          background
                          backgroundPadding={6}
                          styles={buildStyles({
                            backgroundColor: "#3e98c7",
                            textColor: "#fff",
                            pathColor: "#fff",
                            trailColor: "transparent",
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-2 pt-4">
                      <div
                        className="card-content"
                        style={{ alignItems: "center" }}
                      >
                        <h2
                          className="font-25"
                          style={{
                            textAlign: "left",
                            padding: "0",
                            margin: "0",
                            color: "rgb(65 71 76)",
                          }}
                        >
                          #{data2.monthRank}
                        </h2>
                        <h5
                          className="font-15"
                          style={{ color: "grey", textAlign: "left" }}
                        >
                          {months[currentMonth2] + " "} Rank
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div
              class="card card-style"
              title="click to expand"
              style={{ borderLeft: "2px solid #7a117a", pointerEvents: "none" }}
            >
              <div class="card-statistic-4">
                <div class="align-items-center justify-content-between">
                  <div class="row ">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
                      <div className="progress-bar-container">
                        {/* <ProgressBar
                          progress={(data2.monthRank / data2.total) * 100}
                          radius={30}
                          style={{ stroke: "blue" }}
                        /> */}
                        <CircularProgressbar
                          value={(data2.yearRank / data2.total) * 100}
                          text={`${data2.yearRank}/${data2.total}`}
                          strokeWidth={7}
                          background
                          backgroundPadding={6}
                          styles={buildStyles({
                            backgroundColor: "#49796B",
                            textColor: "#fff",
                            pathColor: "#fff",
                            trailColor: "transparent",
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-2 pt-4">
                      <div
                        className="card-content"
                        style={{ alignItems: "center" }}
                      >
                        <h2
                          className="font-25"
                          style={{
                            textAlign: "left",
                            padding: "0",
                            margin: "0",
                            color: "rgb(65 71 76)",
                          }}
                        >
                          #{data2.yearRank}
                        </h2>
                        <h5
                          className="font-15"
                          style={{ color: "grey", textAlign: "left" }}
                        >
                          {currentDate.getFullYear() + " "} Rank
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card" style={{ borderBottom: "2px solid #7a117a" }}>
              <div class="card-header">
                <h4 className="font-22">Point Detail</h4>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-striped">
                    <tr
                      className="font-25"
                      style={{
                        margin: "0",
                        padding: "0",
                        color: "rgb(65 71 76)",
                      }}
                    >
                      <th>
                        {data1.yearly}{" "}
                        <span style={{ color: "grey", fontSize: "15px" }}>
                          In Last 12 month
                        </span>
                      </th>
                      <th>
                        {data1.quarterly}{" "}
                        <span style={{ color: "grey", fontSize: "15px" }}>
                          In Last 3 Months
                        </span>
                      </th>
                      <th>
                        {data1.monthly}{" "}
                        <span style={{ color: "grey", fontSize: "15px" }}>
                          In Last 30 days
                        </span>
                      </th>
                      <th>
                        {data1.daily}{" "}
                        <span style={{ color: "grey", fontSize: "15px" }}>
                          In Last 24 hours
                        </span>
                      </th>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-sm-12 col-lg-12">
            <div
              class="card "
              style={{
                borderTop: "2px solid #7a117a",
                color: "rgb(65 71 76)",
              }}
            >
              <div class="card-header">
                <h4 className="font-22" style={{ color: "rgb(65 71 76)" }}>
                  Clicks Visualization
                </h4>
              </div>
              <div className="chart-class">
                <div class="card-body" style={{ width: "50%" }}>
                  <ChartComponent
                    data={data1.clickRecord}
                    labels={label}
                  ></ChartComponent>
                </div>
                <div class="card-body" style={{ width: "50%" }}>
                  <PieChartComponent
                    labels={label}
                    values={data1.clickRecord}
                  ></PieChartComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="settingSidebar">
        <p href="javascript:void(0)" class="settingPanelToggle">
          {" "}
          <i class="fa fa-spin fa-cog"></i>
        </p>
        <div class="settingSidebar-body ps-container ps-theme-default">
          <div class=" fade show active">
            <div class="setting-panel-header">Setting Panel</div>
            <div class="p-15 border-bottom">
              <h6 class="font-medium m-b-10">Select Layout</h6>
              <div class="selectgroup layout-color w-50">
                <label class="selectgroup-item">
                  <input
                    type="radio"
                    name="value"
                    value="1"
                    class="selectgroup-input-radio select-layout"
                    checked
                  ></input>
                  <span class="selectgroup-button">Light</span>
                </label>
                <label class="selectgroup-item">
                  <input
                    type="radio"
                    name="value"
                    value="2"
                    class="selectgroup-input-radio select-layout"
                  ></input>
                  <span class="selectgroup-button">Dark</span>
                </label>
              </div>
            </div>
            <div class="p-15 border-bottom">
              <h6 class="font-medium m-b-10">Sidebar Color</h6>
              <div class="selectgroup selectgroup-pills sidebar-color">
                <label class="selectgroup-item">
                  <input
                    type="radio"
                    name="icon-input"
                    value="1"
                    class="selectgroup-input select-sidebar"
                  ></input>
                  <span
                    class="selectgroup-button selectgroup-button-icon"
                    data-toggle="tooltip"
                    data-original-title="Light Sidebar"
                  >
                    <i class="fas fa-sun"></i>
                  </span>
                </label>
                <label class="selectgroup-item">
                  <input
                    type="radio"
                    name="icon-input"
                    value="2"
                    class="selectgroup-input select-sidebar"
                    checked
                  ></input>
                  <span
                    class="selectgroup-button selectgroup-button-icon"
                    data-toggle="tooltip"
                    data-original-title="Dark Sidebar"
                  >
                    <i class="fas fa-moon"></i>
                  </span>
                </label>
              </div>
            </div>
            <div class="p-15 border-bottom">
              <h6 class="font-medium m-b-10">Color Theme</h6>
              <div class="theme-setting-options">
                <ul class="choose-theme list-unstyled mb-0">
                  <li title="white" class="active">
                    <div class="white"></div>
                  </li>
                  <li title="cyan">
                    <div class="cyan"></div>
                  </li>
                  <li title="black">
                    <div class="black"></div>
                  </li>
                  <li title="purple">
                    <div class="purple"></div>
                  </li>
                  <li title="orange">
                    <div class="orange"></div>
                  </li>
                  <li title="green">
                    <div class="green"></div>
                  </li>
                  <li title="red">
                    <div class="red"></div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="p-15 border-bottom">
              <div class="theme-setting-options">
                <label class="m-b-0">
                  <input
                    type="checkbox"
                    name="custom-switch-checkbox"
                    class="custom-switch-input"
                    id="mini_sidebar_setting"
                  ></input>
                  <span class="custom-switch-indicator"></span>
                  <span class="control-label p-l-10">Mini Sidebar</span>
                </label>
              </div>
            </div>
            <div class="p-15 border-bottom">
              <div class="theme-setting-options">
                <label class="m-b-0">
                  <input
                    type="checkbox"
                    name="custom-switch-checkbox"
                    class="custom-switch-input"
                    id="sticky_header_setting"
                  ></input>
                  <span class="custom-switch-indicator"></span>
                  <span class="control-label p-l-10">Sticky Header</span>
                </label>
              </div>
            </div>
            <div class="mt-4 mb-4 p-3 align-center rt-sidebar-last-ele">
              <p
                href="#"
                class="btn btn-icon icon-left btn-primary btn-restore-theme"
              >
                <i class="fas fa-undo"></i> Restore Default
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashContentFun;
