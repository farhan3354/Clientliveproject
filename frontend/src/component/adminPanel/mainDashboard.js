import React from "react";
import ChartComponent from "../mbaUsers/chartt";
import image1 from "../../img/banner/1.png";
import image2 from "../../img/banner/2.png";
import image3 from "../../img/banner/3.png";
import image4 from "../../img/banner/4.png";
import ContentLoaderCompo from "../contentloader";
import axios from "axios";
import GetLink from "../apiLink";
class MainDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalRegisteredUsers: 0,
      totalPrograms: 0,
      totalLinks: 0,
      totalClicksCount: 0,

      linksPerHourArray: [],
      linksPerLast30DaysArray: [],
      linksPerQuarterArray: [],
      linksPerMonthArray: [],

      clicksPerHourArray: [],
      clicksPerLast30DaysArray: [],
      clicksPerQuarterArray: [],
      clicksPerMonthArray: [],

      mode: "Clicks",

      label: [],
      values: [],

      prev: 0,

      loading: true, // add a loading state
    };
  }
  handleClick = (val) => {
    this.setState({ mode: val });
  };

  componentDidMount() {
    axios
      .get(GetLink() + "/admindashboard")
      .then((res) => {
        const data = res.data;

        this.setState({
          // totalRegisteredUsers: data.dashboardData.totalRegisteredUsers,
          // totalPrograms: data.dashboardData.totalPrograms,
          // totalLinks: data.dashboardData.totalLinks,
          // totalClicksCount: data.dashboardData.totalClicksCount,

          // linksPerHourArray: data.dashboardData.linksPerHourArray,
          // linksPerLast30DaysArray: data.dashboardData.linksPerLast30DaysArray,
          // linksPerQuarterArray: data.dashboardData.linksPerQuarterArray,
          // linksPerMonthArray: data.dashboardData.linksPerMonthArray,

          clicksPerHourArray: data.dashboardData.clicksPerHourArray,
          clicksPerLast30DaysArray: data.dashboardData.clicksPerLast30DaysArray,
          clicksPerQuarterArray: data.dashboardData.clicksPerQuarterArray,
          clicksPerMonthArray: data.dashboardData.clicksPerMonthArray,
          loading: false, // set loading to false once data is fetched
        });
      })
      .catch((err) => console.error(err));
  }

  handleMouseEnter = (event) => {
    this.setState({ prev: event.target.textContent });
    event.target.textContent = "Visualize";
  };

  handleMouseLeave = (event) => {
    const { mode } = this.state;
    if (mode === "Clicks") {
      event.target.textContent = this.state.prev;
    } else {
      event.target.textContent = this.state.prev;
    }
  };

  handleVisualizeClick = (event, val) => {
    let label = [];
    let values = [];

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
      label = this.state.clicksPerMonthArray.map((item) => item.monthName);
      values =
        this.state.mode === "Clicks"
          ? this.state.clicksPerMonthArray.map((item) => item.clickCount)
          : this.state.linksPerMonthArray.map((item) => item.linkCount);
    } else if (val === "3m") {
      label = this.state.clicksPerQuarterArray.map(
        (item) => item.quarterPeriod
      );
      values =
        this.state.mode === "Clicks"
          ? this.state.clicksPerQuarterArray.map((item) => item.clickCount)
          : this.state.linksPerQuarterArray.map((item) => item.linkCount);
    } else if (val === "24h") {
      label = this.state.clicksPerHourArray.map((item) => item.hour + ":00");
      values =
        this.state.mode === "Clicks"
          ? this.state.clicksPerHourArray.map((item) => item.clickCount)
          : this.state.linksPerHourArray.map((item) => item.linkCount);
    } else if (val === "30d") {
      label = this.state.clicksPerLast30DaysArray.map((item) => item.day);
      values =
        this.state.mode === "Clicks"
          ? this.state.clicksPerLast30DaysArray.map((item) => item.clickCount)
          : this.state.linksPerLast30DaysArray.map((item) => item.linkCount);
    }

    this.setState({
      label: label,
      values: values,
    });
  };
  render() {
    const { loading } = this.state;

    return (
      // <div class="main-content">
      //   {loading && <ContentLoaderCompo></ContentLoaderCompo>}
      //   {!loading && (
      //     <section class="section">
      //       <div class="row ">
      //         <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
      //           <div class="card" style={{ pointerEvents: "none" }}>
      //             <div class="card-statistic-4">
      //               <div class="align-items-center justify-content-between">
      //                 <div class="row">
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
      //                     <div class="card-content">
      //                       <h5 class="font-15">Total Ambassador</h5>
      //                       <h2 class="mb-3 font-18">
      //                         {this.state.totalRegisteredUsers}
      //                       </h2>
      //                     </div>
      //                   </div>
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
      //                     <div class="banner-img">
      //                       <img src={image1} alt=""></img>
      //                     </div>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //         <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
      //           <div class="card" style={{ pointerEvents: "none" }}>
      //             <div class="card-statistic-4">
      //               <div class="align-items-center justify-content-between">
      //                 <div class="row ">
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
      //                     <div class="card-content">
      //                       <h5 class="font-15"> Total Programs</h5>
      //                       <h2 class="mb-3 font-18">
      //                         {this.state.totalPrograms}
      //                       </h2>
      //                     </div>
      //                   </div>
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
      //                     <div class="banner-img">
      //                       <img src={image2} alt=""></img>
      //                     </div>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //         <div
      //           class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12"
      //           onClick={() => this.handleClick("Links")}
      //         >
      //           <div class="card" title="click to expand">
      //             <div class="card-statistic-4">
      //               <div class="align-items-center justify-content-between">
      //                 <div class="row ">
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
      //                     <div class="card-content">
      //                       <h5 class="font-15">Total links generated</h5>
      //                       <h2 class="mb-3 font-18">
      //                         {this.state.totalLinks}
      //                       </h2>
      //                     </div>
      //                   </div>
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
      //                     <div class="banner-img">
      //                       <img src={image3} alt=""></img>
      //                     </div>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //         <div
      //           class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12"
      //           onClick={() => this.handleClick("Clicks")}
      //         >
      //           <div class="card" title="click to expand">
      //             <div class="card-statistic-4">
      //               <div class="align-items-center justify-content-between">
      //                 <div class="row ">
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
      //                     <div class="card-content">
      //                       <h5 class="font-15">Total clicks</h5>
      //                       <h2 class="mb-3 font-18">
      //                         {this.state.totalClicksCount}
      //                       </h2>
      //                     </div>
      //                   </div>
      //                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
      //                     <div class="banner-img">
      //                       <img src={image4} alt=""></img>
      //                     </div>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div class="row">
      //         <div class="col-12">
      //           <div class="card">
      //             <div class="card-header">
      //               <h4>{this.state.mode} Detail</h4>
      //             </div>
      //             <div class="card-body p-0">
      //               <div class="table-responsive">
      //                 <table class="table table-striped">
      //                   <tr>
      //                     <th>Last 12 Months</th>
      //                     <th>Last 3 Month</th>
      //                     <th>Last 30 days</th>
      //                     <th>Today/Live</th>
      //                   </tr>
      //                   <tr>
      //                     <td
      //                       onMouseEnter={this.handleMouseEnter}
      //                       onMouseLeave={this.handleMouseLeave}
      //                       onClick={(e) => this.handleVisualizeClick(e, "12m")}
      //                     >
      //                       {this.state.mode === "Clicks"
      //                         ? this.state.clicksPerMonthArray.reduce(
      //                             (acc, value) => acc + value.clickCount,
      //                             0
      //                           )
      //                         : this.state.linksPerMonthArray.reduce(
      //                             (acc, value) => acc + value.linkCount,
      //                             0
      //                           )}
      //                     </td>
      //                     <td
      //                       onMouseEnter={this.handleMouseEnter}
      //                       onMouseLeave={this.handleMouseLeave}
      //                       onClick={(e) => this.handleVisualizeClick(e, "3m")}
      //                     >
      //                       {this.state.mode === "Clicks"
      //                         ? this.state.clicksPerQuarterArray.reduce(
      //                             (acc, value) => acc + value.clickCount,
      //                             0
      //                           )
      //                         : this.state.linksPerQuarterArray.reduce(
      //                             (acc, value) => acc + value.linkCount,
      //                             0
      //                           )}
      //                     </td>
      //                     <td
      //                       onMouseEnter={this.handleMouseEnter}
      //                       onMouseLeave={this.handleMouseLeave}
      //                       onClick={(e) => this.handleVisualizeClick(e, "30d")}
      //                     >
      //                       {this.state.mode === "Clicks"
      //                         ? this.state.clicksPerLast30DaysArray.reduce(
      //                             (acc, value) => acc + value.clickCount,
      //                             0
      //                           )
      //                         : this.state.linksPerLast30DaysArray.reduce(
      //                             (acc, value) => acc + value.linkCount,
      //                             0
      //                           )}
      //                     </td>
      //                     <td
      //                       onMouseEnter={this.handleMouseEnter}
      //                       onMouseLeave={this.handleMouseLeave}
      //                       onClick={(e) => this.handleVisualizeClick(e, "24h")}
      //                     >
      //                       {this.state.mode === "Clicks"
      //                         ? this.state.clicksPerHourArray.reduce(
      //                             (acc, value) => acc + value.clickCount,
      //                             0
      //                           )
      //                         : this.state.linksPerHourArray.reduce(
      //                             (acc, value) => acc + value.linkCount,
      //                             0
      //                           )}
      //                     </td>
      //                   </tr>
      //                 </table>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //       <div class="row">
      //         <div class="col-12 col-sm-12 col-lg-12">
      //           <div class="card ">
      //             <div class="card-header">
      //               <h4>Clicks Visualization</h4>
      //             </div>
      //             <div class="card-body">
      //               <ChartComponent
      //                 labels={this.state.label}
      //                 data={this.state.values}
      //               ></ChartComponent>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </section>
      //   )}
      // </div>
      <></>
    );
  }
}

export default MainDash;
