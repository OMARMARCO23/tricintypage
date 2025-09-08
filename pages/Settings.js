import React from 'https://aistudiocdn.com/react@^19.1.1';
import { useAppContext } from '../contexts/AppContext.js';
import Card from '../components/Card.js';
import { COUNTRIES, TARIFF_DATA } from '../constants.js';
import AdSenseAd from '../components/AdSenseAd.js';

const ChevronDownIcon = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  fillRule: "evenodd",
  d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
  clipRule: "evenodd"
}));

const Settings = () => {
  const { settings, setSettings, setTheme, setLanguage, setCurrency, setCountry, t } = useAppContext();

  const handleTariffChange = (index, field, value) => {
    const newTariffs = [...settings.tariffs];
    const numValue = field === 'upTo' && value === '' ? Infinity : parseFloat(value);

    if (field === 'rate' && value === '') {
      newTariffs[index] = { ...newTariffs[index],
        [field]: 0
      };
    } else if (!isNaN(numValue)) {
      newTariffs[index] = { ...newTariffs[index],
        [field]: numValue
      };
    }
    setSettings({ ...settings,
      tariffs: newTariffs
    });
  };

  const addTier = () => {
    const newTariffs = [...settings.tariffs, { upTo: Infinity, rate: 0 }];
    setSettings({ ...settings,
      tariffs: newTariffs
    });
  };

  const removeTier = index => {
    const newTariffs = settings.tariffs.filter((_, i) => i !== index);
    setSettings({ ...settings,
      tariffs: newTariffs
    });
  };

  const handleProviderChange = providerName => {
    if (providerName === '_manual') {
      setSettings({ ...settings,
        provider: '_manual',
        tariffs: [],
        currency: ''
      });
    } else {
      const providersForCountry = TARIFF_DATA[settings.country] || [];
      const providerData = providersForCountry.find(p => p.name === providerName);
      if (providerData) {
        setSettings({ ...settings,
          provider: providerData.name,
          tariffs: providerData.tariffs,
          currency: providerData.currency
        });
      }
    }
  };

  const isMorocco = settings.country === 'MA';
  const availableProviders = TARIFF_DATA[settings.country] || [];
  const showManualTariffs = !isMorocco && (availableProviders.length === 0 || settings.provider === '_manual');

  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold"
  }, t('settings')), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-2"
  }, t('appearance')), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 rounded-lg p-1 bg-gray-200 dark:bg-gray-700"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme('light'),
    className: `w-full py-2 rounded ${settings.theme === 'light' ? 'bg-white dark:bg-gray-500' : ''}`
  }, t('light')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme('dark'),
    className: `w-full py-2 rounded ${settings.theme === 'dark' ? 'bg-white dark:bg-gray-500' : ''}`
  }, t('dark')))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-2"
  }, t('language')), /*#__PURE__*/React.createElement("select", {
    value: settings.language,
    onChange: e => setLanguage(e.target.value),
    className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
  }, /*#__PURE__*/React.createElement("option", {
    value: "en"
  }, "English"), /*#__PURE__*/React.createElement("option", {
    value: "fr"
  }, "Français"), /*#__PURE__*/React.createElement("option", {
    value: "ar"
  }, "العربية"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-4"
  }, t('country'), " & ", t('provider')), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium text-gray-700 dark:text-gray-300"
  }, t('country')), /*#__PURE__*/React.createElement("select", {
    value: settings.country,
    onChange: e => setCountry(e.target.value),
    className: "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
  }, COUNTRIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.code,
    value: c.code
  }, t(c.nameKey))))), !isMorocco && availableProviders.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium text-gray-700 dark:text-gray-300"
  }, t('provider')), /*#__PURE__*/React.createElement("select", {
    value: settings.provider,
    onChange: e => handleProviderChange(e.target.value),
    className: "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, t('select_provider')), availableProviders.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.name,
    value: p.name
  }, p.name)), /*#__PURE__*/React.createElement("option", {
    value: "_manual"
  }, t('other_manual'))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 dark:text-gray-400 mt-2"
  }, t('provider_select_note'))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-2"
  }, t('monthly_goal')), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mb-2"
  }, t('set_monthly_goal_description')), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: settings.monthlyGoal || '',
    onChange: e => setSettings({ ...settings,
      monthlyGoal: parseFloat(e.target.value) || 0
    }),
    placeholder: "0",
    className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500"
  }, settings.currency))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-2"
  }, t('electricity_tariffs')), isMorocco && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mb-4 p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg"
  }, t('tariffs_morocco_note')), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 items-center mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, t('currency'), ":"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.currency,
    onChange: e => setCurrency(e.target.value),
    placeholder: t('currency_symbol_placeholder'),
    className: "w-24 px-3 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800",
    disabled: !showManualTariffs
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, settings.tariffs.map((tariff, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "flex gap-2 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs"
  }, t('up_to_kwh')), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: tariff.upTo === Infinity ? '' : tariff.upTo,
    onChange: e => handleTariffChange(index, 'upTo', e.target.value),
    placeholder: "∞",
    className: "w-full px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800",
    disabled: !showManualTariffs
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs"
  }, t('rate_per_kwh').replace('{currency}', settings.currency)), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.0001",
    value: tariff.rate,
    onChange: e => handleTariffChange(index, 'rate', e.target.value),
    className: "w-full px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800",
    disabled: !showManualTariffs
  })), showManualTariffs && /*#__PURE__*/React.createElement("button", {
    onClick: () => removeTier(index),
    className: "mt-4 text-red-500 h-8 w-8 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900"
  }, "×")))), showManualTariffs && /*#__PURE__*/React.createElement("button", {
    onClick: addTier,
    className: "mt-4 w-full text-center py-2 px-4 border-2 border-dashed border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors"
  }, t('add_tier'))), /*#__PURE__*/React.createElement(AdSenseAd, {
    slot: "1234567890"
  }), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold mb-2"
  }, t('about')), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400"
  }, t('about_text')), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mt-2 p-2 bg-primary-50 dark:bg-primary-900/50 rounded-lg"
  }, t('install_pwa_prompt'))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("details", {
    className: "group"
  }, /*#__PURE__*/React.createElement("summary", {
    className: "flex justify-between items-center font-medium cursor-pointer list-none"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-semibold"
  }, t('privacy_policy')), /*#__PURE__*/React.createElement("span", {
    className: "transition group-open:rotate-180"
  }, /*#__PURE__*/React.createElement(ChevronDownIcon, null))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mt-2 group-open:animate-fadeIn"
  }, t('privacy_policy_content')))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("details", {
    className: "group"
  }, /*#__PURE__*/React.createElement("summary", {
    className: "flex justify-between items-center font-medium cursor-pointer list-none"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-semibold"
  }, t('disclaimer')), /*#__PURE__*/React.createElement("span", {
    className: "transition group-open:rotate-180"
  }, /*#__PURE__*/React.createElement(ChevronDownIcon, null))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mt-2 group-open:animate-fadeIn"
  }, t('disclaimer_content')))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.close(),
    className: "w-full py-3 px-4 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
  }, t('exit_app'))));
};

export default Settings;