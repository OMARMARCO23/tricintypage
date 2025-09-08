import React from 'https://aistudiocdn.com/react@^19.1.1';
import { NavLink } from 'https://aistudiocdn.com/react-router-dom@^6.23.1';
import { useAppContext } from '../contexts/AppContext.js';

const HomeIcon = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-6 w-6",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
}));

const HistoryIcon = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-6 w-6",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
}));

const AdviceIcon = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-6 w-6",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
}));

const SettingsIcon = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-6 w-6",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
}), /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
}));

const NavItem = ({ to, icon, label }) => {
  const activeClass = "text-primary-500";
  const inactiveClass = "text-gray-500 dark:text-gray-400";
  return /*#__PURE__*/React.createElement(NavLink, {
    to: to,
    className: ({ isActive }) => `${isActive ? activeClass : inactiveClass} flex flex-col items-center justify-center w-full`
  }, icon, /*#__PURE__*/React.createElement("span", {
    className: "text-xs"
  }, label));
};

const BottomNav = () => {
    const { t } = useAppContext();
    const navItems = [
        { to: "/", icon: /*#__PURE__*/React.createElement(HomeIcon, null), label: t('dashboard') },
        { to: "/history", icon: /*#__PURE__*/React.createElement(HistoryIcon, null), label: t('history') },
        { to: "/advice", icon: /*#__PURE__*/React.createElement(AdviceIcon, null), label: t('advice') },
        { to: "/settings", icon: /*#__PURE__*/React.createElement(SettingsIcon, null), label: t('settings') },
    ];

  return /*#__PURE__*/React.createElement("nav", {
    className: "fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex shadow-lg"
  }, navItems.map(item => /*#__PURE__*/React.createElement(NavItem, {
    key: item.to,
    ...item
  })));
};

export default BottomNav;