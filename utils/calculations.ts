import { Reading, Tariff, Alert } from '../types.ts';

export const calculateUsage = (current: Reading, previous?: Reading): number => {
  if (!previous) return 0;
  return current.value - previous.value;
};

export const calculateBill = (usage: number, tariffs: Tariff[]): number => {
  let bill = 0;
  let remainingUsage = usage;
  let lastTierLimit = 0;

  const sortedTariffs = [...tariffs].sort((a, b) => a.upTo - b.upTo);

  for (const tier of sortedTariffs) {
    if (remainingUsage <= 0) break;

    const tierLimit = tier.upTo - lastTierLimit;
    const usageInTier = Math.min(remainingUsage, tierLimit);
    
    bill += usageInTier * tier.rate;
    remainingUsage -= usageInTier;
    lastTierLimit = tier.upTo;
  }

  return bill;
};

export const getMonthStats = (readings: Reading[], tariffs: Tariff[]) => {
    const sortedReadings = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const readingsThisMonth = sortedReadings.filter(r => new Date(r.date) >= firstDayOfMonth);

    if (readingsThisMonth.length < 2) {
        return { currentMonthUsage: 0, predictedBill: 0, avgDailyUsage: 0, actualBill: 0 };
    }

    const firstReadingOfMonth = readingsThisMonth[0];
    const lastReadingOfMonth = readingsThisMonth[readingsThisMonth.length - 1];

    const currentMonthUsage = lastReadingOfMonth.value - firstReadingOfMonth.value;
    const actualBill = calculateBill(currentMonthUsage, tariffs);
    
    const daysElapsed = (new Date(lastReadingOfMonth.date).getTime() - new Date(firstReadingOfMonth.date).getTime()) / (1000 * 3600 * 24) + 1;
    const avgDailyUsage = currentMonthUsage / daysElapsed;

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const predictedUsage = avgDailyUsage * daysInMonth;
    const predictedBill = calculateBill(predictedUsage, tariffs);
    
    return { currentMonthUsage, predictedBill, avgDailyUsage, actualBill };
};


export const getConsumptionAlerts = (readings: Reading[], t: (key: string) => string): Alert[] => {
    // We need at least 3 readings to compare two consumption periods.
    if (readings.length < 3) {
        return [];
    }

    // Readings from context are already sorted, but we sort again to be safe.
    const sortedReadings = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const minuteUsages: number[] = [];
    for (let i = 1; i < sortedReadings.length; i++) {
        const current = sortedReadings[i];
        const previous = sortedReadings[i - 1];
        const usage = calculateUsage(current, previous);
        const minutes = (new Date(current.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60);

        // We use a small threshold (e.g., 1/60 minutes, which is 1 second) to avoid division by zero
        // or huge rate spikes from readings entered almost simultaneously.
        // This also prevents including periods with negative or zero duration.
        if (minutes > (1 / 60)) {
            minuteUsages.push(usage / minutes);
        }
    }

    // We need at least two valid periods to compare.
    if (minuteUsages.length < 2) {
        return [];
    }

    const latestMinuteUsage = minuteUsages[minuteUsages.length - 1];
    const previousMinuteUsage = minuteUsages[minuteUsages.length - 2];
    const alerts: Alert[] = [];
    const ZERO_THRESHOLD = 0.00001;

    // Case 1: Consumption starts from near-zero. This is a peak.
    if (previousMinuteUsage < ZERO_THRESHOLD && latestMinuteUsage > ZERO_THRESHOLD) {
        alerts.push({
            type: 'peak',
            title: t('alert_peak_title'),
            message: t('alert_peak_message').replace(' by {percentage}%', ' significantly'),
        });
        return alerts;
    }
    
    // Case 2: We have a valid non-zero baseline to compare against.
    if (previousMinuteUsage > ZERO_THRESHOLD) {
        const percentageChange = ((latestMinuteUsage - previousMinuteUsage) / previousMinuteUsage) * 100;
        const PEAK_THRESHOLD = 25; // 25% increase
        const REDUCTION_THRESHOLD = -25; // 25% decrease

        if (percentageChange > PEAK_THRESHOLD) {
            alerts.push({
                type: 'peak',
                title: t('alert_peak_title'),
                message: t('alert_peak_message').replace('{percentage}', percentageChange.toFixed(0)),
            });
        } else if (percentageChange < REDUCTION_THRESHOLD) {
             alerts.push({
                type: 'reduction',
                title: t('alert_reduction_title'),
                message: t('alert_reduction_message').replace('{percentage}', Math.abs(percentageChange).toFixed(0)),
            });
        }
    }
    // Case 3: Consumption was zero and is still zero. Do nothing.

    return alerts;
};