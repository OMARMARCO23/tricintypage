import React from 'https://aistudiocdn.com/react@^19.1.1';

const Card = ({ children, className = '' }) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`
  }, children);
};

export default Card;