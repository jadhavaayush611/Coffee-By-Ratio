import React, { useState, useMemo } from 'react';
import { Coffee, Droplets, Scale, Info, Zap } from 'lucide-react';
import { calculateRatio, calculateStrengthPercentage, getExtractionStyle } from '../utils/calculations';

interface BrewCategory {
  name: string;
  minRatio: number;
  maxRatio: number;
  description: string;
  color: string;
  bgLight: string;
  borderLight: string;
}

const CATEGORIES: BrewCategory[] = [
  {
    name: 'Espresso',
    minRatio: 1,
    maxRatio: 4,
    description: 'Highly concentrated pressure extraction. Intense body and flavor.',
    color: 'text-error-deep',
    bgLight: 'bg-error-soft/30',
    borderLight: 'border-error-soft/50',
  },
  {
    name: 'Filter Coffee',
    minRatio: 12,
    maxRatio: 18,
    description: 'Balanced extraction through a paper filter. Highlights clarity and acidity.',
    color: 'text-success',
    bgLight: 'bg-link-bg-soft/30',
    borderLight: 'border-link-bg-soft/50',
  },
  {
    name: 'Immersion Brew',
    minRatio: 12,
    maxRatio: 16,
    description: 'Full saturation brewing (French Press, AeroPress). Rich body and consistent extraction.',
    color: 'text-link',
    bgLight: 'bg-link-bg-soft/30',
    borderLight: 'border-link-bg-soft/50',
  }
];

export default function BrewYieldCalculator() {
  const [dose, setDose] = useState<string>('18');
  const [yieldWeight, setYieldWeight] = useState<string>('36');
  const [errors, setErrors] = useState<{ dose?: string; yieldWeight?: string }>({});

  const validateField = (val: string, field: 'dose' | 'yieldWeight'): string => {
    if (!val || val.trim() === '') {
      return 'Value is required';
    }
    const num = parseFloat(val);
    if (isNaN(num)) {
      return 'Must be a valid number';
    }
    if (!isFinite(num)) {
      return 'Must be a finite number';
    }
    if (num <= 0) {
      return 'Must be greater than zero';
    }
    if (field === 'dose' && num < 0.1) {
      return 'Min dose is 0.1g';
    }
    if (field === 'yieldWeight' && num < 0.1) {
      return 'Min yield is 0.1g';
    }
    return '';
  };

  const handleDoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDose(val);
    setErrors(prev => ({ ...prev, dose: validateField(val, 'dose') }));
  };

  const handleYieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setYieldWeight(val);
    setErrors(prev => ({ ...prev, yieldWeight: validateField(val, 'yieldWeight') }));
  };

  const ratio = useMemo(() => {
    return calculateRatio(parseFloat(dose), parseFloat(yieldWeight));
  }, [dose, yieldWeight]);

  const strengthPercentage = calculateStrengthPercentage(ratio);

  const hasErrors = !!(errors.dose || errors.yieldWeight);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Scale size={18} className="text-primary" aria-hidden="true" />
          Brew Yield Calculator
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="dose-input" className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
            <Coffee size={14} aria-hidden="true" /> Coffee Dose (g)
          </label>
          <input
            id="dose-input"
            type="number"
            step="0.1"
            min="0.1"
            inputMode="decimal"
            value={dose}
            onChange={handleDoseChange}
            className={`w-full h-14 px-4 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold ${
              errors.dose ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'
            }`}
            placeholder="e.g. 18"
          />
          {errors.dose && <p className="text-[11px] text-error font-medium mt-1">{errors.dose}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="yield-input" className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
            <Droplets size={14} aria-hidden="true" /> Yield / Weight (g)
          </label>
          <input
            id="yield-input"
            type="number"
            step="0.1"
            min="0.1"
            inputMode="decimal"
            value={yieldWeight}
            onChange={handleYieldChange}
            className={`w-full h-14 px-4 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold ${
              errors.yieldWeight ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'
            }`}
            placeholder="e.g. 36"
          />
          {errors.yieldWeight && <p className="text-[11px] text-error font-medium mt-1">{errors.yieldWeight}</p>}
        </div>
      </div>

      <div className="p-8 bg-background border border-border rounded-2xl space-y-6 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">Brew Ratio</span>
            <div className="text-4xl font-bold text-foreground tracking-tight">
              {hasErrors ? '1:-' : `1:${ratio.toFixed(1).replace(/\.0$/, '')}`}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">Extraction Style</span>
            <div className="text-lg font-bold text-primary">
              {hasErrors ? 'Invalid' : getExtractionStyle(ratio)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-mono uppercase tracking-widest text-muted">
            <span>Strength Indicator</span>
            <span className="font-bold text-foreground">
              {!hasErrors && ratio > 0 ? (ratio < 4 ? 'High Intensity' : ratio < 12 ? 'Medium' : 'Lower Intensity') : '-'}
            </span>
          </div>
          <div className="h-3 w-full bg-card border border-border rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out shadow-sm" 
              style={{ width: `${hasErrors ? 0 : strengthPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-mono uppercase tracking-widest text-muted font-bold">Matched Categories</h4>
        <div className="grid gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = ratio >= cat.minRatio && ratio <= cat.maxRatio;
            return (
              <div 
                key={cat.name}
                className={`p-5 rounded-2xl border transition-all shadow-sm ${
                  isActive 
                    ? `${cat.bgLight} ${cat.borderLight} opacity-100` 
                    : 'bg-card border-border opacity-50 grayscale'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? cat.color : 'text-muted'}`}>
                    {cat.name}
                  </span>
                  {isActive && <Zap size={14} className={cat.color} />}
                </div>
                <p className="text-sm text-body leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-3 text-[10px] font-mono text-muted">
                  Ideal Range: <span className="font-bold">1:{cat.minRatio} - 1:{cat.maxRatio}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-muted-background border border-border rounded-xl flex items-center gap-3 shadow-sm">
        <Info size={18} className="text-muted shrink-0" />
        <p className="text-xs text-body leading-relaxed">
          Yield is the final beverage weight in your cup. For espresso, this includes the crema. For filter, it's the total water that passed through.
        </p>
      </div>
    </div>
  );
}
