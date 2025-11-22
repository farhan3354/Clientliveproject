import React, { useState, useEffect } from "react";
import "./css/PostTemp.css"; // Import your CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetLink from "../apiLink";

export default function PostTemp() {
  const [templateText, setTemplateText] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [templates, setTemplates] = useState([]); // State for existing templates

  const example =
    "This was an incredible experience with {brand}, where the placeholder {brand} acts as a dynamic field. Users can personalize this field by adding the brand name themselves.";

  useEffect(() => {
    fetchPrograms();
    fetchTemplates(); // Fetch existing templates when the component mounts
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(GetLink() + "/getAllProgramsId");
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(GetLink() + "/api/getAllTemplatesforadmin");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleTemplateChange = (e) => {
    setTemplateText(e.target.value);
  };

  const handleProgramChange = (e) => {
    setSelectedProgramId(e.target.value);
  };

  const addPost = async () => {
    if (selectedProgramId === "") {
      toast.error("Select a program");
      return;
    }
    if (templateText === "") {
      toast.error("Fill the template text");
      return;
    }

    setButtonDisable(true);
    try {
      const response = await fetch(GetLink() + "/api/addTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateText: templateText,
          programId: selectedProgramId,
        }),
      });

      if (response.ok) {
        toast.success("Template added successfully");
        setTemplateText("");
        setSelectedProgramId("");
        setButtonDisable(false);
        fetchTemplates(); // Fetch templates again after adding
      } else {
        toast.error("Network error, refresh and try again");
      }
    } catch (error) {
      console.error("Error adding template:", error);
    }
  };

  const deleteTemplate = async (templateId) => {
    console.log(templateId);
    setButtonDisable(true);
    try {
      const response = await fetch(
        `${GetLink()}/api/deleteTemp/${templateId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Template deleted successfully");
        setButtonDisable(false);
        fetchTemplates(); // Fetch templates again after deleting
      } else {
        toast.error("Network error, refresh and try again");
        setButtonDisable(false);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      setButtonDisable(false);
    }
  };

  return (
    <div className="main-content">
      <ToastContainer></ToastContainer>
      <div className="card card2">
        <h2>Create Post Template</h2>
        <select
          className="program-dropdown"
          value={selectedProgramId}
          onChange={handleProgramChange}
        >
          <option value="">Select a program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
        <textarea
          rows="17"
          cols="50"
          className="template-textarea"
          placeholder="Enter your post template here..."
          value={templateText}
          onChange={handleTemplateChange}
        ></textarea>
        <button
          className={`add-button ${buttonDisable ? "disabled" : ""}`}
          onClick={addPost}
          disabled={buttonDisable}
        >
          {buttonDisable ? "Adding" : "Add"}
        </button>
        {example && (
          <div className="example-post">
            <strong>Example Post:</strong>
            <p>{example}</p>
          </div>
        )}

        {/* Display existing templates and provide delete button */}
        <div className="existing-templates">
          <h3 className="template-heading">Existing Templates</h3>
          <ul className="template-list">
            {templates.map((template) => (
              <li
                key={template.id}
                className="template-item"
                style={{ whiteSpace: "pre-line" }}
              >
                {template.templateText}
                <button
                  className={`delete-button ${buttonDisable ? "disabled" : ""}`}
                  onClick={() => deleteTemplate(template.id)}
                  disabled={buttonDisable}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
