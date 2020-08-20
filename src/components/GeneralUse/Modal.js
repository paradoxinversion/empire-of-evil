import React from "react";
import ReactDOM from "react-dom";

const Modal = props => {
  const modalStructure = (
    <div
      id="ismodal"
      className="fixed top-0 left-0 bg-gray-600 h-screen w-screen flex justify-center items-center"
    >
      {props.children}
    </div>
  );
  return ReactDOM.createPortal(
    modalStructure,
    document.getElementById("modal")
  );
};

export default Modal;
