import React, { useState } from 'https://aistudiocdn.com/react@^19.1.1';
import { useAppContext } from '../contexts/AppContext.tsx';
import { COUNTRIES } from '../constants.ts';

interface WelcomeModalProps {
    onComplete: (country: string) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onComplete }) => {
    const { t } = useAppContext();
    const [selectedCountry, setSelectedCountry] = useState('MA');

    const handleConfirm = () => {
        onComplete(selectedCountry);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
                <h2 className="text-xl font-bold text-center">{t('welcome_to_tricinty')}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center">{t('please_confirm_country')}</p>
                
                <div className="space-y-3">
                    <label htmlFor="country-select" className="sr-only">{t('country')}</label>
                    <select 
                        id="country-select"
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{t(c.nameKey)}</option>
                        ))}
                    </select>
                    {selectedCountry === 'MA' ? (
                         <p className="text-center text-sm text-gray-500 dark:text-gray-400 p-2 bg-green-50 dark:bg-green-900/50 rounded-md">
                            {t('welcome_morocco_note')}
                         </p>
                    ) : (
                         <p className="text-center text-sm text-gray-500 dark:text-gray-400 p-2 bg-blue-50 dark:bg-blue-900/50 rounded-md">
                            {t('welcome_other_country_note')}
                         </p>
                    )}
                </div>

                <button
                    onClick={handleConfirm}
                    className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg shadow hover:bg-primary-600 transition-colors"
                >
                    {t('get_started')}
                </button>
            </div>
        </div>
    );
};

export default WelcomeModal;