import React, { useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaTimes } from "react-icons/fa";

const EmailPreview = ({ subject, message, images, onClose }) => {
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling when modal closes
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-opacity-60 flex mt-[2%] items-center justify-center p-4 z-50">
      {/* Full screen height and scrollable modal */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full relative text-center border-t-4 border-purple-600 
                overflow-y-auto max-h-[75vh] h-auto scrollbar-hide">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition duration-300"
        >
          <FaTimes size={24} />
        </button>

        {/* Header Section */}
        <div className="mt-4">
          <h1 className="text-5xl font-bold text-purple-700 tracking-tight">Welcome Aboard!</h1>
          <p className="text-gray-700 mt-3 text-lg font-medium">
            {subject || "Thank You For Joining Us!"}
          </p>
        </div>

        {/* Message Section */}
        <div
          className="text-gray-600 mt-4 px-6 text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: message || "No message provided." }}
        />

        {/* Image Preview */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          {images && images.length > 0 ? (
            images.map((file, index) => (
              <img
                key={index}
                src={file.preview}
                alt="Preview"
                className="w-72 h-48 object-cover rounded-lg border shadow-sm hover:shadow-md transition duration-300"
              />
            ))
          ) : (
            <p className="text-gray-500 italic">No images attached</p>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-8 mt-4 text-purple-700 text-3xl pb-4">
          <FaFacebook className="hover:text-blue-600 transition duration-300 cursor-pointer" />
          <FaTwitter className="hover:text-blue-400 transition duration-300 cursor-pointer" />
          <FaInstagram className="hover:text-pink-500 transition duration-300 cursor-pointer" />
          <FaWhatsapp className="hover:text-green-500 transition duration-300 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
