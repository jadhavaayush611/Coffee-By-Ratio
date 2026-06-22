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
  title?: string;
  description?: string;
}

export default function BrewTimer({ 
  steps: customSteps, 
  totalCoffee,
  initialMethodId = 'v60',
  methodName,
  title = "Interactive Brew Assistant",
  description = "Adjust your coffee weight and the timer will guide you through each step."
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
  const maxTargetWater = steps.reduce((max, step) => (step.targetWater && step.targetWater > max ? step.targetWater : max), 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start w-full">
        {/* Left Panel */}
        <div className="flex flex-col gap-6 w-full min-w-0">
          {/* 1. Assistant Header Card */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {title}
              </h2>
              <p className="text-sm md:text-base text-body leading-relaxed">
                {description}
              </p>
            </div>
            {!customSteps && (
              <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar pt-2">
                {BREW_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMethod(m);
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
          </div>

          {/* 2. Active Step Card */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between min-w-0 w-full relative">
            {/* Settings buttons (Sound / Notification) at top-right */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg hover:bg-muted-background text-muted hover:text-foreground transition-colors"
                aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button 
                onClick={requestNotificationPermission}
                className={`p-2 rounded-lg hover:bg-muted-background transition-colors ${notificationsEnabled ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
              >
                {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
            </div>

            <div className="flex-1 space-y-4 w-full text-center md:text-left pt-6 md:pt-0">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-2 block">
                  {isFinished ? 'Brew Complete' : `Step ${currentStepIndex + 1} of ${steps.length}`}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {isFinished ? 'Brew Complete!' : currentStep.title}
                </h3>
                <p className="text-sm md:text-base text-body leading-relaxed">
                  {isFinished ? 'Your coffee is ready to pour and enjoy.' : currentStep.description}
                </p>
              </div>

              {!isFinished && currentStep.targetWater && (
                <div className="flex items-center justify-center md:justify-start gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 mx-auto md:mx-0 max-w-max">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Target Water: {currentStep.targetWater}g
                  </span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex flex-col items-center justify-center">
              {isFinished ? (
                <div className="w-48 h-48 bg-success/10 text-success rounded-full flex items-center justify-center shadow-inner border border-success/20 animate-in fade-in zoom-in duration-500">
                  <CheckCircle2 size={64} aria-hidden="true" />
                </div>
              ) : (
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-muted-background"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={502.65}
                      strokeDashoffset={502.65 - (502.65 * progress) / 100}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-300 ease-linear drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold font-mono tracking-tighter text-foreground tabular-nums">
                      {formatTime(timeLeft)}
                    </span>
                    <div className="mt-1 flex items-center gap-1 text-muted">
                      <TimerIcon size={10} aria-hidden="true" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">{formatTime(remainingTotalTime)} Left</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Controls Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center w-full">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-4 block">
              Controls
            </span>
            <div className="flex items-center justify-center gap-6">
              {/* Reset Sequence */}
              <button 
                onClick={resetTimer}
                disabled={currentStepIndex === 0 && timeLeft === (steps[0]?.duration || 60) && !isActive && !isFinished}
                className="p-4 rounded-full bg-card border border-border text-muted hover:text-foreground hover:border-foreground/20 disabled:opacity-30 transition-all shadow-sm"
                aria-label="Reset sequence"
                title="Reset Sequence"
              >
                <RotateCcw size={20} />
              </button>

              {/* Previous Step */}
              <button 
                onClick={prevStep}
                disabled={currentStepIndex === 0 || isFinished}
                className="p-4 rounded-full bg-card border border-border text-muted hover:text-foreground hover:border-foreground/20 disabled:opacity-30 transition-all shadow-sm"
                aria-label="Previous step"
                title="Previous Step"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              {/* Play / Pause */}
              <button 
                onClick={isFinished ? resetTimer : toggleTimer} 
                className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 hover:bg-primary/90 transition-all"
                aria-label={isFinished ? "Reset timer" : isActive ? "Pause timer" : "Start timer"}
                title={isFinished ? "Reset Timer" : isActive ? "Pause" : "Start"}
              >
                {isFinished ? (
                  <RotateCcw size={24} />
                ) : isActive ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </button>

              {/* Next Step */}
              <button 
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1 || isFinished}
                className="p-4 rounded-full bg-card border border-border text-muted hover:text-foreground hover:border-foreground/20 disabled:opacity-30 transition-all shadow-sm"
                aria-label="Next step"
                title="Next Step"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>

          {/* 4. Brew Details Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-4 block">
              Brew Details
            </span>
            <div className={`grid ${totalCoffee ? 'grid-cols-4' : 'grid-cols-3'} gap-4 text-center`}>
              <div>
                <span className="text-xs text-muted block mb-1">Method</span>
                <span className="text-sm font-bold text-foreground truncate block">
                  {selectedMethod.name}
                </span>
              </div>
              {totalCoffee && (
                <div>
                  <span className="text-xs text-muted block mb-1">Coffee</span>
                  <span className="text-sm font-bold text-foreground block">
                    {totalCoffee}g
                  </span>
                </div>
              )}
              <div>
                <span className="text-xs text-muted block mb-1">Total Water</span>
                <span className="text-sm font-bold text-foreground block">
                  {maxTargetWater > 0 ? `${maxTargetWater}g` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-1">Total Time</span>
                <span className="text-sm font-bold text-foreground block">
                  {formatTime(totalBrewTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Timeline Panel */}
        <div className="w-full lg:w-[360px] shrink-0">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
              <h3 className="text-lg font-bold text-foreground">Brew Timeline</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
                {steps.length} Steps
              </span>
            </div>
            <div className="space-y-3 w-full">
              {steps.map((step, idx) => {
                const isActiveStep = idx === currentStepIndex && !isFinished;
                const isCompletedStep = idx < currentStepIndex || isFinished;
                
                let cardClass = "";
                if (isActiveStep) {
                  cardClass = "bg-primary/5 border-primary/30 shadow-md scale-[1.02] text-foreground";
                } else if (isCompletedStep) {
                  cardClass = "bg-card border-success/20 opacity-70 text-muted";
                } else {
                  cardClass = "bg-card border-border text-muted hover:border-foreground/10";
                }

                return (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all duration-300 w-full ${cardClass}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`text-xs font-mono font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isActiveStep 
                          ? 'bg-primary text-on-primary border-primary' 
                          : isCompletedStep
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-muted-background text-muted border-border'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-bold truncate ${isActiveStep ? 'text-foreground' : 'text-foreground/80'}`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted">
                          {formatTime(step.duration)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="shrink-0 ml-2">
                      {isActiveStep && (
                        <div className="text-primary animate-pulse">
                          <ChevronRight size={18} />
                        </div>
                      )}
                      {isCompletedStep && (
                        <CheckCircle2 size={18} className="text-success" />
                      )}
                      {!isActiveStep && !isCompletedStep && (
                        <div className="w-[18px]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
