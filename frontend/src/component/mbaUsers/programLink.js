import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import no_img from "../../bundles/no-picture.jpeg";
import GetLink from "../apiLink";
import ContentLoaderCompo from "../contentloader";
const ProgramLink = ({ id }) => {
  const [programDetails, setProgramDetails] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (link) => {
    const textarea = document.createElement("textarea");
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    toast("Program Link Copied to Clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "color_green",
    });
  };

  useEffect(() => {
    const userIdFromUrl = id;
    setUserId(userIdFromUrl);

    // Fetch program details from backend API
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch(
          `${GetLink()}/program-link/${userIdFromUrl}`
        );
        if (response.ok) {
          const data = await response.json();

          setProgramDetails(data);
          setLoading(false);
        } else {
          console.error("Error fetching program details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };

    fetchProgramDetails();
  }, [userId]);

  return (
    <div className="main-content">
      <ToastContainer />
      <h4 className="program_details_heading">Program Link</h4>
      {loading && <ContentLoaderCompo></ContentLoaderCompo>}
      {loading === false && programDetails.length === 0 && (
        <div className="p_detail">No Program Enrolled</div>
      )}
      <div className="program_details">
        {programDetails.map((program) => (
          <div key={program.programId} className="p_detail">
            <h4 className="program_name" style={{ padding: "10px 8px 0 8px" }}>
              {program.name}
            </h4>

            <p className="program_link" style={{ padding: "10px 8px 0 8px" }}>
              <span style={{ width: "95%" }}>
                {GetLink()}/{program.programLink}
              </span>{" "}
              <span
                className="copy_link"
                onClick={() =>
                  copyToClipboard(GetLink() + "/" + program.programLink)
                }
              >
                {" "}
                <i class="fi fi-sr-copy-alt"></i>
              </span>
            </p>
            <div
              className="proints_clicks"
              style={{ padding: "3px 5px 8px 5px", margin: "5px 0px" }}
            >
              <p>
                You will earn <span>{program.programPoints}</span> Points when
                someone clicks on this link
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramLink;
