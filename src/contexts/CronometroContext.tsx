import React, { createContext, useContext, useState, useCallback, useEffect, useRef, memo } from 'react';

interface CronometroContextType {
  timeAdjustment: number;
  addTime: (seconds: number) => void;
  resetAdjustment: () => void;
  isBlinking: boolean;
  toggleBlink: () => void;
  setBlinking: (value: boolean) => void;
  message: string;
  setMessage: (msg: string) => void;
  showMessage: boolean;
  setShowMessage: (value: boolean) => void;
  orangeThreshold: number;
  redThreshold: number;
  setOrangeThreshold: (seconds: number) => void;
  setRedThreshold: (seconds: number) => void;
  topFontSize: number;
  bottomFontSize: number;
  timerFontSize: number;
  messageFontSize: number;
  backgroundColor: string;
  timerTextColor: string;
  topTextColor: string;
  bottomTextColor: string;
  messageTextColor: string;
  warningColor: string;
  dangerColor: string;
  setTopFontSize: (size: number) => void;
  setBottomFontSize: (size: number) => void;
  setTimerFontSize: (size: number) => void;
  setMessageFontSize: (size: number) => void;
  setBackgroundColor: (color: string) => void;
  setTimerTextColor: (color: string) => void;
  setTopTextColor: (color: string) => void;
  setBottomTextColor: (color: string) => void;
  setMessageTextColor: (color: string) => void;
  setWarningColor: (color: string) => void;
  setDangerColor: (color: string) => void;
}

const STORAGE_KEY = 'culto-ao-vivo:cronometro-settings';

const defaultSettings = {
  isBlinking: false,
  orangeThreshold: 120,
  redThreshold: 20,
  topFontSize: 4,
  bottomFontSize: 2.75,
  timerFontSize: 28,
  messageFontSize: 16,
  backgroundColor: '#000000',
  timerTextColor: '#ffffff',
  topTextColor: '#b8c0d4',
  bottomTextColor: '#99a2b3',
  messageTextColor: '#ffffff',
  warningColor: '#f59e0b',
  dangerColor: '#ef4444',
  message: '',
  showMessage: false,
};

const isValidHexColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value);

const readStoredState = () => {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<typeof defaultSettings>;
    return {
      isBlinking: Boolean(parsed.isBlinking),
      orangeThreshold: typeof parsed.orangeThreshold === 'number' ? Math.max(10, Math.min(600, parsed.orangeThreshold)) : defaultSettings.orangeThreshold,
      redThreshold: typeof parsed.redThreshold === 'number' ? Math.max(5, Math.min(300, parsed.redThreshold)) : defaultSettings.redThreshold,
      topFontSize: typeof parsed.topFontSize === 'number' ? Math.max(1.25, Math.min(8, parsed.topFontSize)) : defaultSettings.topFontSize,
      bottomFontSize: typeof parsed.bottomFontSize === 'number' ? Math.max(1, Math.min(6, parsed.bottomFontSize)) : defaultSettings.bottomFontSize,
      timerFontSize: typeof parsed.timerFontSize === 'number' ? Math.max(6, Math.min(40, parsed.timerFontSize)) : defaultSettings.timerFontSize,
      messageFontSize: typeof parsed.messageFontSize === 'number' ? Math.max(2, Math.min(24, parsed.messageFontSize)) : defaultSettings.messageFontSize,
      backgroundColor: isValidHexColor(parsed.backgroundColor || '') ? parsed.backgroundColor! : defaultSettings.backgroundColor,
      timerTextColor: isValidHexColor(parsed.timerTextColor || '') ? parsed.timerTextColor! : defaultSettings.timerTextColor,
      topTextColor: isValidHexColor(parsed.topTextColor || '') ? parsed.topTextColor! : defaultSettings.topTextColor,
      bottomTextColor: isValidHexColor(parsed.bottomTextColor || '') ? parsed.bottomTextColor! : defaultSettings.bottomTextColor,
      messageTextColor: isValidHexColor(parsed.messageTextColor || '') ? parsed.messageTextColor! : defaultSettings.messageTextColor,
      warningColor: isValidHexColor(parsed.warningColor || '') ? parsed.warningColor! : defaultSettings.warningColor,
      dangerColor: isValidHexColor(parsed.dangerColor || '') ? parsed.dangerColor! : defaultSettings.dangerColor,
      message: typeof parsed.message === 'string' ? parsed.message : defaultSettings.message,
      showMessage: Boolean(parsed.showMessage),
    };
  } catch (error) {
    console.error('Falha ao ler configuracoes do cronometro:', error);
    return defaultSettings;
  }
};

const CronometroContext = createContext<CronometroContextType | null>(null);

export const CronometroProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [timeAdjustment, setTimeAdjustment] = useState(0);
  const [state, setState] = useState(readStoredState);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 80);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state]);

  const updateState = useCallback((patch: Partial<typeof defaultSettings>) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  const addTime = useCallback((seconds: number) => setTimeAdjustment((prev) => prev + seconds), []);
  const resetAdjustment = useCallback(() => setTimeAdjustment(0), []);
  const toggleBlink = useCallback(() => updateState({ isBlinking: !state.isBlinking }), [state.isBlinking, updateState]);
  const setBlinking = useCallback((value: boolean) => updateState({ isBlinking: value }), [updateState]);
  const setMessage = useCallback((msg: string) => updateState({ message: msg }), [updateState]);
  const setShowMessage = useCallback((value: boolean) => updateState({ showMessage: value }), [updateState]);
  const setOrangeThreshold = useCallback((seconds: number) => updateState({ orangeThreshold: seconds }), [updateState]);
  const setRedThreshold = useCallback((seconds: number) => updateState({ redThreshold: seconds }), [updateState]);
  const setTopFontSize = useCallback((size: number) => updateState({ topFontSize: size }), [updateState]);
  const setBottomFontSize = useCallback((size: number) => updateState({ bottomFontSize: size }), [updateState]);
  const setTimerFontSize = useCallback((size: number) => updateState({ timerFontSize: size }), [updateState]);
  const setMessageFontSize = useCallback((size: number) => updateState({ messageFontSize: size }), [updateState]);
  const setBackgroundColor = useCallback((color: string) => updateState({ backgroundColor: color }), [updateState]);
  const setTimerTextColor = useCallback((color: string) => updateState({ timerTextColor: color }), [updateState]);
  const setTopTextColor = useCallback((color: string) => updateState({ topTextColor: color }), [updateState]);
  const setBottomTextColor = useCallback((color: string) => updateState({ bottomTextColor: color }), [updateState]);
  const setMessageTextColor = useCallback((color: string) => updateState({ messageTextColor: color }), [updateState]);
  const setWarningColor = useCallback((color: string) => updateState({ warningColor: color }), [updateState]);
  const setDangerColor = useCallback((color: string) => updateState({ dangerColor: color }), [updateState]);

  const value = React.useMemo<CronometroContextType>(() => ({
    timeAdjustment,
    addTime,
    resetAdjustment,
    isBlinking: state.isBlinking,
    toggleBlink,
    setBlinking,
    message: state.message,
    setMessage,
    showMessage: state.showMessage,
    setShowMessage,
    orangeThreshold: state.orangeThreshold,
    redThreshold: state.redThreshold,
    setOrangeThreshold,
    setRedThreshold,
    topFontSize: state.topFontSize,
    bottomFontSize: state.bottomFontSize,
    timerFontSize: state.timerFontSize,
    messageFontSize: state.messageFontSize,
    backgroundColor: state.backgroundColor,
    timerTextColor: state.timerTextColor,
    topTextColor: state.topTextColor,
    bottomTextColor: state.bottomTextColor,
    messageTextColor: state.messageTextColor,
    warningColor: state.warningColor,
    dangerColor: state.dangerColor,
    setTopFontSize,
    setBottomFontSize,
    setTimerFontSize,
    setMessageFontSize,
    setBackgroundColor,
    setTimerTextColor,
    setTopTextColor,
    setBottomTextColor,
    setMessageTextColor,
    setWarningColor,
    setDangerColor,
  }), [
    timeAdjustment,
    addTime,
    resetAdjustment,
    state,
    toggleBlink,
    setBlinking,
    setMessage,
    setShowMessage,
    setOrangeThreshold,
    setRedThreshold,
    setTopFontSize,
    setBottomFontSize,
    setTimerFontSize,
    setMessageFontSize,
    setBackgroundColor,
    setTimerTextColor,
    setTopTextColor,
    setBottomTextColor,
    setMessageTextColor,
    setWarningColor,
    setDangerColor,
  ]);

  return <CronometroContext.Provider value={value}>{children}</CronometroContext.Provider>;
});

CronometroProvider.displayName = 'CronometroProvider';

export const useCronometro = () => {
  const ctx = useContext(CronometroContext);
  if (!ctx) throw new Error('useCronometro must be used within CronometroProvider');
  return ctx;
};
