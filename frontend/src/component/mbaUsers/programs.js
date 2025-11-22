import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import no_img from "../../bundles/no-picture.jpeg";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";
const ProgramDetails = ({ id }) => {
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
          `${GetLink()}/program-details/${userIdFromUrl}`
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
      <h4 className="program_details_heading">Program Details</h4>
      {loading && <ContentLoaderCompo></ContentLoaderCompo>}
      {loading === false && programDetails.length === 0 && (
        <div className="p_detail">No Program Enrolled</div>
      )}
      <div className="program_details">
        {programDetails.map((program) => (
          <div key={program.programId} className="p_detail">
            <div className="program_images">
              {/* {program.images.map((img) => (
              <img src={img || no_img} alt={program.name} />
          ))}*/}
              <img
                src={`${GetLink()}/${program.images}` || no_img}
                alt={program.name}
              />
            </div>
            <h4 className="program_name">{program.name}</h4>
            <p style={{ padding: "5px 7px 0 7px", color: "#979595" }}>
              Program Details: {program.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramDetails;
