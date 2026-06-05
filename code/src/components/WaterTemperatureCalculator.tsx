import React, { useState, useEffect } from 'react';
import { Settings2, Coffee, Info, RotateCcw, Flame } from 'lucide-react';

type Method = 'V60' | 'Chemex' | 'AeroPress' | 'French Press' | 'Espresso';
type Roast = 'Light' | 'Medium' | 'Dark';

interface TempRecommendation {
  min: number;
  max: number;
  ideal: number;
  notes: string;
}

const RECOMMENDATIONS: Record<Method, Record<Roast, TempRecommendation>> = {
  V60: {
    Light: { min: 93, max: 96, ideal: 94, notes: 'High heat helps extract complex acids and sugars from light roasts. Ensure your water is just off the boil.' },
    Medium: { min: 89, max: 92, ideal: 91, notes: 'A balanced temperature for medium roasts to avoid over-extraction while maintaining sweetness.' },
    Dark: { min: 80, max: 85, ideal: 83, notes: 'Lower temperatures prevent the bitter, smoky notes of dark roasts from dominating.' }
  },
  Chemex: {
    Light: { min: 93, max: 96, ideal: 94, notes: 'Thick filters require high heat to maintain thermal stability throughout the longer brew time.' },
    Medium: { min: 89, max: 92, ideal: 91, notes: 'Standard medium roast temperature. Focus on a steady pour to maintain heat.' },
    Dark: { min: 80, max: 85, ideal: 83, notes: 'Cooler water helps highlight the body without extracting harsh carbonized flavors.' }
  },
  AeroPress: {
    Light: { min: 88, max: 92, ideal: 90, notes: 'AeroPress excels with slightly lower temps than pour-over for light roasts, enhancing clarity.' },
    Medium: { min: 85, max: 88, ideal: 86, notes: 'A classic "sweet spot" for many AeroPress recipes. Fast extraction allows for lower temps.' },
    Dark: { min: 80, max: 83, ideal: 81, notes: 'Low and slow. Lower temps reduce bitterness significantly in immersion brewing.' }
  },
  'French Press': {
    Light: { min: 94, max: 97, ideal: 95, notes: 'French presses lose heat quickly. Start with very hot water to compensate for the 4-minute steep.' },
    Medium: { min: 90, max: 93, ideal: 92, notes: 'Slightly higher than pour-over to maintain a high average temperature during immersion.' },
    Dark: { min: 82, max: 86, ideal: 84, notes: 'Lower than light roasts, but still warm enough to get a full-bodied extraction.' }
  },
  Espresso: {
    Light: { min: 92, max: 95, ideal: 93, notes: 'High pressure requires precise heat. Light roasts often need 93-95°C to soluble all the solids.' },
    Medium: { min: 90, max: 93, ideal: 91, notes: 'The standard espresso setting. 91°C is the golden rule for many balanced blends.' },
    Dark: { min: 85, max: 89, ideal: 87, notes: 'Drop the temperature to avoid that "burnt" taste common in dark espresso roasts.' }
  }
};

export default function WaterTemperatureCalculator() {
  const [method, setMethod] = useState<Method>('V60');
  const [roast, setRoast] = useState<Roast>('Medium');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('temp-calculator-state');
    if (saved) {
      try {
        const { method: m, roast: r, unit: u } = JSON.parse(saved);
        if (m) setMethod(m);
        if (r) setRoast(r);
        if (u) setUnit(u);
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('temp-calculator-state', JSON.stringify({ method, roast, unit }));
    }
  }, [method, roast, unit, isMounted]);

  const toF = (c: number) => Math.round((c * 9/5) + 32);

  const formatTemp = (c: number) => {
    return unit === 'C' ? `${c}°C` : `${toF(c)}°F`;
  };

  const current = RECOMMENDATIONS[method][roast];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
          <Settings2 size={18} className="text-primary" />
          Temperature Dial
        </h3>
        <button 
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
          className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg bg-background border border-border hover:border-primary transition-colors shadow-sm"
        >
          Unit: °{unit}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <label className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
            <Coffee size={14} /> Brewing Method
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(RECOMMENDATIONS) as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                  method === m
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-card text-body border-border hover:border-hairline-strong'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
            <Flame size={14} /> Roast Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Light', 'Medium', 'Dark'] as Roast[]).map((r) => (
              <button
                key={r}
                onClick={() => setRoast(r)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                  roast === r
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-card text-body border-border hover:border-hairline-strong'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-background border border-border flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Recommended Range</span>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {formatTemp(current.min)} - {formatTemp(current.max)}
            </span>
          </div>
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Ideal Target</span>
            <span className="text-3xl font-bold text-primary tracking-tight">
              {formatTemp(current.ideal)}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-background border border-border space-y-3 shadow-sm">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">Brewing Notes</h4>
              <p className="text-sm text-body leading-relaxed">
                {current.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center pt-4">
          <button 
            onClick={() => {
              setMethod('V60');
              setRoast('Medium');
            }}
            className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <RotateCcw size={14} />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
