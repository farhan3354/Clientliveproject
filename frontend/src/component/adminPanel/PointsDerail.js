import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import ChartComponent from "../mbaUsers/chartt";
import ContentLoader from "react-content-loader";
import PieChartComponent from "../PieChart";
import axios from "axios";
import ChartComponentLong from "./multichart";
import GetLink from "../apiLink";
const PointsDerail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedValue, setSelectedValue] = useState("All");

  const handleSelectChange = (event) => {
    setIsLoading(true);

    setSelectedValue(event.target.value);
  };

  const [label, setLabel] = useState([]);
  const [values, setValues] = useState([]);

  const [prev, setPrev] = useState(0);

  const [pLinks, setPLinks] = useState([]);
  const [visu, setVisu] = useState("Last 12 months");

  const {
    isLoading: isLoading2,
    error: error2,
    data: data2,
  } = useQuery("query5", () =>
    axios.get(GetLink() + "/getAllProgramsId").then((res) => {
      console.log(res.data);
      return res.data;
    })
  );

  useEffect(() => {
    if (data2) {
      setPLinks(data2);
      if (data2.length === 0) {
        setIsLoading(true);
      }
    }
  }, [data2, selectedValue]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      setError(null);
      setData(null);
      try {
        const response = await axios.get(
          `${GetLink()}/getProgramDetail?id=${selectedValue}`
        );
        console.log(response.data);
        setData(response.data);

        if (pLinks.length === 0) {
          setIsLoading(true);
          return;
        } else {
          setIsLoading(false);
        }
        let newLabel = [];
        let newValues = [];
        if (selectedValue === "All") {
          newLabel = response.data[0].countsArray12.map((item) => item.month);
          newValues = response.data.map((obj) =>
            obj.countsArray12.map((item) => item.count)
          );
        } else {
          newLabel = response.data.countsArray12.map((item) => item.month);
          newValues = response.data.countsArray12.map((item) => item.count);
        }
        setLabel(newLabel);
        setValues(newValues);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedValue) {
      fetchData();
    }
  }, [selectedValue, pLinks]);

  const handleMouseEnter = (event) => {
    setPrev(event.target.textContent);
    event.target.textContent = "Visualize";
  };

  const handleMouseLeave = (event) => {
    event.target.textContent = prev;
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
      if (data.length > 1) {
        newLabel = data[0].countsArray12.map((item) => item.month);
        newValues = data.map((obj) =>
          obj.countsArray12.map((item) => item.count)
        );
      } else {
        newLabel = data.countsArray12.map((item) => item.month);
        newValues = data.countsArray12.map((item) => item.count);
      }
    } else if (val === "30d") {
      setVisu("Last 30 days");
      if (data.length > 1) {
        newLabel = data[0].datesArray.map((item) => item.day);
        newValues = data.map((obj) => obj.datesArray.map((item) => item.count));
      } else {
        newLabel = data.datesArray.map((item) => item.day);
        newValues = data.datesArray.map((item) => item.count);
      }
    } else if (val === "24h") {
      setVisu("Last 24 hours/Live");
      if (data.length > 1) {
        newLabel = data[0].countsArray24.map((item) => item.hour);
        newValues = data.map((obj) =>
          obj.countsArray24.map((item) => item.count)
        );
      } else {
        newLabel = data.countsArray24.map((item) => item.hour);
        newValues = data.countsArray24.map((item) => item.count);
      }
    } else if (val === "7d") {
      setVisu("Last 7 days");
      if (data.length > 1) {
        newLabel = data[0].last7days.map((item) => item.day);
        newValues = data.map((obj) => obj.last7days.map((item) => item.count));
      } else {
        newLabel = data.last7days.map((item) => item.day);
        newValues = data.last7days.map((item) => item.count);
      }
    }

    setLabel(newLabel);
    setValues(newValues);
  };

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

  return (
    <div class="main-content">
      <section class="section">
        {isLoading | (isLoading2 === true) ? (
          <>
            <ContentLoaderCompo1
              start={"0"}
              heightVar={"45"}
            ></ContentLoaderCompo1>
          </>
        ) : (
          <>
            <div class="row" style={{ marginTop: "-12px" }}>
              <div class="col-12">
                <div class="card">
                  <select
                    style={{
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      width: "300px",
                      margin: "10px",
                    }}
                    value={selectedValue}
                    onChange={handleSelectChange}
                  >
                    <option value="All">Traffic to all Sites</option>
                    {pLinks.length > 1 &&
                      pLinks.map((p) => {
                        return <option value={p.id}>{p.link}</option>;
                      })}
                  </select>
                  <h4>
                    Total Traffic :{" "}
                    {selectedValue !== "All"
                      ? data.totalPoints
                      : data.reduce((sum, obj) => {
                          return sum + obj.totalPoints;
                        }, 0)}{" "}
                    Visitors
                  </h4>

                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <tr>
                          <th>This Quarter</th>
                          <th>This Month</th>
                          <th>This Week</th>
                          <th>Today/Live</th>
                        </tr>
                        <tr>
                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "12m")}
                            style={{
                              background: "#7a117a",
                              color: "white",
                              borderRadius: "10px",
                            }}
                          >
                            {selectedValue !== "All"
                              ? data.countsArray12.reduce(
                                  (acc, value) => acc + value.count,
                                  0
                                )
                              : data.reduce((sum, obj) => {
                                  return (
                                    sum +
                                    obj.countsArray12.reduce(
                                      (acc, value) => acc + value.count,
                                      0
                                    )
                                  );
                                }, 0)}
                          </td>
                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "30d")}
                          >
                            {selectedValue !== "All"
                              ? data.datesArray.reduce(
                                  (acc, value) => acc + value.count,
                                  0
                                )
                              : data.reduce((sum, obj) => {
                                  return (
                                    sum +
                                    obj.datesArray.reduce(
                                      (acc, value) => acc + value.count,
                                      0
                                    )
                                  );
                                }, 0)}
                          </td>
                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "7d")}
                          >
                            {selectedValue !== "All"
                              ? data.last7days.reduce(
                                  (acc, value) => acc + value.count,
                                  0
                                )
                              : data.reduce((sum, obj) => {
                                  return (
                                    sum +
                                    obj.last7days.reduce(
                                      (acc, value) => acc + value.count,
                                      0
                                    )
                                  );
                                }, 0)}
                          </td>
                          <td
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleVisualizeClick(e, "24h")}
                          >
                            {selectedValue !== "All"
                              ? data.countsArray24.reduce(
                                  (acc, value) => acc + value.count,
                                  0
                                )
                              : data.reduce((sum, obj) => {
                                  return (
                                    sum +
                                    obj.countsArray24.reduce(
                                      (acc, value) => acc + value.count,
                                      0
                                    )
                                  );
                                }, 0)}
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
                    <h4>Traffic Visualization - {visu}</h4>
                  </div>

                  {selectedValue === "All" ? (
                    <div
                      className="chart-class"
                      style={{ display: "block", padding: "10px" }}
                    >
                      <ChartComponentLong
                        labels={label}
                        data={values}
                        sites={pLinks}
                      />
                    </div>
                  ) : (
                    <div
                      className="chart-class"
                      style={{ display: "flex", padding: "0px" }}
                    >
                      <ChartComponent
                        labels={label}
                        data={values}
                      ></ChartComponent>
                      <div class="card-body" style={{ width: "50%" }}>
                        <PieChartComponent
                          labels={label}
                          values={values}
                        ></PieChartComponent>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default PointsDerail;
