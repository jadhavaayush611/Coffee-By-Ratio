import React, { useState, useEffect } from 'react';
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
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>('V60');
  const [isMounted, setIsMounted] = useState(false);
  const [errors, setErrors] = useState<{ coffee?: string; water?: string; ratio?: string }>({});

  const validateField = (val: string, field: 'coffee' | 'water' | 'ratio'): string => {
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
    if (field === 'coffee' && num < 0.1) {
      return 'Min coffee is 0.1g';
    }
    if (field === 'water' && num < 0.1) {
      return 'Min water is 0.1ml';
    }
    if (field === 'ratio' && num < 1) {
      return 'Min ratio is 1 (1:1)';
    }
    return '';
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('coffee-engine-state');
    if (saved) {
      try {
        const { coffee: c, water: w, ratio: r, mode: m, selectedPresetName: spn } = JSON.parse(saved);
        const nextCoffee = c || '18';
        const nextWater = w || '288';
        const nextRatio = r || '16';

        setCoffee(nextCoffee);
        setWater(nextWater);
        setRatio(nextRatio);
        setMode(m || 'coffee-to-water');
        
        if (spn) {
          setSelectedPresetName(spn);
        } else if (r) {
          const numR = parseFloat(r);
          const matches = PRESETS.filter(p => Math.abs(p.ratio - numR) < 0.1);
          if (matches.length === 1) {
            setSelectedPresetName(matches[0].name);
          } else {
            setSelectedPresetName(null);
          }
        } else {
          setSelectedPresetName('V60');
        }

        const coffeeErr = validateField(nextCoffee, 'coffee');
        const waterErr = validateField(nextWater, 'water');
        const ratioErr = validateField(nextRatio, 'ratio');
        const initialErrors: { coffee?: string; water?: string; ratio?: string } = {};
        if (coffeeErr) initialErrors.coffee = coffeeErr;
        if (waterErr) initialErrors.water = waterErr;
        if (ratioErr) initialErrors.ratio = ratioErr;
        setErrors(initialErrors);
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('coffee-engine-state', JSON.stringify({ coffee, water, ratio, mode, selectedPresetName }));
    }
  }, [coffee, water, ratio, mode, selectedPresetName, isMounted]);

  const handleCoffeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoffee(val);
    
    const coffeeErr = validateField(val, 'coffee');
    const ratioErr = validateField(ratio, 'ratio');
    
    if (coffeeErr) {
      setErrors(prev => ({ ...prev, coffee: coffeeErr }));
      return;
    }
    
    let nextErrors = { ...errors, coffee: '' };
    
    if (!ratioErr) {
      const numC = parseFloat(val);
      const numR = parseFloat(ratio);
      const calculatedWater = (numC * numR).toFixed(1).replace(/\.0$/, '');
      setWater(calculatedWater);
      nextErrors.water = validateField(calculatedWater, 'water');
    }
    setErrors(nextErrors);
  };

  const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWater(val);
    
    const waterErr = validateField(val, 'water');
    const ratioErr = validateField(ratio, 'ratio');
    
    if (waterErr) {
      setErrors(prev => ({ ...prev, water: waterErr }));
      return;
    }
    
    let nextErrors = { ...errors, water: '' };
    
    if (!ratioErr) {
      const numW = parseFloat(val);
      const numR = parseFloat(ratio);
      const calculatedCoffee = (numW / numR).toFixed(1).replace(/\.0$/, '');
      setCoffee(calculatedCoffee);
      nextErrors.coffee = validateField(calculatedCoffee, 'coffee');
    }
    setErrors(nextErrors);
  };

  const handleRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRatio(val);
    
    const ratioErr = validateField(val, 'ratio');
    
    // Match preset
    const numVal = parseFloat(val);
    if (!isNaN(numVal)) {
      const matches = PRESETS.filter(p => Math.abs(p.ratio - numVal) < 0.1);
      if (matches.length === 1) {
        setSelectedPresetName(matches[0].name);
      } else {
        setSelectedPresetName(null);
      }
    } else {
      setSelectedPresetName(null);
    }

    if (ratioErr) {
      setErrors(prev => ({ ...prev, ratio: ratioErr }));
      return;
    }
    
    let nextErrors = { ...errors, ratio: '' };
    
    if (mode === 'coffee-to-water') {
      const coffeeErr = validateField(coffee, 'coffee');
      if (!coffeeErr) {
        const numC = parseFloat(coffee);
        const numR = parseFloat(val);
        const calculatedWater = (numC * numR).toFixed(1).replace(/\.0$/, '');
        setWater(calculatedWater);
        nextErrors.water = validateField(calculatedWater, 'water');
      }
    } else {
      const waterErr = validateField(water, 'water');
      if (!waterErr) {
        const numW = parseFloat(water);
        const numR = parseFloat(val);
        const calculatedCoffee = (numW / numR).toFixed(1).replace(/\.0$/, '');
        setCoffee(calculatedCoffee);
        nextErrors.coffee = validateField(calculatedCoffee, 'coffee');
      }
    }
    setErrors(nextErrors);
  };

  const toggleMode = () => {
    const newMode = mode === 'coffee-to-water' ? 'water-to-coffee' : 'coffee-to-water';
    setMode(newMode);
  };

  const applyPreset = (p: Preset) => {
    setSelectedPresetName(p.name);
    setRatio(p.ratio.toString());
    
    let nextErrors = { ...errors, ratio: '' };
    
    if (mode === 'coffee-to-water') {
      const coffeeErr = validateField(coffee, 'coffee');
      if (!coffeeErr) {
        const numC = parseFloat(coffee);
        const calculatedWater = (numC * p.ratio).toFixed(1).replace(/\.0$/, '');
        setWater(calculatedWater);
        nextErrors.water = validateField(calculatedWater, 'water');
      }
    } else {
      const waterErr = validateField(water, 'water');
      if (!waterErr) {
        const numW = parseFloat(water);
        const calculatedCoffee = (numW / p.ratio).toFixed(1).replace(/\.0$/, '');
        setCoffee(calculatedCoffee);
        nextErrors.coffee = validateField(calculatedCoffee, 'coffee');
      }
    }
    setErrors(nextErrors);
  };

  const getStrength = (r: number) => {
    if (errors.ratio) {
      return { label: 'Invalid Ratio', color: 'text-error-deep bg-error-soft border-error-soft/20' };
    }
    if (r <= 3) return { label: 'Extra Strong', color: 'text-error-deep bg-error-soft border-error-soft/20' };
    if (r <= 9) return { label: 'Strong', color: 'text-warning-deep bg-warning-soft border-warning-soft/20' };
    if (r <= 14) return { label: 'Intense', color: 'text-warning bg-warning-soft border-warning-soft/20' };
    if (r <= 17) return { label: 'Balanced', color: 'text-success bg-link-bg-soft/30 border-link-bg-soft/20' };
    return { label: 'Light', color: 'text-link bg-link-bg-soft/30 border-link-bg-soft/20' };
  };

  const numRatio = parseFloat(ratio) || 0;
  const strength = getStrength(numRatio);
  const currentPreset = selectedPresetName
    ? PRESETS.find(p => p.name === selectedPresetName && Math.abs(p.ratio - numRatio) < 0.1)
    : undefined;

  const hasErrors = !!(errors.coffee || errors.water || errors.ratio);

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
              min="0.1"
              inputMode="decimal"
              value={coffee}
              onChange={handleCoffeeChange}
              className={`w-full h-14 px-4 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold ${
                errors.coffee ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'
              }`}
            />
            {errors.coffee && <p className="text-[11px] text-error font-medium mt-1">{errors.coffee}</p>}
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
              min="0.1"
              inputMode="decimal"
              value={water}
              onChange={handleWaterChange}
              className={`w-full h-14 px-4 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold ${
                errors.water ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'
              }`}
            />
            {errors.water && <p className="text-[11px] text-error font-medium mt-1">{errors.water}</p>}
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
            min="1"
            inputMode="decimal"
            value={ratio}
            onChange={handleRatioChange}
            className={`w-full h-14 px-4 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold ${
              errors.ratio ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'
            }`}
          />
          {errors.ratio && <p className="text-[11px] text-error font-medium mt-1">{errors.ratio}</p>}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
                currentPreset?.name === p.name
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

        {currentPreset && !hasErrors && (
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
              setSelectedPresetName('V60');
              setErrors({});
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
