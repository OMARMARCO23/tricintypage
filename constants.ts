import { Tariff } from './types.ts';

export const DEFAULT_MOROCCAN_TARIFFS: Tariff[] = [
  { upTo: 100, rate: 0.9010 },
  { upTo: 150, rate: 1.0744 },
  { upTo: 200, rate: 1.0744 },
  { upTo: 300, rate: 1.2827 },
  { upTo: 500, rate: 1.4912 },
  { upTo: Infinity, rate: 1.6995 },
];

export const COUNTRIES = [
  { code: 'MA', nameKey: 'country_morocco' },
  { code: 'FR', nameKey: 'country_france' },
  { code: 'US', nameKey: 'country_usa' },
  { code: 'DE', nameKey: 'country_germany' },
  { code: 'ES', nameKey: 'country_spain' },
  { code: 'GB', nameKey: 'country_uk' },
];

export interface Provider {
    name: string;
    currency: string;
    tariffs: Tariff[];
}

export const TARIFF_DATA: Record<string, Provider[]> = {
    'FR': [
        {
            name: 'EDF (Tarif Bleu - Option Base)',
            currency: 'EUR',
            tariffs: [ { upTo: Infinity, rate: 0.1740 } ]
        },
        {
            name: 'Engie (Tarif Réglementé)',
            currency: 'EUR',
            tariffs: [ { upTo: Infinity, rate: 0.1765 } ]
        }
    ],
    'US': [
        {
            name: 'PG&E (California - E-1)',
            currency: 'USD',
            tariffs: [
                { upTo: 332, rate: 0.34 },
                { upTo: 1328, rate: 0.42 },
                { upTo: Infinity, rate: 0.52 },
            ]
        },
        {
            name: 'Con Edison (New York)',
            currency: 'USD',
            tariffs: [ { upTo: Infinity, rate: 0.22 } ]
        }
    ],
};

export const ADVICE_KEYS = [
  'advice_unplug',
  'advice_led',
  'advice_cold_wash',
  'advice_thermostat',
  'advice_appliances',
  'advice_fridge',
  'advice_drafts',
];