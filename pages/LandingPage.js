import React, { useState, useEffect } from 'https://aistudiocdn.com/react@^19.1.1';
import { useAppContext } from '../contexts/AppContext.js';
import Card from '../components/Card.js';

const TrackingIcon = () => /*#__PURE__*/React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 mb-2 text-primary-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /*#__PURE__*/React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }));
const PredictionIcon = () => /*#__PURE__*/React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 mb-2 text-primary-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /*#__PURE__*/React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }));
const SavingsIcon = () => /*#__PURE__*/React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 mb-2 text-primary-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /*#__PURE__*/React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }));
const InstallIcon = () => /*#__PURE__*/React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, /*#__PURE__*/React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }));
const ThreeDotsIcon = () => /*#__PURE__*/React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 inline-block mx-1", viewBox: "0 0 20 20", fill: "currentColor" }, /*#__PURE__*/React.createElement("path", { d: "M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" }));
const ShareIOSIcon = () => /*#__PURE__*/React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 inline-block mx-1", viewBox: "0 0 20 20", fill: "currentColor" }, /*#__PURE__*/React.createElement("path", { d: "M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" }));

const LandingPage = ({ onEnter }) => {
  const { t } = useAppContext();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const showInstallButton = !!deferredPrompt;

  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gray-50 dark:bg-gray-900 animate-fadeIn"
  }, /*#__PURE__*/React.createElement("main", {
    className: "container mx-auto p-4 md:p-8 text-center"
  }, /*#__PURE__*/React.createElement("header", {
    className: "py-12"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./icon-192x192.png",
    alt: "TRICINTY Logo",
    className: "w-24 h-24 mx-auto mb-4"
  }), /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl md:text-5xl font-bold text-gray-800 dark:text-white"
  }, t('landing_title')), /*#__PURE__*/React.createElement("p", {
    className: "mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
  }, t('landing_subtitle')), /*#__PURE__*/React.createElement("button", {
    onClick: onEnter,
    className: "mt-8 px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors"
  }, t('launch_app'))), /*#__PURE__*/React.createElement("section", {
    id: "features",
    className: "py-12"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-bold mb-8"
  }, t('features_title')), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow"
  }, /*#__PURE__*/React.createElement(TrackingIcon, null), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-semibold mb-2"
  }, t('feature_track_title')), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 dark:text-gray-400"
  }, t('feature_track_text'))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow"
  }, /*#__PURE__*/React.createElement(PredictionIcon, null), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-semibold mb-2"
  }, t('feature_predict_title')), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 dark:text-gray-400"
  }, t('feature_predict_text'))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow"
  }, /*#__PURE__*/React.createElement(SavingsIcon, null), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-semibold mb-2"
  }, t('feature_advice_title')), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 dark:text-gray-400"
  }, t('feature_advice_text'))))), /*#__PURE__*/React.createElement("section", {
    id: "install",
    className: "py-12"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "max-w-2xl mx-auto bg-primary-50 dark:bg-primary-900/50"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold mb-2"
  }, t('install_pwa_title')), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 dark:text-gray-400 mb-6"
  }, t('install_pwa_text')), showInstallButton && /*#__PURE__*/React.createElement("button", {
    onClick: handleInstallClick,
    className: "w-full max-w-sm mx-auto mb-4 py-3 px-4 bg-primary-500 text-white rounded-lg shadow hover:bg-primary-600 transition-colors flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(InstallIcon, null), t('install_app')), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-500 dark:text-gray-300 space-y-2"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, t('install_android_title'), ":"), " ", t('install_android_steps')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, t('install_ios_title'), ":"), " ", t('install_ios_steps')))))), /*#__PURE__*/React.createElement("footer", {
    className: "text-center p-4 text-sm text-gray-500 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement("p", null, "© ", new Date().getFullYear(), " TRICINTY. All rights reserved.")));
};

export default LandingPage;
