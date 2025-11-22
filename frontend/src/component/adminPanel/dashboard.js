import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import logo from "../../img/logo.png";
import "../css/dashboard.css";
import MainDash from "./dashboadfun";
import PointsDerail from "./PointsDerail";
import LoadingSpinner from "../Spinner";
import GetLink from "../apiLink";
// import AddRewardGiving from "./AddRewardGiving";
// const MainDash = React.lazy(() => import("./dashboadfun"));
const AddProgram = React.lazy(() => import("./addProgram"));
const AddRewardGiving = React.lazy(() => import("./AddRewardGiving"));
const ModifyProgram = React.lazy(() => import("./manageProgram"));
const LeadBoardNew = React.lazy(() => import("./LeadBoadNew"));
const Users = React.lazy(() => import("./users"));
const PasswordChange = React.lazy(() => import("./settings"));
const Sitecontroller = React.lazy(() => import("./siteController"));
const RewardsSection = React.lazy(() => import("./rewards"));
const ContentLoader = React.lazy(() => import("../contentloader"));
const EmailMba = React.lazy(() => import("./EmailMba"));
const PostTemp = React.lazy(() => import("./PostTemp"));
const ByLocation = React.lazy(() => import("./Bylocation"));
const Tracking = React.lazy(() => import("../adminPanel/CustomerTracking/Dashboar"));
const SendEmail = React.lazy(() => import("../adminPanel/CustomerTracking/SendMail"));

const AdminDashboard = () => {
  const [currclick, setCurrclick] = useState("dash");
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [width, setWidth] = useState(window.innerWidth);

  // Function to check the user's session and role
  const checkSession = () => {
    axios
      .get(GetLink() + "/api/check-session", {
        withCredentials: true, // Include credentials in the request
      })
      .then((response) => {
        const data = response.data;

        if (!data.isLoggedIn || data.role === "mba") {
          // window.location.href = "/signin";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  checkSession();

  const handleLogout = () => {
    window.location.href = "/signin";
    axios
      .get(GetLink() + "/api/destroy", {
        withCredentials: true, // Include credentials in the request
      })
      .then((response) => {
        const data = response.data;
        if (data.message === "done") {
          // window.location.href = "/signin";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setShowSidebar(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setShowSidebar(width >= 768); // Adjust the breakpoint as needed
  };
  const handleClick = (value) => {
    setCurrclick(value);
    if (width < 768) {
      setShowSidebar(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div
      id="app light light-sidebar"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div
        className={`main-wrapper main-wrapper-1 theme-white ${
          showSidebar ? "" : "hide-sidebar"
        }`}
      >
        <nav className="navbar navbar-expand-lg main-navbar sticky light light-sidebar navClass">
          <ul className="navbar-nav navbar-right setting_logout">
            {width < 768 && (
              <div className="sidebar-header" style={{ marginRight: "20%" }}>
                <i
                  className={`fi fi-br-menu-burger ${
                    showSidebar ? "fi-rotate-180" : ""
                  }`}
                  onClick={toggleSidebar}
                ></i>
              </div>
            )}
            <li onClick={() => handleClick("settings")}>Settings</li>

            <li onClick={() => handleLogout()}>Logout</li>
          </ul>
        </nav>

        <div className="main-sidebar sidebar-style-2">
          <aside id="sidebar-wrapper">
            <div className="sidebar-brand">
              <a href="">
                <span className="logo-name">Admin</span>
              </a>
            </div>
            <ul className="sidebar-menu">
              <li className="menu-header">
                Main
                {width < 768 && (
                  <div className="sidebar-header">
                    <i
                      className={`fi fi-br-menu-burger ${
                        showSidebar ? "fi-rotate-180" : ""
                      }`}
                      onClick={toggleSidebar}
                    ></i>
                  </div>
                )}
              </li>
              <hr></hr>
              <li
                className={`dropdown ${
                  currclick === "dash" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("dash")}
                >
                  <i className="fi fi-sr-dashboard"></i>
                  <span>Dashboard</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "addprogram" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("addprogram")}
                >
                  <i className="fi fi-sr-add"></i>
                  <span>Add Program</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "manageProgram" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("manageProgram")}
                >
                  <i className="fi fi-sr-browser"></i>
                  <span>Manage Program</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "sitelink" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("sitelink")}
                >
                  <i className="fi fi-sr-link"></i>
                  <span>Brand Sites</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "leadboard" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("leadboard")}
                >
                  <i className="fi fi-sr-mobile"></i>
                  <span>Leadboard/Ranking</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "detail" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("detail")}
                >
                  <i className="fi fi-sr-browser"></i>
                  <span>Traffic Detail</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "users" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("users")}
                >
                  <i className="fi fi-sr-users-alt"></i>
                  <span>Users</span>
                </p>
              </li>

              <li
                className={`dropdown ${
                  currclick === "emailmba" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("emailmba")}
                >
                  <i class="fi fi-sr-envelope"></i>
                  <span>Email MBA</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "posttemp" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("posttemp")}
                >
                  <i class="fi fi-sr-blog-text"></i>
                  <span>Post Template</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "location" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("location")}
                >
                  <i class="fi fi-sr-envelope"></i>
                  <span>MBA Locations</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "Rewards" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("Rewards")}
                >
                  <i className="fi fi-sr-gift"></i>
                  <span>Rewards</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "adddRewards" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("adddRewards")}
                >
                  <i className="fi fi-sr-gift"></i>
                  <span>Add Rewards Giving</span>
                </p>
              </li>

              <li
                className={`dropdown ${
                  currclick === "customerTracking" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("customerTracking")}
                >
                  <i className="fi fi-sr-gift"></i>
                  <span>Customer Tracking</span>
                </p>
              </li>
              <li
                className={`dropdown ${
                  currclick === "sendEmail" ? "sidebarActive" : ""
                }`}
              >
                <p
                  className="nav-link has-dropdown"
                  onClick={() => handleClick("sendEmail")}
                >
                  <i className="fi fi-sr-gift"></i>
                  <span>Send Email</span>
                </p>
              </li>
            </ul>
          </aside>
        </div>
        {currclick === "dash" && <MainDash />}

        {currclick === "addprogram" && (
          <AddProgram setCurrclickFunc={setCurrclick} />
        )}
        {currclick === "manageProgram" && <ModifyProgram />}
        {currclick === "leadboard" && <LeadBoardNew />}
        {currclick === "users" && <Users></Users>}
        {currclick === "sitelink" && <Sitecontroller></Sitecontroller>}
        {currclick === "settings" && <PasswordChange></PasswordChange>}
        {currclick === "Rewards" && <RewardsSection></RewardsSection>}
        {currclick === "detail" && <PointsDerail />}
        {currclick === "emailmba" && <EmailMba />}
        {currclick === "posttemp" && <PostTemp />}
        {currclick === "location" && <ByLocation />}
        {currclick === "adddRewards" && <AddRewardGiving />}
        {currclick === "customerTracking" && <Tracking />}
        {currclick === "sendEmail" && <SendEmail />}

      </div>
    </div>
  );
};

export default AdminDashboard;
