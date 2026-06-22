import { describe, it, expect } from 'vitest';
import { calculateRatio, calculateStrengthPercentage, getExtractionStyle } from './calculations';

describe('Brew Calculations Utilities', () => {
  describe('calculateRatio', () => {
    it('calculates ratio correctly for valid inputs', () => {
      expect(calculateRatio(18, 36)).toBe(2);
      expect(calculateRatio(15, 240)).toBe(16);
    });

    it('returns 0 for negative dose or yield weight', () => {
      expect(calculateRatio(-18, 36)).toBe(0);
      expect(calculateRatio(18, -36)).toBe(0);
      expect(calculateRatio(-18, -36)).toBe(0);
    });

    it('returns 0 when dose is 0', () => {
      expect(calculateRatio(0, 36)).toBe(0);
    });

    it('returns 0 when yield weight is 0', () => {
      expect(calculateRatio(18, 0)).toBe(0);
    });

    it('returns 0 for NaN or Infinity inputs', () => {
      expect(calculateRatio(NaN, 36)).toBe(0);
      expect(calculateRatio(18, NaN)).toBe(0);
      expect(calculateRatio(Infinity, 36)).toBe(0);
      expect(calculateRatio(18, Infinity)).toBe(0);
    });
  });

  describe('calculateStrengthPercentage', () => {
    it('returns 0 if ratio <= 0', () => {
      expect(calculateStrengthPercentage(0)).toBe(0);
      expect(calculateStrengthPercentage(-5)).toBe(0);
    });

    it('calculates strength percentage correctly for standard ratio', () => {
      // ratio = 2 -> (1/2) * 100 * 2 = 100%
      expect(calculateStrengthPercentage(2)).toBe(100);
      // ratio = 16 -> (1/16) * 100 * 2 = 12.5%
      expect(calculateStrengthPercentage(16)).toBe(12.5);
    });

    it('caps strength percentage to maximum 100%', () => {
      expect(calculateStrengthPercentage(1)).toBe(100);
      expect(calculateStrengthPercentage(0.5)).toBe(100);
    });
  });

  describe('getExtractionStyle', () => {
    it('returns "Invalid" for ratio <= 0', () => {
      expect(getExtractionStyle(0)).toBe('Invalid');
      expect(getExtractionStyle(-2)).toBe('Invalid');
    });

    it('returns correct extraction style descriptions', () => {
      expect(getExtractionStyle(1)).toBe('Ristretto (Restricted)');
      expect(getExtractionStyle(2)).toBe('Normale (Standard Espresso)');
      expect(getExtractionStyle(3)).toBe('Lungo (Long Espresso)');
      expect(getExtractionStyle(8)).toBe('Concentrate / Moka Pot');
      expect(getExtractionStyle(13)).toBe('Strong Filter');
      expect(getExtractionStyle(16)).toBe('Standard Filter / Balanced');
      expect(getExtractionStyle(18)).toBe('Light Filter / Weak');
      expect(getExtractionStyle(25)).toBe('Diluted');
    });
  });
});
