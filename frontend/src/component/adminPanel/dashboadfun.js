import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import ChartComponent from "../mbaUsers/chartt";
import image1 from "../../img/banner/1.png";
import image2 from "../../img/banner/2.png";
import image3 from "../../img/banner/3.png";
import image4 from "../../img/banner/4.png";
import ContentLoader from "react-content-loader";
import PieChartComponent from "../PieChart";
import axios from "axios";
import GetLink from "../apiLink";
const MainDash = () => {
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(0);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicksCount, setTotalClicksCount] = useState(0);

  const [clicksPerHourArray, setClicksPerHourArray] = useState([]);
  const [clicksPerLast30DaysArray, setClicksPerLast30DaysArray] = useState([]);
  const [clicksPerQuarterArray, setClicksPerQuarterArray] = useState([]);
  const [clicksPerMonthArray, setClicksPerMonthArray] = useState([]);

  const [mode, setMode] = useState("Clicks");

  const [label, setLabel] = useState([]);
  const [values, setValues] = useState([]);

  const [prev, setPrev] = useState(0);

  const [visu, setVisu] = useState("Today/Live");

  const {
    isLoading: isLoading1,
    error: error1,
    data: data1,
  } = useQuery("dashboardData1", () =>
    axios.get(GetLink() + "/fastDataAdmin").then((res) => res.data)
  );
  const {
    isLoading: isLoading2,
    error: error2,
    data: data2,
  } = useQuery("query2", () =>
    axios.get(GetLink() + "/admindashboard").then((res) => {
      return res.data;
    })
  );
  useEffect(() => {
    if (data1) {
      setTotalRegisteredUsers(data1.totalRegisteredUsers);
      setTotalPrograms(data1.totalPrograms);
      setTotalLinks(data1.totalLinks);
      setTotalClicksCount(data1.totalClicksCount);
    }
  }, [data1]);

  useEffect(() => {
    if (data2) {
      setClicksPerHourArray(data2.clicksPerHourArray);
      setClicksPerLast30DaysArray(data2.clicksPerLast30DaysArray);
      setClicksPerQuarterArray(data2.clicksPerQuarterArray);
      setClicksPerMonthArray(data2.clicksPerMonthArray);
      let newLabel = data2.clicksPerHourArray.map((item) => item.hour);
      let newValues = data2.clicksPerHourArray.map((item) => item.count);
      setLabel(newLabel);
      setValues(newValues);
    }
  }, [data2]);

  const handleClick = (val) => {
    setMode(val);
  };

  const handleMouseEnter = (event) => {
    setPrev(event.target.textContent);
    event.target.textContent = "Visualize";
  };

  const handleMouseLeave = (event) => {
    if (mode === "Clicks") {
      event.target.textContent = prev;
    } else {
      event.target.textContent = prev;
    }
  };

  const handleVisualizeClick = (event, val) => {
    let newLabel = [];
    let newValues = [];

    event.target.style.background = "#7a117a";
    event.target.style.color = "white";
    event.target.style.borderRadius = "10px";
    let currentElement = event.target;

    // Set styles for previous siblings
    let previousTd = currentElement.previousElementSibling;
    while (previousTd) {
      previousTd.style.background = "white";
      previousTd.style.color = "black";
      previousTd = previousTd.previousElementSibling;
    }

    // Set styles for next siblings
    let nextTd = currentElement.nextElementSibling;
    while (nextTd) {
      nextTd.style.background = "white";
      nextTd.style.color = "black";
      nextTd = nextTd.nextElementSibling;
    }

    if (val === "12m") {
      setVisu("Last 12 months");
      newLabel = clicksPerMonthArray.map((item) => item.month);
      newValues = clicksPerMonthArray.map((item) => item.count);
    } else if (val === "3m") {
      setVisu("Last 7 days");

      newLabel = clicksPerQuarterArray.map((item) => item.day);
      newValues = clicksPerQuarterArray.map((item) => item.count);
    } else if (val === "24h") {
      setVisu("Today/Live");
      newLabel = clicksPerHourArray.map((item) => item.hour);
      newValues = clicksPerHourArray.map((item) => item.count);
    } else if (val === "30d") {
      setVisu("Last 30 days");
      newLabel = clicksPerLast30DaysArray.map((item) => item.day);
      newValues = clicksPerLast30DaysArray.map((item) => item.count);
    }

    setLabel(newLabel);
    setValues(newValues);
  };

  if (error1) {
    return <div>Error fetching data</div>;
  }

  const ContentLoaderCompo1 = () => (
    <ContentLoader
      speed={2}
      width={1120}
      height={860}
      viewBox="0 20 300 200"
      backgroundColor="#E8EAE6"
      foregroundColor="#CDD0CB"
    >
      <rect x="0" y="0" rx="3" ry="3" width="400" height="45" />
      <rect x="0" y="50" rx="3" ry="3" width="400" height="400" />
    </ContentLoader>
  );

  if (isLoading1) {
    return (
      <div class="main-content">
        <ContentLoader
          speed={2}
          width={1120}
          height={860}
          viewBox="0 20 300 200"
          backgroundColor="#E8EAE6"
          foregroundColor="#CDD0CB"
        >
          <rect x="0" y="0" rx="3" ry="3" width="400" height="45" />
          <rect x="0" y="50" rx="3" ry="3" width="400" height="45" />
          <rect x="0" y="100" rx="3" ry="3" width="400" height="400" />
        </ContentLoader>
      </div>
    );
  }

  return (
    <div class="main-content">
      <section class="section">
        <div class="row ">
          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div class="card" style={{ pointerEvents: "none" }}>
              <div class="card-statistic-4">
                <div class="align-items-center justify-content-between">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                      <div class="card-content">
                        <h5 class="font-15">Total Ambassador</h5>
                        <h2 class="mb-3 font-18">{totalRegisteredUsers}</h2>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                      <div class="banner-img">
                        <img src={image1} alt=""></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div class="card" style={{ pointerEvents: "none" }}>
              <div class="card-statistic-4">
                <div class="align-items-center justify-content-between">
                  <div class="row ">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                      <div class="card-content">
                        <h5 class="font-15"> Total Programs</h5>
                        <h2 class="mb-3 font-18">{totalPrograms}</h2>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                      <div class="banner-img">
                        <img src={image2} alt=""></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12"
            style={{ pointerEvents: "none" }}
          >
            <div class="card" title="click to expand">
              <div class="card-statistic-4">
                <div class="align-items-center justify-content-between">
                  <div class="row ">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                      <div class="card-content">
                        <h5 class="font-15">Total links generated</h5>
                        <h2 class="mb-3 font-18">{totalLinks}</h2>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                      <div class="banner-img">
                        <img src={image3} alt=""></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12"
            onClick={() => handleClick("Clicks")}
            style={{ pointerEvents: "none" }}
          >
            <div class="card" title="click to expand">
              <div class="card-statistic-4">
                <div class="align-items-center justify-content-between">
                  <div class="row ">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                      <div class="card-content">
                        <h5 class="font-15">Total clicks</h5>
                        <h2 class="mb-3 font-18">{totalClicksCount}</h2>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                      <div class="banner-img">
                        <img src={image4} alt=""></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isLoading2 ? (
          <>
            <ContentLoaderCompo1
              start={"0"}
              heightVar={"45"}
            ></ContentLoaderCompo1>
          </>
        ) : (
          <>
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h4>{mode} Detail</h4>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <tr>
                          <th>Last 12 Months</th>
                          <th>Last 30 days</th>
                          <th>Last 7 days</th>
                          <th>Today/Live</th>
                        </tr>
                        <tr>
                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "12m")}
                          >
                            {clicksPerMonthArray.reduce(
                              (acc, value) => acc + value.count,
                              0
                            )}
                          </td>
                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "30d")}
                          >
                            {clicksPerLast30DaysArray.reduce(
                              (acc, value) => acc + value.count,
                              0
                            )}
                          </td>
                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "3m")}
                          >
                            {clicksPerQuarterArray.reduce(
                              (acc, value) => acc + value.count,
                              0
                            )}
                          </td>

                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "24h")}
                            style={{
                              background: "#7a117a",
                              color: "white",
                              borderRadius: "10px",
                            }}
                          >
                            {clicksPerHourArray.reduce(
                              (acc, value) => acc + value.count,
                              0
                            )}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12 col-lg-12">
                <div class="card ">
                  <div class="card-header">
                    <h4>Traffic to all sites - {visu}</h4>
                  </div>
                  {/* <div class="card-body">
                    <ChartComponent
                      labels={label}
                      data={values}
                    ></ChartComponent>

                  </div> */}
                  <div className="chart-class">
                    <div class="card-body" style={{ width: "50%" }}>
                      <ChartComponent
                        labels={label}
                        data={values}
                      ></ChartComponent>
                    </div>
                    <div class="card-body" style={{ width: "50%" }}>
                      <PieChartComponent
                        labels={label}
                        values={values}
                      ></PieChartComponent>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default MainDash;
