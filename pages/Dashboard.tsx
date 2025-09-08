import React, { useState, useMemo } from 'https://aistudiocdn.com/react@^19.1.1';
import { useAppContext } from '../contexts/AppContext.tsx';
import Card from '../components/Card.tsx';
import Modal from '../components/Modal.tsx';
import { getMonthStats, calculateUsage, getConsumptionAlerts } from '../utils/calculations.ts';
import { Reading } from '../types.ts';
import AdSenseAd from '../components/AdSenseAd.tsx';

const ReadingForm: React.FC<{ onSave: (value: number, date: string) => void; onCancel: () => void; initialReading?: Reading | null; readings: Reading[] }> = ({ onSave, onCancel, initialReading, readings }) => {
  const { t } = useAppContext();
  
  // Helper to get local date string in YYYY-MM-DDTHH:mm format for the input
  const getLocalISOString = (isoDateString?: string): string => {
    const date = isoDateString ? new Date(isoDateString) : new Date();
    // Adjust for timezone offset to get the local time in ISO format, then slice to fit the input.
    const tzOffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    const localDate = new Date(date.getTime() - tzOffset);
    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const [value, setValue] = useState(initialReading?.value.toString() || '');
  const [date, setDate] = useState(getLocalISOString(initialReading?.date));
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newReadingValue = parseFloat(value);

    if (isNaN(newReadingValue) || newReadingValue < 0) {
      setError("Please enter a valid positive number for the reading.");
      return;
    }
    
    // The 'date' string is in "YYYY-MM-DDTHH:mm" format.
    // To avoid browser inconsistencies, manually construct the date to ensure it's treated as local time.
    const [datePart, timePart] = date.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    const newReadingDate = new Date(year, month - 1, day, hours, minutes);
    const newReadingTimestamp = newReadingDate.getTime();
    
    // Exclude the current reading if we are in edit mode
    const otherReadings = initialReading ? readings.filter(r => r.id !== initialReading.id) : readings;

    // `readings` from context are sorted. Find the chronological position of the new/edited reading.
    const nextReadingIndex = otherReadings.findIndex(r => new Date(r.date).getTime() > newReadingTimestamp);

    let prevReading = null;
    if (nextReadingIndex === -1) {
        // New reading is the latest one, so the previous is the last in the array.
        if (otherReadings.length > 0) {
            prevReading = otherReadings[otherReadings.length - 1];
        }
    } else if (nextReadingIndex > 0) {
        // The new reading is not the first, so there's a previous one.
        prevReading = otherReadings[nextReadingIndex - 1];
    }
    // If nextReadingIndex is 0, prevReading remains null, which is correct.

    const nextReading = nextReadingIndex === -1 ? null : otherReadings[nextReadingIndex];
    
    // Validate against the immediately preceding reading.
    if (prevReading && newReadingValue < prevReading.value) {
        setError(`Reading value cannot be lower than the previous reading on ${new Date(prevReading.date).toLocaleDateString()}.`);
        return;
    }

    // Validate against the immediately succeeding reading.
    if (nextReading && newReadingValue > nextReading.value) {
        setError(`Reading value cannot be higher than the next reading on ${new Date(nextReading.date).toLocaleDateString()}.`);
        return;
    }
    
    onSave(newReadingValue, newReadingDate.toISOString());
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-300" role="alert">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="reading-value">{t('meter_reading_kwh')}</label>
        <input
          type="number"
          id="reading-value"
          step="0.1"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="reading-date">{t('date')}</label>
        <input
          type="datetime-local"
          id="reading-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('cancel')}</button>
        <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md">{t('save')}</button>
      </div>
    </form>
  );
};

const AlertIcon: React.FC<{ type: 'peak' | 'reduction' }> = ({ type }) => {
    if (type === 'peak') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        );
    }
    return (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
};


const Dashboard: React.FC = () => {
  const { readings, addReading, settings, t } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => getMonthStats(readings, settings.tariffs), [readings, settings.tariffs]);
  const recentReadings = useMemo(() => [...readings].reverse().slice(0, 5), [readings]);
  const alerts = useMemo(() => getConsumptionAlerts(readings, t), [readings, t]);

  const cardStatusClasses = useMemo(() => {
    if (!settings.monthlyGoal || settings.monthlyGoal <= 0 || readings.length < 2) {
      return ''; // Default style, no extra classes
    }
    const ratio = stats.actualBill / settings.monthlyGoal;

    if (ratio > 0.9) {
        return 'bg-red-50 dark:bg-red-900/50 border-red-500 border-l-4';
    }
    if (ratio > 0.6) {
        return 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-500 border-l-4';
    }
    return 'bg-green-50 dark:bg-green-900/50 border-green-500 border-l-4';
  }, [stats.actualBill, settings.monthlyGoal, readings.length]);

  const goalProgress = useMemo(() => {
    if (!settings.monthlyGoal || settings.monthlyGoal <= 0) {
      return null;
    }
    const { actualBill } = getMonthStats(readings, settings.tariffs);
    const percentage = Math.min((actualBill / settings.monthlyGoal) * 100, 100);
    const percentageRaw = (actualBill / settings.monthlyGoal) * 100;
    
    let color = 'bg-green-500';
    if (percentageRaw > 100) {
        color = 'bg-red-500';
    } else if (percentageRaw > 75) {
        color = 'bg-yellow-500';
    }

    return {
      actual: actualBill,
      goal: settings.monthlyGoal,
      percentage,
      percentageRaw,
      color
    };
  }, [readings, settings.tariffs, settings.monthlyGoal]);
  
  const handleSaveReading = (value: number, date: string) => {
    addReading({ value, date });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
      
      {/* Alerts */}
      {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map(alert => (
                 <Card key={alert.title} className={`${alert.type === 'peak' ? 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-400' : 'bg-green-50 dark:bg-green-900/50 border-green-400'} border-l-4`}>
                    <div className="flex">
                        <div className="py-1"><AlertIcon type={alert.type}/></div>
                        <div className="ml-3">
                            <p className="text-sm font-bold">{alert.title}</p>
                            <p className="text-sm">{alert.message}</p>
                        </div>
                    </div>
                </Card>
            ))}
          </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={cardStatusClasses}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('predicted_bill')}</h3>
          <p className="text-3xl font-semibold">{stats.predictedBill.toFixed(2)} <span className="text-lg">{settings.currency}</span></p>
        </Card>
        <Card className={cardStatusClasses}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('actual_bill')}</h3>
          <p className="text-3xl font-semibold">{stats.actualBill.toFixed(2)} <span className="text-lg">{settings.currency}</span></p>
        </Card>
        <Card className={cardStatusClasses}>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('current_usage')}</h3>
          <p className="text-3xl font-semibold">{stats.currentMonthUsage.toFixed(2)} <span className="text-lg">{t('kwh')}</span></p>
        </Card>
        <Card className={cardStatusClasses}>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('avg_daily_usage')}</h3>
          <p className="text-3xl font-semibold">{stats.avgDailyUsage.toFixed(2)} <span className="text-lg">{t('kwh')}</span></p>
        </Card>
      </div>
      
      {/* Goal Progress */}
      {goalProgress && (
        <Card>
            <h3 className="text-lg font-semibold mb-2">{t('goal_progress')}</h3>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('goal_of').replace('{current}', goalProgress.actual.toFixed(2)).replace('{goal}', goalProgress.goal.toFixed(2)).replace('{currency}', settings.currency)}
                </span>
                <span className="text-sm font-bold">
                    {goalProgress.percentageRaw.toFixed(0)}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div className={`${goalProgress.color} h-4 rounded-full transition-all duration-500`} style={{ width: `${goalProgress.percentage}%` }}></div>
            </div>
             {goalProgress.percentageRaw > 100 && (
                <p className="text-center text-sm text-red-500 mt-2 font-semibold animate-fadeIn">{t('goal_exceeded')}</p>
            )}
        </Card>
      )}

      {/* AdSense Ad */}
      <AdSenseAd slot="2640416036191095" />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => setIsModalOpen(true)} className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg shadow hover:bg-primary-600 transition-colors">
          {t('add_manually')}
        </button>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold mb-2">{t('recent_activity')}</h3>
        {readings.length > 0 ? (
          <ul className="space-y-2">
            {recentReadings.map((reading, index) => {
              const prevReading = readings[readings.length - 1 - index - 1];
              const usage = calculateUsage(reading, prevReading);
              return (
                <li key={reading.id} className="flex justify-between items-center text-sm">
                  <span>{new Date(reading.date).toLocaleString(settings.language, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>{reading.value} {t('kwh')}</span>
                  <span className={`font-semibold ${usage > 0 ? 'text-yellow-500' : 'text-gray-500'}`}>
                    {usage > 0 ? `+${usage.toFixed(2)}` : '...'}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t('no_readings_yet')}</p>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('add_new_reading')}>
        <ReadingForm onSave={handleSaveReading} onCancel={() => setIsModalOpen(false)} readings={readings} />
      </Modal>

    </div>
  );
};

export default Dashboard;
