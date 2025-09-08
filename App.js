import React from 'https://aistudiocdn.com/react@^19.1.1';
import { HashRouter, Route, Routes } from 'https://aistudiocdn.com/react-router-dom@^6.23.1';
import { AppProvider } from './contexts/AppContext.js';
import Layout from './components/Layout.js';
import Dashboard from './pages/Dashboard.js';
import History from './pages/History.js';
import Settings from './pages/Settings.js';
import Advice from './pages/Advice.js';
import LandingPage from './pages/LandingPage.js';
import useLocalStorage from './hooks/useLocalStorage.js';

const AppContent = () => {
  const [hasVisited, setHasVisited] = useLocalStorage('tricinty-has-visited-landing', false);

  if (!hasVisited) {
    return /*#__PURE__*/React.createElement(LandingPage, { onEnter: () => setHasVisited(true) });
  }

  return /*#__PURE__*/React.createElement(HashRouter, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
    path: "/",
    element: /*#__PURE__*/React.createElement(Dashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/history",
    element: /*#__PURE__*/React.createElement(History, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/advice",
    element: /*#__PURE__*/React.createElement(Advice, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/settings",
    element: /*#__PURE__*/React.createElement(Settings, null)
  }))));
};

function App() {
  return /*#__PURE__*/React.createElement(AppProvider, null, /*#__PURE__*/React.createElement(AppContent, null));
}

export default App;
