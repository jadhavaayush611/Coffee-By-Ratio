import React, { useState, useEffect, useCallback } from 'react';
import { Coffee, Droplets, Scale, RefreshCw, Info, Zap, Settings2 } from 'lucide-react';

interface Preset {
  name: string;
  ratio: number;
  description: string;
  extraction: string;
}

const PRESETS: Preset[] = [
  { 
    name: 'Espresso', 
    ratio: 2, 
    description: 'Highly concentrated, pressure-extracted coffee.', 
    extraction: 'Fine grind, 9 bars of pressure, 25-30s brew time.' 
  },
  { 
    name: 'Moka Pot', 
    ratio: 7, 
    description: 'Stovetop espresso-style coffee, intense and full-bodied.', 
    extraction: 'Fine-medium grind, use hot water in the base to start.' 
  },
  { 
    name: 'Cold Brew', 
    ratio: 8, 
    description: 'Slow-steeped concentrate, low acidity.', 
    extraction: 'Extra coarse grind, steep for 12-24 hours at room temp.' 
  },
  { 
    name: 'AeroPress', 
    ratio: 15, 
    description: 'Versatile, clean, and quick immersion brew.', 
    extraction: 'Fine-medium grind, 1-2 min steep time.' 
  },
  { 
    name: 'French Press', 
    ratio: 15, 
    description: 'Classic immersion brew, heavy body and oils.', 
    extraction: 'Coarse grind, 4 minute steep, slow plunge.' 
  },
  { 
    name: 'V60', 
    ratio: 16, 
    description: 'Clean, tea-like pour over highlighting acidity.', 
    extraction: 'Medium-fine grind, multiple pours, 2:30-3:00 total.' 
  },
  { 
    name: 'Chemex', 
    ratio: 16.5, 
    description: 'Extremely clean pour over via thick filters.', 
    extraction: 'Medium grind, slow steady pour, 3:30-4:30 total.' 
  },
];

type Mode = 'coffee-to-water' | 'water-to-coffee';

export default function RatioCalculator() {
  const [coffee, setCoffee] = useState<string>('18');
  const [water, setWater] = useState<string>('288');
  const [ratio, setRatio] = useState<string>('16');
  const [mode, setMode] = useState<Mode>('coffee-to-water');
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('coffee-engine-state');
    if (saved) {
      try {
        const { coffee: c, water: w, ratio: r, mode: m } = JSON.parse(saved);
        setCoffee(c || '18');
        setWater(w || '288');
        setRatio(r || '16');
        setMode(m || 'coffee-to-water');
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('coffee-engine-state', JSON.stringify({ coffee, water, ratio, mode }));
    }
  }, [coffee, water, ratio, mode, isMounted]);

  const updateCalculations = useCallback((
    targetMode: Mode, 
    c: string, 
    w: string, 
    r: string, 
    trigger: 'coffee' | 'water' | 'ratio'
  ) => {
    const numC = parseFloat(c);
    const numW = parseFloat(w);
    const numR = parseFloat(r);

    if (targetMode === 'coffee-to-water') {
      if (trigger === 'coffee' || trigger === 'ratio') {
        if (!isNaN(numC) && !isNaN(numR)) {
          setWater((numC * numR).toFixed(1).replace(/\.0$/, ''));
        }
      } else if (trigger === 'water') {
        if (!isNaN(numW) && !isNaN(numR) && numR !== 0) {
          setCoffee((numW / numR).toFixed(1).replace(/\.0$/, ''));
        }
      }
    } else {
      if (trigger === 'water' || trigger === 'ratio') {
        if (!isNaN(numW) && !isNaN(numR) && numR !== 0) {
          setCoffee((numW / numR).toFixed(1).replace(/\.0$/, ''));
        }
      } else if (trigger === 'coffee') {
        if (!isNaN(numC) && !isNaN(numR)) {
          setWater((numC * numR).toFixed(1).replace(/\.0$/, ''));
        }
      }
    }
  }, []);

  const handleCoffeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoffee(val);
    updateCalculations(mode, val, water, ratio, 'coffee');
  };

  const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWater(val);
    updateCalculations(mode, coffee, val, ratio, 'water');
  };

  const handleRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRatio(val);
    updateCalculations(mode, coffee, water, val, 'ratio');
  };

  const toggleMode = () => {
    const newMode = mode === 'coffee-to-water' ? 'water-to-coffee' : 'coffee-to-water';
    setMode(newMode);
  };

  const applyPreset = (p: Preset) => {
    setRatio(p.ratio.toString());
    updateCalculations(mode, coffee, water, p.ratio.toString(), 'ratio');
  };

  const getStrength = (r: number) => {
    if (r <= 3) return { label: 'Extra Strong', color: 'text-error-deep bg-error-soft border-error-soft/20' };
    if (r <= 9) return { label: 'Strong', color: 'text-warning-deep bg-warning-soft border-warning-soft/20' };
    if (r <= 14) return { label: 'Intense', color: 'text-warning bg-warning-soft border-warning-soft/20' };
    if (r <= 17) return { label: 'Balanced', color: 'text-success bg-link-bg-soft/30 border-link-bg-soft/20' };
    return { label: 'Light', color: 'text-link bg-link-bg-soft/30 border-link-bg-soft/20' };
  };

  const numRatio = parseFloat(ratio) || 0;
  const strength = getStrength(numRatio);
  const currentPreset = PRESETS.find(p => Math.abs(p.ratio - numRatio) < 0.1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Settings2 size={18} className="text-primary" />
          Brewing Engine
        </h3>
        <button 
          onClick={toggleMode}
          className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg bg-background border border-border hover:border-primary transition-colors flex items-center gap-2 shadow-sm"
          aria-label={`Toggle calculation mode. Current: ${mode === 'coffee-to-water' ? 'Coffee to Water' : 'Water to Coffee'}`}
        >
          {mode === 'coffee-to-water' ? (
            <><Coffee size={12} aria-hidden="true" /> → <Droplets size={12} aria-hidden="true" /></>
          ) : (
            <><Droplets size={12} aria-hidden="true" /> → <Coffee size={12} aria-hidden="true" /></>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="coffee-input" className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
              <Coffee size={14} aria-hidden="true" className={mode === 'coffee-to-water' ? 'text-primary' : ''} /> 
              Coffee (g) {mode === 'coffee-to-water' && <Zap size={12} aria-hidden="true" className="text-primary" />}
            </label>
            <input
              id="coffee-input"
              type="number"
              step="0.1"
              inputMode="decimal"
              value={coffee}
              onChange={handleCoffeeChange}
              className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="water-input" className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
              <Droplets size={14} aria-hidden="true" className={mode === 'water-to-coffee' ? 'text-primary' : ''} /> 
              Water (ml) {mode === 'water-to-coffee' && <Zap size={12} aria-hidden="true" className="text-primary" />}
            </label>
            <input
              id="water-input"
              type="number"
              step="1"
              inputMode="decimal"
              value={water}
              onChange={handleWaterChange}
              className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="ratio-input" className="text-[11px] font-mono uppercase tracking-widest text-muted flex items-center gap-2">
            <Scale size={14} aria-hidden="true" /> Ratio (1:x)
          </label>
          <input
            id="ratio-input"
            type="number"
            step="0.1"
            inputMode="decimal"
            value={ratio}
            onChange={handleRatioChange}
            className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
                Math.abs(parseFloat(ratio) - p.ratio) < 0.1
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-card text-body border-border hover:border-hairline-strong'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${strength.color}`}>
          <span className="text-xs font-bold uppercase tracking-wider">Strength: {strength.label}</span>
          <span className="text-sm font-mono font-bold">1:{ratio}</span>
        </div>

        {currentPreset && (
          <div className="p-5 rounded-xl bg-background border border-border space-y-3 shadow-sm">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground leading-tight mb-2">{currentPreset.description}</p>
                <p className="text-xs text-body leading-relaxed italic">{currentPreset.extraction}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-background border border-border rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <RefreshCw size={16} className="text-muted" />
            <span className="text-sm text-body">
              <strong className="text-foreground font-bold">{coffee}g</strong> / <strong className="text-foreground font-bold">{water}ml</strong>
            </span>
          </div>
          <button 
            onClick={() => {
              setCoffee('18');
              setRatio('16');
              setWater('288');
              setMode('coffee-to-water');
            }}
            className="text-xs text-link hover:underline font-bold"
          >
            Reset Engine
          </button>
        </div>
      </div>
    </div>
  );
}
