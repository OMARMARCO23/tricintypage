import React from 'https://aistudiocdn.com/react@^19.1.1';
import BottomNav from './BottomNav.js';

const Layout = ({ children }) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement("main", {
    className: "flex-grow container mx-auto p-4 pb-20"
  }, children), /*#__PURE__*/React.createElement(BottomNav, null));
};

export default Layout;