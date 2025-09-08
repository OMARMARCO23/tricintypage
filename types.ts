export interface Reading {
  id: string;
  date: string; // ISO 8601 format
  value: number; // in kWh
}

export interface Tariff {
  upTo: number; // kWh limit
  rate: number; // MAD per kWh
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'fr' | 'ar';

export interface Settings {
  theme: Theme;
  language: Language;
  country: string; // e.g., 'MA', 'FR', 'US'
  provider?: string;
  tariffs: Tariff[];
  currency: string;
  monthlyGoal?: number;
}

export interface Alert {
  type: 'peak' | 'reduction';
  title: string;
  message: string;
}