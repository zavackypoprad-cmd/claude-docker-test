/**
 * Core position-size math, kept framework-free and pure so it can be
 * unit-tested (see calc.test.js) independently of the DOM/UI layer.
 */

/**
 * @param {Object} input
 * @param {number} input.balance            Account balance in account currency
 * @param {'percent'|'amount'} input.riskMode
 * @param {number} input.riskValue          Risk % (e.g. 1) or fixed risk amount, depending on riskMode
 * @param {number} input.stopDistancePrice  Absolute distance between entry and stop loss, in instrument price units
 * @param {number} input.conversionRate     1 unit of instrument's quote currency expressed in account currency (use 1 if quote currency === account currency)
 * @param {number} input.contractSize       Units per 1.0 "lot" (e.g. 100000 for a standard forex lot, 1 for shares/crypto coins, 100 for gold oz, futures multiplier, ...)
 * @param {number} input.pipSize            Size of one pip in price terms (e.g. 0.0001, 0.01 for JPY pairs). Used only for display.
 * @returns {{ok:true, riskAmount:number, stopDistancePrice:number, stopDistancePips:number|null, units:number, lots:number, valuePerLot:number}|{ok:false, error:string}}
 */
function calculatePositionSize(input) {
  const {
    balance,
    riskMode,
    riskValue,
    stopDistancePrice,
    conversionRate,
    contractSize,
    pipSize,
  } = input;

  if (!isFinite(balance) || balance <= 0) {
    return { ok: false, error: 'Zadaj kladný zostatok účtu.' };
  }
  if (!isFinite(riskValue) || riskValue <= 0) {
    return { ok: false, error: 'Zadaj kladnú hodnotu rizika.' };
  }
  if (riskMode === 'percent' && riskValue > 100) {
    return { ok: false, error: 'Riziko v % nemôže byť väčšie ako 100.' };
  }
  if (!isFinite(stopDistancePrice) || stopDistancePrice <= 0) {
    return { ok: false, error: 'Vzdialenosť stop lossu musí byť kladné číslo.' };
  }
  if (!isFinite(conversionRate) || conversionRate <= 0) {
    return { ok: false, error: 'Konverzný kurz musí byť kladné číslo.' };
  }
  if (!isFinite(contractSize) || contractSize <= 0) {
    return { ok: false, error: 'Veľkosť kontraktu musí byť kladné číslo.' };
  }

  const riskAmount = riskMode === 'percent' ? (balance * riskValue) / 100 : riskValue;
  if (riskMode === 'amount' && riskValue > balance) {
    return { ok: false, error: 'Riziko v mene nemôže presiahnuť zostatok účtu.' };
  }

  const valuePerUnit = stopDistancePrice * conversionRate;
  const units = riskAmount / valuePerUnit;
  const lots = units / contractSize;
  const valuePerLot = valuePerUnit * contractSize;
  const stopDistancePips = pipSize > 0 ? stopDistancePrice / pipSize : null;

  return {
    ok: true,
    riskAmount,
    stopDistancePrice,
    stopDistancePips,
    units,
    lots,
    valuePerLot,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculatePositionSize };
}
