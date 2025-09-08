import React, { useState, useCallback } from 'https://aistudiocdn.com/react@^19.1.1';
import { useAppContext } from '../contexts/AppContext.tsx';
import Card from '../components/Card.tsx';
import { ADVICE_KEYS } from '../constants.ts';
import AdSenseAd from '../components/AdSenseAd.tsx';

const Advice: React.FC = () => {
  const { t } = useAppContext();
  const [currentAdviceKey, setCurrentAdviceKey] = useState<string | null>(null);

  const getNewAdvice = useCallback(() => {
    let randomIndex;
    let newKey;
    // Ensure we don't show the same advice twice in a row if possible
    if (ADVICE_KEYS.length > 1) {
      do {
        randomIndex = Math.floor(Math.random() * ADVICE_KEYS.length);
        newKey = ADVICE_KEYS[randomIndex];
      } while (newKey === currentAdviceKey);
    } else {
      newKey = ADVICE_KEYS[0];
    }
    setCurrentAdviceKey(newKey);
  }, [currentAdviceKey]);


  const LightbulbIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('advice')}</h1>

      <Card>
        <div className="flex flex-col items-center text-center p-4 min-h-[150px] justify-center">
          <LightbulbIcon className="h-16 w-16 text-yellow-400 mb-4" />
          <div className="animate-fadeIn">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {currentAdviceKey ? t(currentAdviceKey) : t('advice_initial_prompt')}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="mt-6">
        <button
          onClick={getNewAdvice}
          className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg shadow hover:bg-primary-600 transition-colors flex items-center justify-center"
        >
          <LightbulbIcon className="h-6 w-6 mr-2" />
          {currentAdviceKey ? t('get_new_advice') : t('get_advice')}
        </button>
      </div>

      <AdSenseAd slot="2640416036191095" />
    </div>
  );
};

export default Advice;
