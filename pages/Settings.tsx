import React, { useState } from 'https://aistudiocdn.com/react@^19.1.1';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Language, Tariff } from '../types.ts';
import Card from '../components/Card.tsx';
import { COUNTRIES, TARIFF_DATA, Provider } from '../constants.ts';
import AdSenseAd from '../components/AdSenseAd.tsx';

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const Settings: React.FC = () => {
  const { settings, setSettings, setTheme, setLanguage, setCurrency, setCountry, t } = useAppContext();

  const handleTariffChange = (index: number, field: keyof Tariff, value: string) => {
    const newTariffs = [...settings.tariffs];
    const numValue = field === 'upTo' && value === '' ? Infinity : parseFloat(value);
    
    if (field === 'rate' && value === '') {
        newTariffs[index] = { ...newTariffs[index], [field]: 0 };
    } else if (!isNaN(numValue)) {
      newTariffs[index] = { ...newTariffs[index], [field]: numValue };
    }
    setSettings({ ...settings, tariffs: newTariffs });
  };
  
  const addTier = () => {
      const newTariffs = [...settings.tariffs, { upTo: Infinity, rate: 0}];
      setSettings({...settings, tariffs: newTariffs});
  }
  
  const removeTier = (index: number) => {
      const newTariffs = settings.tariffs.filter((_, i) => i !== index);
      setSettings({...settings, tariffs: newTariffs});
  }

  const handleProviderChange = (providerName: string) => {
      if (providerName === '_manual') {
          setSettings({
              ...settings,
              provider: '_manual',
              tariffs: [],
              currency: '',
          });
      } else {
          const providersForCountry = TARIFF_DATA[settings.country] || [];
          const providerData = providersForCountry.find(p => p.name === providerName);
          if (providerData) {
              setSettings({
                  ...settings,
                  provider: providerData.name,
                  tariffs: providerData.tariffs,
                  currency: providerData.currency,
              });
          }
      }
  };

  const isMorocco = settings.country === 'MA';
  const availableProviders = TARIFF_DATA[settings.country] || [];
  const showManualTariffs = !isMorocco && (availableProviders.length === 0 || settings.provider === '_manual');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('settings')}</h1>

      {/* Appearance */}
      <Card>
        <h2 className="text-lg font-semibold mb-2">{t('appearance')}</h2>
        <div className="flex gap-2 rounded-lg p-1 bg-gray-200 dark:bg-gray-700">
          <button onClick={() => setTheme('light')} className={`w-full py-2 rounded ${settings.theme === 'light' ? 'bg-white dark:bg-gray-500' : ''}`}>{t('light')}</button>
          <button onClick={() => setTheme('dark')} className={`w-full py-2 rounded ${settings.theme === 'dark' ? 'bg-white dark:bg-gray-500' : ''}`}>{t('dark')}</button>
        </div>
      </Card>
      
      {/* Language */}
      <Card>
        <h2 className="text-lg font-semibold mb-2">{t('language')}</h2>
        <select value={settings.language} onChange={(e) => setLanguage(e.target.value as Language)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
        </select>
      </Card>
      
      {/* Location Settings */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">{t('country')} &amp; {t('provider')}</h2>
        
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('country')}</label>
                <select value={settings.country} onChange={(e) => setCountry(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                    {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{t(c.nameKey)}</option>
                    ))}
                </select>
            </div>

            {!isMorocco && availableProviders.length > 0 && (
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('provider')}</label>
                    <select value={settings.provider} onChange={(e) => handleProviderChange(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value="" disabled>{t('select_provider')}</option>
                        {availableProviders.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                        <option value="_manual">{t('other_manual')}</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('provider_select_note')}</p>
                </div>
            )}
        </div>
      </Card>

      {/* Monthly Goal */}
      <Card>
        <h2 className="text-lg font-semibold mb-2">{t('monthly_goal')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('set_monthly_goal_description')}</p>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={settings.monthlyGoal || ''}
            onChange={(e) => setSettings({ ...settings, monthlyGoal: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">{settings.currency}</span>
        </div>
      </Card>

      {/* Tariffs */}
      <Card>
        <h2 className="text-lg font-semibold mb-2">{t('electricity_tariffs')}</h2>
        
        {isMorocco && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">{t('tariffs_morocco_note')}</p>
        )}
        
        <div className="flex gap-4 items-center mb-4">
            <label className="text-sm font-medium">{t('currency')}:</label>
            <input
                type="text"
                value={settings.currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder={t('currency_symbol_placeholder')}
                className="w-24 px-3 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800"
                disabled={!showManualTariffs}
              />
        </div>
        
        <div className="space-y-2">
          {settings.tariffs.map((tariff, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-xs">{t('up_to_kwh')}</label>
                <input
                  type="number"
                  value={tariff.upTo === Infinity ? '' : tariff.upTo}
                  onChange={(e) => handleTariffChange(index, 'upTo', e.target.value)}
                  placeholder="&#8734;"
                  className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800"
                  disabled={!showManualTariffs}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs">{t('rate_per_kwh').replace('{currency}', settings.currency)}</label>
                <input
                  type="number"
                  step="0.0001"
                  value={tariff.rate}
                  onChange={(e) => handleTariffChange(index, 'rate', e.target.value)}
                  className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800"
                  disabled={!showManualTariffs}
                />
              </div>
              {showManualTariffs && (
                <button onClick={() => removeTier(index)} className="mt-4 text-red-500 h-8 w-8 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900">&times;</button>
              )}
            </div>
          ))}
        </div>
        {showManualTariffs && (
            <button onClick={addTier} className="mt-4 w-full text-center py-2 px-4 border-2 border-dashed border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors">
                {t('add_tier')}
            </button>
        )}
      </Card>
      
      {/* AdSense Ad */}
      <AdSenseAd slot="5199804750" />
      
      {/* About */}
      <Card>
          <h2 className="text-lg font-semibold mb-2">{t('about')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('about_text')}</p>
           <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-2 bg-primary-50 dark:bg-primary-900/50 rounded-lg">{t('install_pwa_prompt')}</p>
      </Card>

      {/* Privacy Policy */}
       <Card>
        <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">{t('privacy_policy')}</span>
                <span className="transition group-open:rotate-180">
                    <ChevronDownIcon />
                </span>
            </summary>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-open:animate-fadeIn">
              {t('privacy_policy_content')}
            </p>
        </details>
      </Card>

      {/* Disclaimer */}
      <Card>
        <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">{t('disclaimer')}</span>
                <span className="transition group-open:rotate-180">
                    <ChevronDownIcon />
                </span>
            </summary>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-open:animate-fadeIn">
              {t('disclaimer_content')}
            </p>
        </details>
      </Card>

      {/* Exit App */}
      <Card>
        <button
            onClick={() => window.close()}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
        >
            {t('exit_app')}
        </button>
      </Card>
    </div>
  );
};

export default Settings;
