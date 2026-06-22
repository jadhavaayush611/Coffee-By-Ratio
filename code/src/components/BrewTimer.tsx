import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Bell, BellOff, Volume2, VolumeX, CheckCircle2, ChevronRight, Timer as TimerIcon } from 'lucide-react';

interface Step {
  title: string;
  duration: number; // in seconds
  description: string;
  targetWater?: number;
}

interface Method {
  id: string;
  name: string;
  steps: Step[];
}

const BREW_METHODS: Method[] = [
  {
    id: 'v60',
    name: 'Hario V60',
    steps: [
      {
        title: 'Bloom',
        duration: 45,
        description: 'Pour 50g of water. Gently stir to ensure all grounds are wet. Wait for CO2 to escape.',
        targetWater: 50
      },
      {
        title: 'First Pour',
        duration: 60,
        description: 'Pour water in circular motions up to 150g. Keep the stream steady.',
        targetWater: 150
      },
      {
        title: 'Second Pour',
        duration: 45,
        description: 'Pour remaining water up to 250g. Gently swirl the brewer for a flat bed.',
        targetWater: 250
      },
      {
        title: 'Drawdown',
        duration: 60,
        description: 'Let the water filter through completely. Aim for a total time of 3:00 - 3:30.',
      }
    ]
  },
  {
    id: 'chemex',
    name: 'Chemex',
    steps: [
      {
        title: 'Bloom',
        duration: 45,
        description: 'Gently pour 70g of water. Wait for CO2 to escape.',
        targetWater: 70
      },
      {
        title: 'First Pour',
        duration: 75,
        description: 'Pour in slow, steady spirals up to 270g.',
        targetWater: 270
      },
      {
        title: 'Final Pour',
        duration: 60,
        description: 'Continue adding water in gentle spirals up to 500g.',
        targetWater: 500
      },
      {
        title: 'Drawdown',
        duration: 120,
        description: 'Allow water to filter through completely. Lift filter and discard.',
      }
    ]
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    steps: [
      {
        title: 'Add Coffee & Water',
        duration: 20,
        description: 'Pour 220g of hot water (80°C - 85°C) onto the grounds.',
        targetWater: 220
      },
      {
        title: 'Stir',
        duration: 10,
        description: 'Stir gently for 10 seconds to ensure all grounds are saturated.',
      },
      {
        title: 'Steep',
        duration: 60,
        description: 'Insert plunger slightly to create a vacuum seal. Wait for 1 minute.',
      },
      {
        title: 'Press',
        duration: 30,
        description: 'Press down gently and steadily until you hear a hiss. Stop at the hiss.',
      }
    ]
  },
  {
    id: 'french-press',
    name: 'French Press',
    steps: [
      {
        title: 'Initial Steep',
        duration: 240,
        description: 'Pour 450g of hot water (95°C) and let steep.',
        targetWater: 450
      },
      {
        title: 'Break Crust & Clean',
        duration: 60,
        description: 'Stir top layer gently, then scoop off and discard foam/chaff.',
      },
      {
        title: 'Settling Phase',
        duration: 300,
        description: 'Place lid on, but do not plunge. Wait for grounds to settle.',
      },
      {
        title: 'Plunge & Decant',
        duration: 30,
        description: 'Gently push plunger down. Decant immediately into cup or carafe.',
      }
    ]
  }
];

const fallbackMethod: Method = {
  id: 'fallback',
  name: 'Default Brew',
  steps: [
    {
      title: 'Brew',
      duration: 60,
      description: 'Pour water and brew your coffee.',
    }
  ]
};

interface BrewTimerProps {
  steps?: Step[];
  totalCoffee?: number;
  initialMethodId?: string;
  methodName?: string;
}

export default function BrewTimer({ 
  steps: customSteps, 
  totalCoffee: initialTotalCoffee = 15,
  initialMethodId = 'v60',
  methodName
}: BrewTimerProps) {
  
  // Initialize method based on props
  const getInitialMethod = () => {
    if (customSteps && customSteps.length > 0) {
      return {
        id: 'custom',
        name: methodName || 'Custom Brew',
        steps: customSteps
      };
    }
    const cleanId = (initialMethodId || '').toLowerCase().replace('-ratio-calculator', '').replace('hario-', '');
    const found = BREW_METHODS.find(m => m.id === cleanId || m.id === initialMethodId);
    if (found && found.steps && found.steps.length > 0) {
      return found;
    }
    if (BREW_METHODS[0] && BREW_METHODS[0].steps && BREW_METHODS[0].steps.length > 0) {
      return BREW_METHODS[0];
    }
    return fallbackMethod;
  };

  const [selectedMethod, setSelectedMethod] = useState<Method>(getInitialMethod());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const initialSteps = selectedMethod?.steps || [];
  const [timeLeft, setTimeLeft] = useState(initialSteps[0]?.duration || 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Background-resilient state refs
  const startTimeRef = useRef<number | null>(null); // absolute timestamp when the active period started
  const pausedTimeRef = useRef<number>(0); // total accumulated pause duration in ms
  const pauseStartedAtRef = useRef<number | null>(null); // timestamp when the current pause started
  const currentStepIndexRef = useRef(0);

  // Sync ref with state
  useEffect(() => {
    currentStepIndexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  // Request notifications permission on load if possible
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const playNotification = useCallback((nextIdx: number) => {
    const playSyntheticChime = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          
          // Chime 1
          const osc1 = audioCtx.createOscillator();
          const gain1 = audioCtx.createGain();
          osc1.connect(gain1);
          gain1.connect(audioCtx.destination);
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
          gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
          osc1.start(audioCtx.currentTime);
          osc1.stop(audioCtx.currentTime + 0.3);

          // Chime 2
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.12); // C6
          gain2.gain.setValueAtTime(0.1, audioCtx.currentTime + 0.12);
          gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
          osc2.start(audioCtx.currentTime + 0.12);
          osc2.stop(audioCtx.currentTime + 0.45);
        }
      } catch (e) {
        console.warn('Synthetic audio synthesis failed:', e);
      }
    };

    if (soundEnabled) {
      try {
        const audio = new Audio('/sounds/beep.mp3');
        audio.play().catch(err => {
          console.warn('Audio.play failed, falling back to synthesizer:', err);
          playSyntheticChime();
        });
      } catch (e) {
        console.warn('Audio initialization failed, falling back to synthesizer:', e);
        playSyntheticChime();
      }
    }
    if (notificationsEnabled && 'Notification' in window) {
      const steps = selectedMethod?.steps || [];
      const nextStepTitle = steps[nextIdx]?.title || 'Enjoy!';
      new Notification('Next Brew Step!', {
        body: `Move to: ${nextStepTitle}`,
        icon: '/favicon.svg'
      });
    }
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [soundEnabled, notificationsEnabled, selectedMethod]);

  const getElapsedMs = useCallback((now: number = Date.now()) => {
    if (startTimeRef.current === null) return 0;
    if (isActive) {
      return (now - startTimeRef.current) - pausedTimeRef.current;
    } else {
      const pauseStart = pauseStartedAtRef.current !== null ? pauseStartedAtRef.current : now;
      return (pauseStart - startTimeRef.current) - pausedTimeRef.current;
    }
  }, [isActive]);

  const setElapsedTime = (offsetSeconds: number) => {
    const now = Date.now();
    startTimeRef.current = now - (offsetSeconds * 1000);
    pausedTimeRef.current = 0;
    if (!isActive) {
      pauseStartedAtRef.current = now;
    }
  };

  const updateTimerState = useCallback((now = Date.now()) => {
    if (!isActive || startTimeRef.current === null) return;

    const elapsedMs = getElapsedMs(now);
    const totalElapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));

    let elapsed = 0;
    let nextStepIdx = 0;
    let nextTimeLeft = 0;
    let finished = false;

    const steps = selectedMethod?.steps || [];
    if (steps.length === 0) {
      setCurrentStepIndex(0);
      setTimeLeft(0);
      setIsActive(false);
      setIsFinished(true);
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      const stepDuration = steps[i].duration;
      if (totalElapsedSeconds < elapsed + stepDuration) {
        nextStepIdx = i;
        nextTimeLeft = (elapsed + stepDuration) - totalElapsedSeconds;
        break;
      }
      elapsed += stepDuration;
    }

    if (totalElapsedSeconds >= elapsed) {
      nextStepIdx = steps.length - 1;
      nextTimeLeft = 0;
      finished = true;
    }

    // Check if we transitioned to a new step
    if (nextStepIdx !== currentStepIndexRef.current && !finished) {
      playNotification(nextStepIdx);
    }

    setCurrentStepIndex(nextStepIdx);
    setTimeLeft(nextTimeLeft);

    if (finished) {
      setIsActive(false);
      setIsFinished(true);
      playNotification(steps.length);
    }
  }, [isActive, selectedMethod, getElapsedMs, playNotification]);

  // Main Timer loop & visibility change listener
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      updateTimerState();
    }, 100);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTimerState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, updateTimerState]);

  const toggleTimer = () => {
    const now = Date.now();
    if (!isActive) {
      if (startTimeRef.current === null) {
        // Start from beginning
        startTimeRef.current = now;
        pausedTimeRef.current = 0;
        pauseStartedAtRef.current = null;
      } else if (pauseStartedAtRef.current !== null) {
        // Resume
        const pausedDuration = now - pauseStartedAtRef.current;
        pausedTimeRef.current += pausedDuration;
        pauseStartedAtRef.current = null;
      }
      setIsActive(true);
    } else {
      // Pause
      pauseStartedAtRef.current = now;
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setCurrentStepIndex(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    pauseStartedAtRef.current = null;
    const steps = selectedMethod?.steps || [];
    setTimeLeft(steps[0]?.duration || 60);
  };

  const nextStep = () => {
    const steps = selectedMethod?.steps || [];
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const offsetSeconds = steps.slice(0, nextIdx).reduce((acc, step) => acc + step.duration, 0);
      setElapsedTime(offsetSeconds);
      setCurrentStepIndex(nextIdx);
      setTimeLeft(steps[nextIdx]?.duration || 60);
    }
  };

  const prevStep = () => {
    const steps = selectedMethod?.steps || [];
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      const offsetSeconds = steps.slice(0, prevIdx).reduce((acc, step) => acc + step.duration, 0);
      setElapsedTime(offsetSeconds);
      setCurrentStepIndex(prevIdx);
      setTimeLeft(steps[prevIdx]?.duration || 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const steps = selectedMethod?.steps || [];
  const totalBrewTime = steps.reduce((acc, step) => acc + step.duration, 0);
  const remainingTotalTime = steps.slice(currentStepIndex + 1).reduce((acc, step) => acc + step.duration, 0) + timeLeft;
  const currentStep = steps[currentStepIndex] || { title: 'Brewing', duration: 60, description: 'Enjoy your brew!' };
  const progress = currentStep.duration > 0 ? ((currentStep.duration - timeLeft) / currentStep.duration) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Method Selector */}
      {!customSteps && (
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          {BREW_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMethod(m);
                // Reset timer for selected method directly
                setIsActive(false);
                setIsFinished(false);
                setCurrentStepIndex(0);
                startTimeRef.current = null;
                pausedTimeRef.current = 0;
                pauseStartedAtRef.current = null;
                setTimeLeft(m.steps?.[0]?.duration || 60);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                selectedMethod.id === m.id
                  ? 'bg-primary text-on-primary border-primary shadow-md'
                  : 'bg-card text-muted border-border hover:border-hairline-strong'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Status Bar */}
        <div className="px-6 py-4 bg-background border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TimerIcon size={18} className="text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-foreground">{selectedMethod?.name || 'Coffee Brew'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-muted-background text-muted transition-colors"
              aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button 
              onClick={requestNotificationPermission}
              className={`p-2 rounded-lg hover:bg-muted-background transition-colors ${notificationsEnabled ? 'text-primary' : 'text-muted'}`}
              aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
            >
              {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="p-8 text-center" aria-live="polite">
          {isFinished ? (
            <div className="py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-link-bg-soft/30 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-link-bg-soft/20">
                <CheckCircle2 size={40} aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Brew Complete!</h2>
              <p className="text-sm text-body mb-8">Ready to pour and enjoy.</p>
              <button onClick={resetTimer} className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:translate-y-[-1px] active:translate-y-[0] transition-all">
                Reset Timer
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-2 block">
                  Step {currentStepIndex + 1} of {steps.length} • {currentStep.title}
                </span>
                <p className="text-sm text-foreground font-medium max-w-[280px] mx-auto leading-relaxed mb-2">
                  {currentStep.description}
                </p>
                {currentStep.targetWater && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Target: {currentStep.targetWater}g</span>
                  </div>
                )}
              </div>

              {/* Circular Progress */}
              <div className="relative w-56 h-56 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
                  <circle
                    cx="112"
                    cy="112"
                    r="104"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-muted-background"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="104"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={653.45}
                    strokeDashoffset={653.45 - (653.45 * progress) / 100}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-300 ease-linear drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-bold font-mono tracking-tighter text-foreground tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                  <div className="mt-2 flex items-center gap-2 text-muted">
                    <TimerIcon size={12} aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{formatTime(remainingTotalTime)} Left</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="p-4 rounded-2xl bg-card border border-border text-muted hover:text-foreground disabled:opacity-30 transition-all"
                  aria-label="Previous step"
                >
                  <SkipBack size={24} fill="currentColor" />
                </button>

                <button 
                  onClick={toggleTimer} 
                  className="w-20 h-20 rounded-3xl bg-primary text-on-primary flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                  aria-label={isActive ? "Pause timer" : "Start timer"}
                >
                  {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <button 
                  onClick={nextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  className="p-4 rounded-2xl bg-card border border-border text-muted hover:text-foreground disabled:opacity-30 transition-all"
                  aria-label="Next step"
                >
                  <SkipForward size={24} fill="currentColor" />
                </button>
              </div>

              <button 
                onClick={resetTimer}
                className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-primary transition-colors flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={12} aria-hidden="true" /> Reset Sequence
              </button>
            </>
          )}
        </div>

        {/* Global Progress Bar */}
        {!isFinished && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-muted-background">
            <div 
              className="h-full bg-primary/30 transition-all duration-1000"
              style={{ width: `${totalBrewTime > 0 ? ((totalBrewTime - remainingTotalTime) / totalBrewTime) * 100 : 0}%` }}
            />
          </div>
        )}
      </div>

      {/* Timeline Steps Preview */}
      <div className="grid grid-cols-1 gap-2">
        {steps.map((step, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              idx === currentStepIndex 
                ? 'bg-primary/5 border-primary/20 scale-[1.02]' 
                : idx < currentStepIndex 
                ? 'bg-card opacity-40 border-border grayscale'
                : 'bg-card border-border'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center border ${
                idx === currentStepIndex ? 'bg-primary text-on-primary border-primary' : 'bg-muted-background text-muted border-border'
              }`}>
                {idx + 1}
              </span>
              <div>
                <h4 className="text-xs font-bold text-foreground">{step.title}</h4>
                <p className="text-[10px] text-muted">{formatTime(step.duration)} duration</p>
              </div>
            </div>
            {idx === currentStepIndex && <div className="text-primary"><ChevronRight size={16} /></div>}
            {idx < currentStepIndex && <CheckCircle2 size={16} className="text-success" />}
          </div>
        ))}
      </div>
    </div>
  );
}
