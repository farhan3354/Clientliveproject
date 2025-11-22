import React from "react";
import { Helmet } from "react-helmet";
import UserDashContentFun from "./funcDashContent";
import ManagePrograms from "./managePorgram";
import ProgramDetails from "./programs";
import UserProfile from "./profile";
import PasswordChange from "./settings";
import Ranking from "./ranking";
import RewardsSection from "./rewards";
import ProgramLink from "./programLink";
import GlobalRankNew from "./GlobalRankNew";
import axios from "axios";
import GetLink from "../apiLink";
import PostTemp from "./posttemp";
import ReferralProgram from "./ReferralProgram"; // Import ReferralProgram
import { Spinner } from "react-bootstrap";

class UserDash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currclick: "dash",
      login: false,
      sidebarVisible: true, // Add a state for sidebar visibility
      width: window.innerWidth,
      userid: "",
    };
  }

  checkSession = () => {
    axios
      .get(GetLink() + "/api/check-session", { withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (data.isLoggedIn) {
          this.setState({
            login: true,
            userid: data.userId, // Set userId dynamically based on session data
          });
        } else {
          this.setState({ login: false });
          // Optionally redirect or handle unauthenticated users here
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  

  handleClick = (value) => {
    this.setState({ currclick: value });
  };

  handleLogout = () => {
    window.location.href = "/signin";
    this.setState({ login: false });
    axios
      .get(GetLink() + "/api/destroy", {
        withCredentials: true, // Include credentials in the request
      })
      .then((response) => {
        const data = response.data;
        if (data.message === "done") {
          window.location.href = "/signin";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  handleToggleSidebar = () => {
    this.setState((prevState) => ({
      sidebarVisible: !prevState.sidebarVisible,
    }));
  };

  handleResize = () => {
    this.setState({ width: window.innerWidth });
    if (window.innerWidth < 768) {
      this.setState({ sidebarVisible: false });
    } else {
      this.setState({ sidebarVisible: true });
    }
  };

  componentDidMount() {
    this.checkSession();
    window.addEventListener("resize", this.handleResize);

    if (this.state.width < 768) {
      this.setState({ sidebarVisible: false });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    if (this.state.userid === "") {
      return <Spinner />;
    }
    return (
      <div id="app">
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css"
          ></link>
        </Helmet>

        <div
          className={`main-wrapper main-wrapper-1 ${
            this.state.sidebarVisible ? "" : "hide-sidebar"
          }`}
        >
          <div className="navbar-bg"></div>
          <div className="main-wrapper main-wrapper-1 theme-white">
            <nav className="navbar navbar-expand-lg main-navbar sticky light light-sidebar navClass">
              <div className="d-flex align-items-center">
                <ul className="navbar-nav navbar-right setting_logout">
                  <li style={{ position: "absolute", marginRight: "77%" }}>
                    {this.state.width < 768 && (
                      <i
                        className={`fi fi-br-menu-burger ${
                          this.state.sidebarVisible ? "fi-rotate-180" : ""
                        }`}
                        onClick={this.handleToggleSidebar}
                      ></i>
                    )}
                  </li>
                  <li onClick={() => this.handleClick("settings")}>Settings</li>
                  <li onClick={() => this.handleLogout()}>Logout</li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="main-sidebar sidebar-style-2">
            <aside
              id="sidebar-wrapper"
              className={`${this.state.sidebarVisible ? "" : "hide-sidebar"}`}
            >
              <div className="sidebar-brand">
                <a href="">
                  <span className="logo-name">MBA</span>
                </a>
              </div>
              <hr />
              <ul className="sidebar-menu">
                <li className="menu-header">
                  {this.state.width < 768 && (
                    <div className="sidebar-header">
                      <i
                        className={`fi fi-br-menu-burger ${
                          this.state.sidebarVisible ? "fi-rotate-180" : ""
                        }`}
                        onClick={this.handleToggleSidebar}
                      ></i>
                      <hr />
                    </div>
                  )}
                </li>

                <li
                  className={`dropdown ${
                    this.state.currclick === "dash" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("dash");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-dashboard"></i>
                    <span>Dashboard</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "profile" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("profile");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-user"></i>
                    <span>Profile</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "referral" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("referral");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-user"></i>
                    <span>Referral Program</span>
                  </p>
                </li>

                <li
                  className={`dropdown ${
                    this.state.currclick === "programs" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("programs");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-mobile"></i>
                    <span>Program Detail</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "ProgramLink"
                      ? "sidebarActive"
                      : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("ProgramLink");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-link"></i>
                    <span>Programs Links</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "posttemp" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("posttemp");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-blog-text"></i>
                    <span>Post Templates</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "ranking" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("ranking");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-rectangle-list"></i>
                    <span>Points Detail</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "global" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("global");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-sort"></i>
                    <span>Global Points</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "rewards" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("rewards");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-gift"></i>
                    <span>Give Aways</span>
                  </p>
                </li>
                <li
                  className={`dropdown ${
                    this.state.currclick === "settings" ? "sidebarActive" : ""
                  }`}
                >
                  <p
                    className="nav-link has-dropdown"
                    onClick={() => {
                      this.handleClick("settings");
                      if (this.state.width < 768) this.handleToggleSidebar();
                      return;
                    }}
                  >
                    <i className="fi fi-sr-settings"></i>
                    <span>Settings</span>
                  </p>
                </li>
              </ul>
            </aside>
          </div>
          {this.state.userid}
          {this.state.currclick === "dash" && this.state.userid !== "" && (
            <UserDashContentFun id={this.state.userid} />
          )}
          {this.state.currclick === "manageProgram" &&
            this.state.userid !== "" && (
              <ManagePrograms id={this.state.userid} />
            )}
          {this.state.currclick === "programs" && this.state.userid !== "" && (
            <ProgramDetails id={this.state.userid} />
          )}
          {this.state.currclick === "profile" && this.state.userid !== "" && (
            <UserProfile id={this.state.userid} />
          )}
          {this.state.currclick === "settings" && this.state.userid !== "" && (
            <PasswordChange id={this.state.userid} />
          )}
          {this.state.currclick === "ranking" && this.state.userid !== "" && (
            <Ranking id={this.state.userid} />
          )}
          {this.state.currclick === "rewards" && this.state.userid !== "" && (
            <RewardsSection id={this.state.userid} />
          )}
          {this.state.currclick === "ProgramLink" &&
            this.state.userid !== "" && <ProgramLink id={this.state.userid} />}
          {this.state.currclick === "global" && this.state.userid !== "" && (
            <GlobalRankNew id={this.state.userid} />
          )}
          {this.state.currclick === "posttemp" && this.state.userid !== "" && (
            <PostTemp id={this.state.userid} />
          )}
          {this.state.currclick === "referral" && this.state.userid !== "" && (
            <ReferralProgram id={this.state.userid} />
          )}
        </div>
      </div>
    );
  }
}

export default UserDash;
