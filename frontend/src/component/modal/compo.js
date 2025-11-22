import React from "react";
import Modal from "react-modal";

// Set the root element for the modal
Modal.setAppElement("#root");

const modalStyle = {
  content: {
    width: "1050px",
    height: "600px",
    margin: "60px 280px",
  },
};

const CustomModal = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyle}>
      {children}
    </Modal>
  );
};

export default CustomModal;
