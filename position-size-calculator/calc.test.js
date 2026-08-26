const assert = require('assert');
const { calculatePositionSize } = require('./calc');

// EURUSD example: $10,000 account, risk 1%, 50 pip stop.
// account currency = quote currency (USD) so conversionRate = 1, standard lot = 100000 units.
{
  const r = calculatePositionSize({
    balance: 10000,
    riskMode: 'percent',
    riskValue: 1,
    stopDistancePrice: 0.005, // 50 pips * 0.0001
    conversionRate: 1,
    contractSize: 100000,
    pipSize: 0.0001,
  });
  assert.ok(r.ok);
  assert.strictEqual(r.riskAmount, 100); // 1% of 10000
  assert.ok(Math.abs(r.stopDistancePips - 50) < 1e-6);
  assert.ok(Math.abs(r.lots - 0.2) < 1e-9); // 100 / (0.005 * 100000) = 0.2 lots
}

// Fixed risk amount instead of percent, stock/crypto style (contractSize = 1).
{
  const r = calculatePositionSize({
    balance: 5000,
    riskMode: 'amount',
    riskValue: 50,
    stopDistancePrice: 2,
    conversionRate: 1,
    contractSize: 1,
    pipSize: 0,
  });
  assert.ok(r.ok);
  assert.strictEqual(r.riskAmount, 50);
  assert.strictEqual(r.units, 25); // 50 / 2
  assert.strictEqual(r.lots, 25); // contractSize 1 -> lots === units
}

// Cross-currency conversion rate is applied.
{
  const r = calculatePositionSize({
    balance: 10000,
    riskMode: 'percent',
    riskValue: 2,
    stopDistancePrice: 0.5, // e.g. 50 pips on a JPY pair
    conversionRate: 0.0067, // quote currency converted into the account currency
    contractSize: 100000,
    pipSize: 0.01,
  });
  assert.ok(r.ok);
  assert.strictEqual(r.riskAmount, 200);
  const expectedValuePerUnit = 0.5 * 0.0067;
  assert.ok(Math.abs(r.units - 200 / expectedValuePerUnit) < 1e-6);
}

// Validation errors.
assert.strictEqual(calculatePositionSize({ balance: 0, riskMode: 'percent', riskValue: 1, stopDistancePrice: 1, conversionRate: 1, contractSize: 1, pipSize: 0 }).ok, false);
assert.strictEqual(calculatePositionSize({ balance: 100, riskMode: 'percent', riskValue: 150, stopDistancePrice: 1, conversionRate: 1, contractSize: 1, pipSize: 0 }).ok, false);
assert.strictEqual(calculatePositionSize({ balance: 100, riskMode: 'percent', riskValue: 1, stopDistancePrice: 0, conversionRate: 1, contractSize: 1, pipSize: 0 }).ok, false);
assert.strictEqual(calculatePositionSize({ balance: 100, riskMode: 'amount', riskValue: 500, stopDistancePrice: 1, conversionRate: 1, contractSize: 1, pipSize: 0 }).ok, false);
assert.strictEqual(calculatePositionSize({ balance: 100, riskMode: 'percent', riskValue: 1, stopDistancePrice: 1, conversionRate: 0, contractSize: 1, pipSize: 0 }).ok, false);
assert.strictEqual(calculatePositionSize({ balance: 100, riskMode: 'percent', riskValue: 1, stopDistancePrice: 1, conversionRate: 1, contractSize: 0, pipSize: 0 }).ok, false);

console.log('All calc.js tests passed.');
