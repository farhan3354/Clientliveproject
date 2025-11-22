import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import no_img from "../../bundles/no-picture.jpeg";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
const ManagePrograms = ({ isLoggedIn, id }) => {
  const [programs, setPrograms] = useState([]);
  const [user, setUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  useEffect(() => {
    fetch(GetLink() + "/programs")
      .then((response) => response.json())
      .then((data) => {
        setPrograms(data);
        setLoading2(false);
      })
      .catch((error) => console.error(error));

    const userid = id;

    fetch(GetLink() + "/user/" + userid)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
    if (showNotification) {
      setTimeout(() => setShowNotification(false), 3000);
    }
  }, [showNotification]);

  const isEnrolled = (programId) => {
    if (user) {
      for (let record of user.records) {
        if (record && record.programId === programId) {
          return true;
        }
      }
    }
    return false;
  };

  const handleEnroll = async (programId) => {
    if (user) {
      const userId = user._id;
      try {
        const response = await fetch(
          `${GetLink()}/enrolProgram?userId=${userId}&programId=${programId}`
        );
        const data = await response.json();
        const updatedUser = { ...user };
        updatedUser.records = data.records;
        setUser(updatedUser);
        const textarea = document.createElement("textarea");
        textarea.value =
          GetLink() + "/" + data.records[data.records.length - 1].programLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast(
          "Program enrolled! Link Copied to clipboard \t Go to Enrolled Programs to get it's link",
          {
            position: "top-right", // Position of the notification
            autoClose: 10000, // Time in milliseconds before the notification automatically closes
            hideProgressBar: false, // Whether to display a progress bar
            closeOnClick: true, // Whether to close the notification when clicked
            pauseOnHover: true, // Whether to pause the autoClose timer when hovered
            draggable: true, // Whether the notification can be dragged
            className: "color_green",
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDropConfirmation = (programId) => {
    confirmAlert({
      title: "Confirm",
      message:
        "Deleting this will vanish all your points. Still want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (user && programId) {
              const enrolledProgram = user.records.find(
                (record) => record.programId === programId
              );
              if (enrolledProgram) {
                const userId = user._id;
                fetch(
                  `${GetLink()}/dropProgram?userId=${userId}&enrolledProgramId=${
                    enrolledProgram.programId
                  }`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    const updatedUser = { ...user };
                    updatedUser.records = updatedUser.records.filter(
                      (record) => record.programId !== enrolledProgram.programId
                    );
                    setUser(updatedUser);
                    toast("Program dropped!", {
                      position: "top-right", // Position of the notification
                      autoClose: 5000, // Time in milliseconds before the notification automatically closes
                      hideProgressBar: false, // Whether to display a progress bar
                      closeOnClick: true, // Whether to close the notification when clicked
                      pauseOnHover: true, // Whether to pause the autoClose timer when hovered
                      draggable: true, // Whether the notification can be dragged
                      className: "color_green",
                    });
                  })
                  .catch((error) => console.error(error));
              }
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing or handle cancellation
            // ...
          },
        },
      ],
    });
  };

  return (
    <div className="main-content">
      {loading && <ContentLoaderCompo></ContentLoaderCompo>}
      <ToastContainer />
      <h3 className="project_manage_heading" style={{ marginBottom: "10px" }}>
        Program Management
      </h3>
      {loading || loading2 ? (
        <ContentLoaderCompo></ContentLoaderCompo>
      ) : (
        <div className="row managePrograms">
          {programs.map((program) => (
            <div key={program._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-header">
                  <img
                    src={`${GetLink()}/${program.images}` || no_img}
                    className="card-img-top"
                    alt={program.name}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{program.name}</h5>
                  <p className="card-text program_description">
                    {program.description}
                  </p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Points: {program.points}
                    </li>
                    <li className="list-group-item">
                      Total Members: {program.totalMembers}
                    </li>
                  </ul>
                  {isEnrolled(program._id) ? (
                    <button
                      className="btn btn-danger drop_btn"
                      onClick={() => handleDropConfirmation(program._id)}
                    >
                      Drop
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary enroll_btn"
                      onClick={() => handleEnroll(program._id)}
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePrograms;
