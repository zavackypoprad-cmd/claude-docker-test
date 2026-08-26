/**
 * Instrument presets: just pip size / contract size conventions to save typing.
 * conversionRate is left at 1 by default (account currency === quote currency);
 * the user must adjust it for cross pairs where that doesn't hold.
 */
const INSTRUMENT_PRESETS = [
  { id: 'custom', label: 'Vlastné nastavenie', pipSize: 0.0001, contractSize: 100000, quote: '' },
  { id: 'EURUSD', label: 'EUR/USD', pipSize: 0.0001, contractSize: 100000, quote: 'USD' },
  { id: 'GBPUSD', label: 'GBP/USD', pipSize: 0.0001, contractSize: 100000, quote: 'USD' },
  { id: 'AUDUSD', label: 'AUD/USD', pipSize: 0.0001, contractSize: 100000, quote: 'USD' },
  { id: 'NZDUSD', label: 'NZD/USD', pipSize: 0.0001, contractSize: 100000, quote: 'USD' },
  { id: 'USDCAD', label: 'USD/CAD', pipSize: 0.0001, contractSize: 100000, quote: 'CAD' },
  { id: 'USDCHF', label: 'USD/CHF', pipSize: 0.0001, contractSize: 100000, quote: 'CHF' },
  { id: 'USDJPY', label: 'USD/JPY', pipSize: 0.01, contractSize: 100000, quote: 'JPY' },
  { id: 'EURJPY', label: 'EUR/JPY', pipSize: 0.01, contractSize: 100000, quote: 'JPY' },
  { id: 'GBPJPY', label: 'GBP/JPY', pipSize: 0.01, contractSize: 100000, quote: 'JPY' },
  { id: 'EURGBP', label: 'EUR/GBP', pipSize: 0.0001, contractSize: 100000, quote: 'GBP' },
  { id: 'XAUUSD', label: 'Zlato (XAU/USD)', pipSize: 0.01, contractSize: 100, quote: 'USD' },
  { id: 'XAGUSD', label: 'Striebro (XAG/USD)', pipSize: 0.001, contractSize: 5000, quote: 'USD' },
  { id: 'CRYPTO', label: 'Krypto (1 minca = 1 jednotka)', pipSize: 0, contractSize: 1, quote: '' },
  { id: 'STOCK', label: 'Akcia / CFD (1 kus = 1 jednotka)', pipSize: 0, contractSize: 1, quote: '' },
];

const LOT_UNITS = [
  { id: 'standard', label: 'Standardný lot (100 000)', size: 100000 },
  { id: 'mini', label: 'Mini lot (10 000)', size: 10000 },
  { id: 'micro', label: 'Mikro lot (1 000)', size: 1000 },
  { id: 'unit', label: '1 jednotka (akcie / krypto)', size: 1 },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INSTRUMENT_PRESETS, LOT_UNITS };
}
