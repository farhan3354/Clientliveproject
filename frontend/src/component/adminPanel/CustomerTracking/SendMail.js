import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEnvelope, FaPaperPlane, FaImage, FaEye, FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import JoditEditor from "jodit-react";
import EmailPreview from "./EmailPreview";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Call this inside your component to enable toast notifications

const EmailComposer = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(false);
  const editor = useRef(null);
  
  // toast.configure();

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = () => {
    axios
      .get("http://localhost:3002/api/customers")
      .then((response) => {
        const users = response.data?.data || [];
  
        // Extract emails from each user object
        const extractedEmails = users.flatMap((user) => {
          try {
            return JSON.parse(user.emails || "[]"); // Ensure parsing if emails are stored as JSON
          } catch (error) {
            console.error("Error parsing emails:", error);
            return [];
          }
        });
  
        setEmails(extractedEmails);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
        setEmails([]);
      });
  };
  

  const toggleEmailSelection = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const sendEmail = async () => {
    if (selectedEmails.length === 0) {
      toast.warn("Please select at least one recipient.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    const emailData = {
      recipients: selectedEmails, // Array of selected emails
      subject,
      message,
      images: images.map((file) => file.preview), // Convert images to URLs if needed
    };
  
    try {
      const response = await axios.post("http://localhost:3002/api/send-email", emailData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.success) {
        toast.success(`Email successfully sent to: ${selectedEmails.join(", ")}`, {
          position: "top-right",
          autoClose: 3000,
        });
  
        setSelectedEmails([]); // Clear selection after sending
        setSubject("");
        setMessage("");
        setImages([]);
      } else {
        toast.error("Failed to send the email. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending the email.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    maxFiles: 2,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length + images.length > 2) {
        alert("Only two images are allowed.");
        return;
      }
      setImages([
        ...images,
        ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
      ]);
    },
  });

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      className="main-content section mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow min-h-0">
        <div className="p-6 border rounded-lg bg-gray-100 shadow-md md:col-span-1 flex flex-col flex-grow min-h-0">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <FaEnvelope /> Select Recipients
          </h2>
          {emails.length === 0 ? (
            <p className="text-gray-900">Loading emails...</p>
          ) : (
            <div className="flex-grow overflow-auto border rounded-lg p-2 bg-white mt-2 min-h-20 max-h-[60vh]">
              {emails.map((email) => (
                <div key={email} className="flex items-center space-x-2 mb-2 text-gray-900 mt-2">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email)}
                    onChange={() => toggleEmailSelection(email)}
                    className="cursor-pointer"
                  />
                  <label className="text-black mt-1 bg-gray-50 px-3 py-1 rounded-lg shadow-md w-full cursor-pointer">
                    {email}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border rounded-lg bg-gray-100 shadow-md md:col-span-2 flex flex-col flex-grow min-h-0">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <FaEnvelope /> Compose Email
          </h2>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4 text-gray-900"
          />

          {/* Jodit Editor for Message Field */}
          <JoditEditor
            ref={editor}
            value={message}
            onChange={(content) => setMessage(content)}
            className="text-gray-900"
          />

          <div
            {...getRootProps()}
            className="border-2 border-dashed bg-white p-4 text-center cursor-pointer rounded-lg mt-4"
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <FaImage /> Drag & drop or click to upload (Max: 2 images)
            </p>
          </div>

          {/* Image Previews with Remove Option */}
          <div className="flex gap-4 mt-4">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border shadow-md"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setPreview(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
            >
              <FaEye /> Preview
            </button>
            <button
              onClick={sendEmail}
              disabled={selectedEmails.length === 0}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              <FaPaperPlane /> Send Email
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <EmailPreview
          subject={subject}
          message={message}
          images={images}
          onClose={() => setPreview(false)}
        />
      )}
    </motion.div>
  );
};

export default EmailComposer;
