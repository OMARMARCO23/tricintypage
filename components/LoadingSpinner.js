import React from 'https://aistudiocdn.com/react@^19.1.1';

const LoadingSpinner = ({ className = 'w-8 h-8' }) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `animate-spin rounded-full border-4 border-t-primary-500 border-gray-200 dark:border-gray-600 ${className}`
  });
};

export default LoadingSpinner;