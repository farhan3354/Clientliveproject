import React, { useState, useEffect } from "react";
import "./css/posttemp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentLoaderCompo from "../contentloader";
import GetLink from "../apiLink";

export default function PostTemp(userId) {
  const [templates, setTemplates] = useState([]);
  const [dynamicInputs, setDynamicInputs] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(GetLink() + "/api/getAllTemplates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const updateDynamicInputs = (templateText) => {
    const dynamicInputsArray = templateText.match(/{[^{}]+}/g) || [];
    const inputs = {};
    dynamicInputsArray.forEach((input) => {
      inputs[input] = "";
    });
    return inputs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDynamicInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleCopy = (templateText, link) => {
    const copiedText = Object.entries(dynamicInputs).reduce(
      (text, [placeholder, value]) => text.replaceAll(placeholder, value),
      templateText + `\n\n${GetLink()}/${link}`
    );

    const textarea = document.createElement("textarea");
    textarea.value = copiedText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    console.log("Copied:", copiedText);
    toast("Template Copied to Clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "color_green",
    });
  };

  if (loading) {
    return (
      <div className="main-content">
        <ContentLoaderCompo></ContentLoaderCompo>
      </div>
    );
  }
  return (
    <div className="main-content">
      <ToastContainer></ToastContainer>
      <div className="card card2">
        <h2>Available Templates</h2>
        {templates.map((template, index) => (
          <div key={template.id} className="template-item">
            {Object.entries(updateDynamicInputs(template.templateText)).map(
              ([input]) => (
                <input
                  key={input}
                  type="text"
                  name={input}
                  placeholder={input}
                  value={dynamicInputs[input]}
                  onChange={handleInputChange}
                  className="dynamic-input"
                />
              )
            )}
            <p style={{ whiteSpace: "pre-wrap" }}>
              {Object.entries(dynamicInputs).reduce(
                (text, [placeholder, value]) =>
                  text.replaceAll(placeholder, value),
                template.templateText
              )}
              <br></br>
              <br></br>
              {GetLink() + "/" + template.programLink}
            </p>
            <button
              className="button-cln"
              onClick={() =>
                handleCopy(template.templateText, template.programLink)
              }
            >
              Copy to Clipboard
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
