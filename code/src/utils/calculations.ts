export const calculateRatio = (dose: number, yieldWeight: number): number => {
  if (isNaN(dose) || isNaN(yieldWeight) || dose <= 0 || yieldWeight <= 0 || !isFinite(dose) || !isFinite(yieldWeight)) {
    return 0;
  }
  return yieldWeight / dose;
};

export const calculateStrengthPercentage = (ratio: number): number => {
  if (ratio <= 0) return 0;
  return Math.max(0, Math.min(100, (1 / ratio) * 100 * 2));
};

export const getExtractionStyle = (ratio: number): string => {
  if (ratio <= 0) return 'Invalid';
  if (ratio < 1.5) return 'Ristretto (Restricted)';
  if (ratio < 2.5) return 'Normale (Standard Espresso)';
  if (ratio < 4) return 'Lungo (Long Espresso)';
  if (ratio < 10) return 'Concentrate / Moka Pot';
  if (ratio < 14) return 'Strong Filter';
  if (ratio < 17) return 'Standard Filter / Balanced';
  if (ratio < 20) return 'Light Filter / Weak';
  return 'Diluted';
};
