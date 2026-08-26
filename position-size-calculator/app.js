(function () {
  const STORAGE_KEY = 'psc:v1';

  const els = {
    themeToggle: document.getElementById('themeToggle'),
    form: document.getElementById('calcForm'),
    accountCurrency: document.getElementById('accountCurrency'),
    balance: document.getElementById('balance'),
    riskValue: document.getElementById('riskValue'),
    riskValueLabel: document.getElementById('riskValueLabel'),
    instrumentPreset: document.getElementById('instrumentPreset'),
    stopModePrice: document.getElementById('stopModePrice'),
    stopModePips: document.getElementById('stopModePips'),
    entryPrice: document.getElementById('entryPrice'),
    stopPrice: document.getElementById('stopPrice'),
    stopPips: document.getElementById('stopPips'),
    pipSizeHint: document.getElementById('pipSizeHint'),
    contractSize: document.getElementById('contractSize'),
    pipSize: document.getElementById('pipSize'),
    conversionRate: document.getElementById('conversionRate'),
    lotUnit: document.getElementById('lotUnit'),
    result: document.getElementById('result'),
    resultLots: document.getElementById('resultLots'),
    resultLotsLabel: document.getElementById('resultLotsLabel'),
    resultRiskAmount: document.getElementById('resultRiskAmount'),
    resultStopDistance: document.getElementById('resultStopDistance'),
    resultUnits: document.getElementById('resultUnits'),
    resultLossCheck: document.getElementById('resultLossCheck'),
    resultWarning: document.getElementById('resultWarning'),
    errorBox: document.getElementById('errorBox'),
  };

  let riskMode = 'percent';
  let stopMode = 'price';

  // ---- Populate selects from presets.js ----
  INSTRUMENT_PRESETS.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.label;
    els.instrumentPreset.appendChild(opt);
  });

  LOT_UNITS.forEach((u) => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.textContent = u.label;
    els.lotUnit.appendChild(opt);
  });

  // ---- Theme ----
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    els.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function initTheme() {
    const saved = localStorage.getItem('psc:theme');
    const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(theme);
  }

  els.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('psc:theme', next);
  });

  // ---- Segmented controls ----
  document.querySelectorAll('[data-risk-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      riskMode = btn.dataset.riskMode;
      document.querySelectorAll('[data-risk-mode]').forEach((b) => b.classList.toggle('active', b === btn));
      els.riskValueLabel.textContent = riskMode === 'percent' ? 'Riziko (%)' : `Riziko (${currentCurrency()})`;
    });
  });

  document.querySelectorAll('[data-stop-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      stopMode = btn.dataset.stopMode;
      document.querySelectorAll('[data-stop-mode]').forEach((b) => b.classList.toggle('active', b === btn));
      els.stopModePrice.classList.toggle('hidden', stopMode !== 'price');
      els.stopModePips.classList.toggle('hidden', stopMode !== 'pips');
    });
  });

  function currentCurrency() {
    return (els.accountCurrency.value || 'USD').trim().toUpperCase() || 'USD';
  }

  // ---- Instrument preset ----
  function applyPreset(id) {
    const preset = INSTRUMENT_PRESETS.find((p) => p.id === id) || INSTRUMENT_PRESETS[0];
    els.pipSize.value = preset.pipSize;
    els.contractSize.value = preset.contractSize;
    els.pipSizeHint.textContent = preset.pipSize > 0
      ? `Veľkosť pipu: ${preset.pipSize}` + (preset.quote ? ` · kótovaná mena: ${preset.quote}` : '')
      : 'Tento inštrument nepoužíva pipy, zadaj cenu vstupu a stopu.';

    // Pick a sensible default display unit for this instrument (user can still change it).
    const matchingUnit = LOT_UNITS.find((u) => u.size === preset.contractSize);
    els.lotUnit.value = matchingUnit ? matchingUnit.id : 'unit';

    if (preset.pipSize <= 0 && stopMode === 'pips') {
      document.querySelector('[data-stop-mode="price"]').click();
    }
  }

  els.instrumentPreset.addEventListener('change', () => applyPreset(els.instrumentPreset.value));

  // ---- Formatting helpers ----
  function fmtMoney(value, currency) {
    try {
      return new Intl.NumberFormat('sk-SK', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
    } catch (e) {
      return `${value.toFixed(2)} ${currency}`;
    }
  }

  function fmtNumber(value, maxDecimals) {
    return new Intl.NumberFormat('sk-SK', { maximumFractionDigits: maxDecimals }).format(value);
  }

  function lotDecimals(value) {
    if (value === 0) return 2;
    if (value >= 1) return 2;
    if (value >= 0.01) return 4;
    return 6; // avoid rounding very small (but non-zero) sizes down to "0"
  }

  // ---- Persistence ----
  function collectState() {
    return {
      accountCurrency: els.accountCurrency.value,
      balance: els.balance.value,
      riskMode,
      riskValue: els.riskValue.value,
      instrumentPreset: els.instrumentPreset.value,
      stopMode,
      entryPrice: els.entryPrice.value,
      stopPrice: els.stopPrice.value,
      stopPips: els.stopPips.value,
      contractSize: els.contractSize.value,
      pipSize: els.pipSize.value,
      conversionRate: els.conversionRate.value,
      lotUnit: els.lotUnit.value,
    };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
  }

  function loadState() {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (e) {
      saved = null;
    }
    if (!saved) {
      applyPreset(els.instrumentPreset.value);
      return;
    }

    if (saved.accountCurrency) els.accountCurrency.value = saved.accountCurrency;
    if (saved.balance) els.balance.value = saved.balance;
    if (saved.riskValue) els.riskValue.value = saved.riskValue;
    if (saved.instrumentPreset) els.instrumentPreset.value = saved.instrumentPreset;
    if (saved.entryPrice) els.entryPrice.value = saved.entryPrice;
    if (saved.stopPrice) els.stopPrice.value = saved.stopPrice;
    if (saved.stopPips) els.stopPips.value = saved.stopPips;
    if (saved.lotUnit) els.lotUnit.value = saved.lotUnit;

    applyPreset(els.instrumentPreset.value);
    if (saved.contractSize) els.contractSize.value = saved.contractSize;
    if (saved.pipSize) els.pipSize.value = saved.pipSize;
    if (saved.conversionRate) els.conversionRate.value = saved.conversionRate;

    if (saved.riskMode && saved.riskMode !== riskMode) {
      document.querySelector(`[data-risk-mode="${saved.riskMode}"]`).click();
    }
    if (saved.stopMode && saved.stopMode !== stopMode) {
      document.querySelector(`[data-stop-mode="${saved.stopMode}"]`).click();
    }
  }

  // ---- Submit / calculate ----
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveState();

    const currency = currentCurrency();
    const balance = parseFloat(els.balance.value);
    const riskValue = parseFloat(els.riskValue.value);
    const conversionRate = parseFloat(els.conversionRate.value);
    const contractSize = parseFloat(els.contractSize.value);
    const pipSize = parseFloat(els.pipSize.value) || 0;

    let stopDistancePrice;
    if (stopMode === 'price') {
      const entry = parseFloat(els.entryPrice.value);
      const stop = parseFloat(els.stopPrice.value);
      stopDistancePrice = isFinite(entry) && isFinite(stop) ? Math.abs(entry - stop) : NaN;
    } else {
      const pips = parseFloat(els.stopPips.value);
      stopDistancePrice = isFinite(pips) && pipSize > 0 ? pips * pipSize : NaN;
      if (pipSize <= 0) {
        showError('Zvolený inštrument nemá definovanú veľkosť pipu — použi režim "Vstup + Stop cena" alebo nastav veľkosť pipu v Pokročilom nastavení.');
        return;
      }
    }

    const r = calculatePositionSize({
      balance,
      riskMode,
      riskValue,
      stopDistancePrice,
      conversionRate,
      contractSize,
      pipSize,
    });

    if (!r.ok) {
      showError(r.error);
      return;
    }

    const lotUnitDef = LOT_UNITS.find((u) => u.id === els.lotUnit.value) || LOT_UNITS[0];
    const lotsInChosenUnit = r.units / lotUnitDef.size;

    els.errorBox.classList.add('hidden');
    els.result.classList.remove('hidden');

    els.resultLots.textContent = fmtNumber(lotsInChosenUnit, lotDecimals(lotsInChosenUnit));
    els.resultLotsLabel.textContent = lotUnitDef.label;
    els.resultRiskAmount.textContent = fmtMoney(r.riskAmount, currency);
    els.resultStopDistance.textContent = r.stopDistancePips != null
      ? `${fmtNumber(r.stopDistancePips, 1)} pipov (${fmtNumber(r.stopDistancePrice, 6)})`
      : fmtNumber(r.stopDistancePrice, 6);
    els.resultUnits.textContent = fmtNumber(r.units, 2);
    els.resultLossCheck.textContent = fmtMoney(r.units * r.stopDistancePrice * conversionRate, currency);

    const minLot = 0.01;
    if (lotUnitDef.size !== 1 && lotsInChosenUnit < minLot) {
      els.resultWarning.textContent = `Vypočítaná veľkosť (${fmtNumber(lotsInChosenUnit, 4)}) je menšia než bežné minimum brokera (${minLot}). Zváž nižšie riziko/väčší SL, alebo menšiu jednotku lotu.`;
      els.resultWarning.classList.remove('hidden');
    } else if (lotsInChosenUnit > 1000) {
      els.resultWarning.textContent = 'Vypočítaná veľkosť pozície je veľmi vysoká — skontroluj zadané hodnoty (najmä konverzný kurz a veľkosť kontraktu).';
      els.resultWarning.classList.remove('hidden');
    } else {
      els.resultWarning.classList.add('hidden');
    }

    els.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function showError(message) {
    els.result.classList.add('hidden');
    els.errorBox.textContent = message;
    els.errorBox.classList.remove('hidden');
    els.errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  initTheme();
  loadState();
})();
