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
  // ... (same as before)
];

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
  const [totalCoffee, setTotalCoffee] = useState(initialTotalCoffee);
  
  // Initialize method based on props
  const getInitialMethod = () => {
    if (customSteps) {
      return {
        id: 'custom',
        name: methodName || 'Custom Brew',
        steps: customSteps
      };
    }
    return BREW_METHODS.find(m => m.id === initialMethodId) || BREW_METHODS[0];
  };

  const [selectedMethod, setSelectedMethod] = useState<Method>(getInitialMethod());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedMethod.steps[0].duration);
  // ... rest of state
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/beep.mp3'); // Assuming beep.mp3 exists or we use a fallback
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

  const playNotification = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    if (notificationsEnabled && 'Notification' in window) {
      new Notification('Next Brew Step!', {
        body: `Move to: ${selectedMethod.steps[currentStepIndex + 1]?.title || 'Enjoy!'}`,
        icon: '/favicon.svg'
      });
    }
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [soundEnabled, notificationsEnabled, selectedMethod, currentStepIndex]);

  // Main Timer Loop (Accurate when backgrounded)
  useEffect(() => {
    let animationFrame: number;

    const tick = () => {
      if (isActive && startTimeRef.current !== null) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const newTimeLeft = Math.max(0, selectedMethod.steps[currentStepIndex].duration - elapsed);

        if (newTimeLeft !== timeLeft) {
          setTimeLeft(newTimeLeft);
        }

        if (newTimeLeft === 0) {
          if (currentStepIndex < selectedMethod.steps.length - 1) {
            playNotification();
            const nextIdx = currentStepIndex + 1;
            setCurrentStepIndex(nextIdx);
            startTimeRef.current = Date.now();
            setTimeLeft(selectedMethod.steps[nextIdx].duration);
          } else {
            setIsActive(false);
            setIsFinished(true);
            playNotification();
          }
        }
      }
      animationFrame = requestAnimationFrame(tick);
    };

    if (isActive) {
      animationFrame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, currentStepIndex, selectedMethod, timeLeft, playNotification]);

  const toggleTimer = () => {
    if (!isActive) {
      startTimeRef.current = Date.now() - (pausedTimeRef.current * 1000);
    } else {
      pausedTimeRef.current = selectedMethod.steps[currentStepIndex].duration - timeLeft;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setCurrentStepIndex(0);
    setTimeLeft(selectedMethod.steps[0].duration);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  const nextStep = () => {
    if (currentStepIndex < selectedMethod.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setTimeLeft(selectedMethod.steps[nextIdx].duration);
      if (isActive) startTimeRef.current = Date.now();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setTimeLeft(selectedMethod.steps[prevIdx].duration);
      if (isActive) startTimeRef.current = Date.now();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalBrewTime = selectedMethod.steps.reduce((acc, step) => acc + step.duration, 0);
  const remainingTotalTime = selectedMethod.steps.slice(currentStepIndex + 1).reduce((acc, step) => acc + step.duration, 0) + timeLeft;
  const currentStep = selectedMethod.steps[currentStepIndex];
  const progress = ((currentStep.duration - timeLeft) / currentStep.duration) * 100;

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
                resetTimer();
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
            <span className="text-sm font-bold text-foreground">{selectedMethod.name}</span>
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
                  Step {currentStepIndex + 1} of {selectedMethod.steps.length} • {currentStep.title}
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
                  disabled={currentStepIndex === selectedMethod.steps.length - 1}
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
              style={{ width: `${((totalBrewTime - remainingTotalTime) / totalBrewTime) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Timeline Steps Preview */}
      <div className="grid grid-cols-1 gap-2">
        {selectedMethod.steps.map((step, idx) => (
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
