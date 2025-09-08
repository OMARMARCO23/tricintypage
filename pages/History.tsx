import React, { useState, useMemo } from 'https://aistudiocdn.com/react@^19.1.1';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Reading } from '../types.ts';
import { calculateUsage } from '../utils/calculations.ts';
import Card from '../components/Card.tsx';
import Modal from '../components/Modal.tsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'https://aistudiocdn.com/recharts@^3.1.2';
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
        <input type="number" id="reading-value" step="0.1" min="0" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="reading-date">{t('date')}</label>
        <input type="datetime-local" id="reading-date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" required />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('cancel')}</button>
        <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md">{t('save')}</button>
      </div>
    </form>
  );
};

const History: React.FC = () => {
  const { readings, updateReading, deleteReading, clearReadings, t, settings } = useAppContext();
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const handleUpdate = (value: number, date: string) => {
    if (editingReading) {
      updateReading({ ...editingReading, value, date });
      setEditingReading(null);
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteReading(deletingId);
      setDeletingId(null);
    }
  };
  
  const handleDeleteAll = () => {
    clearReadings();
    setIsDeleteAllModalOpen(false);
  };

  const handleExport = () => {
    if (readings.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Reading (kWh),Usage Since Previous (kWh)\n";

    readings.forEach((reading, index) => {
        const usage = index > 0 ? calculateUsage(reading, readings[index - 1]) : 0;
        const row = [
            new Date(reading.date).toISOString(),
            reading.value,
            index > 0 ? usage.toFixed(4) : ''
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tricinty_readings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = useMemo(() => {
    return readings.map((reading, index) => ({
      date: new Date(reading.date).toLocaleString(settings.language, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
      usage: index > 0 ? calculateUsage(reading, readings[index - 1]) : 0,
    })).filter(d => d.usage > 0);
  }, [readings, settings.language]);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-y-4">
            <h1 className="text-2xl font-bold">{t('reading_history')}</h1>
            {readings.length > 0 && (
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {t('export_to_csv')}
                    </button>
                    <button
                        onClick={() => setIsDeleteAllModalOpen(true)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        {t('delete_all_readings')}
                    </button>
                </div>
            )}
        </div>

      {readings.length > 1 && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">{t('consumption_trend')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={settings.theme === 'dark' ? '#4A5568' : '#E2E8F0'}/>
              <XAxis dataKey="date" stroke={settings.theme === 'dark' ? '#A0AEC0' : '#4A5568'}/>
              <YAxis stroke={settings.theme === 'dark' ? '#A0AEC0' : '#4A5568'}/>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: settings.theme === 'dark' ? '#2D3748' : '#FFFFFF',
                  borderColor: settings.theme === 'dark' ? '#4A5568' : '#E2E8F0'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="usage" name={`${t('usage_since_previous')}`} stroke="#3B82F6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3">{t('date')}</th>
                <th scope="col" className="px-4 py-3">{t('reading_value')}</th>
                <th scope="col" className="px-4 py-3">{t('usage_since_previous')}</th>
                <th scope="col" className="px-4 py-3 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading, index) => (
                <tr key={reading.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{new Date(reading.date).toLocaleString(settings.language, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-2">{reading.value.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {index > 0 ? calculateUsage(reading, readings[index - 1]).toFixed(2) : '-'}
                  </td>
                  <td className="px-4 py-2 flex justify-end gap-2">
                    <button onClick={() => setEditingReading(reading)} className="font-medium text-primary-500 hover:underline">{t('edit')}</button>
                    <button onClick={() => setDeletingId(reading.id)} className="font-medium text-red-500 hover:underline">{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {readings.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">{t('no_readings_yet')}</p>}
      </Card>
      
      <Modal isOpen={!!editingReading} onClose={() => setEditingReading(null)} title={t('edit')}>
        <ReadingForm onSave={handleUpdate} onCancel={() => setEditingReading(null)} initialReading={editingReading} readings={readings} />
      </Modal>

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title={t('confirm_delete')}>
        <div>
            <p className="mb-4">{t('confirm_delete')}</p>
            <div className="flex justify-end gap-2">
                <button onClick={() => setDeletingId(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('cancel')}</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">{t('delete')}</button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteAllModalOpen} onClose={() => setIsDeleteAllModalOpen(false)} title={t('confirm_delete_all_title')}>
        <div>
            <p className="mb-4">{t('confirm_delete_all_message')}</p>
            <div className="flex justify-end gap-2">
                <button onClick={() => setIsDeleteAllModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('cancel')}</button>
                <button onClick={handleDeleteAll} className="px-4 py-2 bg-red-500 text-white rounded-md">{t('delete_all')}</button>
            </div>
        </div>
      </Modal>

      <AdSenseAd slot="1234567890" />
    </div>
  );
};

export default History;