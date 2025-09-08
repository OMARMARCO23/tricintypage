import React from 'https://aistudiocdn.com/react@^19.1.1';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, children)));
};

export default Modal;