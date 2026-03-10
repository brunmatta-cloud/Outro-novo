import { useCulto } from '@/contexts/CultoContext';
import { useCronometro } from '@/contexts/CronometroContext';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import {
  Plus, Minus, Zap, ZapOff, MessageSquare, Timer, Settings2, Send, EyeOff, Type, Palette
} from 'lucide-react';

const colorInputClass = 'h-11 w-full rounded-lg border border-border bg-muted px-2 py-1 cursor-pointer';

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm text-muted-foreground block">{label}</label>
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className={colorInputClass} />
      <span className="text-xs font-mono text-muted-foreground uppercase">{value}</span>
    </div>
  </div>
);

const CronometroControle = () => {
  const { momentos, currentIndex, momentElapsedSeconds, culto, adjustCurrentMomentDuration } = useCulto();
  const {
    isBlinking,
    toggleBlink,
    message,
    setMessage,
    showMessage,
    setShowMessage,
    orangeThreshold,
    redThreshold,
    setOrangeThreshold,
    setRedThreshold,
    topFontSize,
    bottomFontSize,
    timerFontSize,
    messageFontSize,
    setTopFontSize,
    setBottomFontSize,
    setTimerFontSize,
    setMessageFontSize,
    backgroundColor,
    timerTextColor,
    topTextColor,
    bottomTextColor,
    messageTextColor,
    warningColor,
    dangerColor,
    setBackgroundColor,
    setTimerTextColor,
    setTopTextColor,
    setBottomTextColor,
    setMessageTextColor,
    setWarningColor,
    setDangerColor,
  } = useCronometro();

  const [msgDraft, setMsgDraft] = useState('');

  if (!culto || typeof currentIndex !== 'number' || typeof momentElapsedSeconds !== 'number') {
    return (
      <div className="p-6 space-y-4">
        <div className="glass-card p-4">
          <p className="text-muted-foreground">Carregando controle do cronometro...</p>
        </div>
      </div>
    );
  }

  const currentMoment = currentIndex >= 0 ? momentos[currentIndex] : null;
  const baseDurationSec = currentMoment ? currentMoment.duracao * 60 : 0;
  const remainingSeconds = Math.max(0, baseDurationSec - momentElapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isDanger = remainingSeconds <= redThreshold && !!currentMoment;
  const isWarning = !isDanger && remainingSeconds <= orangeThreshold && !!currentMoment;
  const previewTimerColor = isDanger ? dangerColor : isWarning ? warningColor : timerTextColor;
  const excessSeconds = currentMoment && currentMoment.duracaoOriginal != null
    ? Math.round((currentMoment.duracao - currentMoment.duracaoOriginal) * 60)
    : 0;

  const sendMessage = () => {
    if (!msgDraft.trim()) return;
    setMessage(msgDraft.trim());
    setShowMessage(true);
    setMsgDraft('');
  };

  const clearMessage = () => {
    setShowMessage(false);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Timer className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">Controle do Cronometro</h1>
            <p className="text-muted-foreground text-sm">{culto.nome}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 text-center overflow-hidden" style={{ background: backgroundColor }}>
        <p
          className="uppercase tracking-wider mb-2 truncate"
          style={{
            color: topTextColor,
            fontSize: `clamp(1rem, 4vw, ${topFontSize}rem)`,
          }}
        >
          {currentMoment ? `${currentMoment.bloco} — ${currentMoment.atividade}` : 'Nenhum momento em execucao'}
        </p>
        {showMessage && message ? (
          <p
            className="font-display font-bold break-words"
            style={{
              color: messageTextColor,
              fontSize: `clamp(2rem, 8vw, ${messageFontSize}rem)`,
            }}
          >
            {message}
          </p>
        ) : (
          <>
            <div
              className={`font-mono font-bold ${isBlinking ? 'cronometro-blink' : ''}`}
              style={{
                color: previewTimerColor,
                fontSize: `clamp(5rem, 18vw, ${timerFontSize}rem)`,
                lineHeight: 1,
              }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            {currentMoment && (
              <p
                className="mt-2"
                style={{
                  color: bottomTextColor,
                  fontSize: `clamp(1rem, 3vw, ${bottomFontSize}rem)`,
                }}
              >
                {currentMoment.responsavel}
              </p>
            )}
          </>
        )}
        {excessSeconds !== 0 && (
          <p className="text-sm mt-3 font-semibold" style={{ color: excessSeconds > 0 ? warningColor : '#22c55e' }}>
            Ajuste: {excessSeconds > 0 ? '+' : ''}{excessSeconds}s
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Timer className="w-4 h-4" /> Ajuste de Tempo
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => adjustCurrentMomentDuration(-60)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors font-semibold">
              <Minus className="w-4 h-4" /> 1 min
            </button>
            <button type="button" onClick={() => adjustCurrentMomentDuration(60)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[hsl(var(--status-completed)/0.2)] text-[hsl(var(--status-completed))] hover:bg-[hsl(var(--status-completed)/0.3)] transition-colors font-semibold">
              <Plus className="w-4 h-4" /> 1 min
            </button>
            <button type="button" onClick={() => adjustCurrentMomentDuration(-30)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm">
              <Minus className="w-4 h-4" /> 30s
            </button>
            <button type="button" onClick={() => adjustCurrentMomentDuration(30)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[hsl(var(--status-completed)/0.1)] text-[hsl(var(--status-completed))] hover:bg-[hsl(var(--status-completed)/0.2)] transition-colors text-sm">
              <Plus className="w-4 h-4" /> 30s
            </button>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Piscar
          </h3>
          <button
            type="button"
            onClick={toggleBlink}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              isBlinking
                ? 'bg-[hsl(var(--status-alert))] text-[hsl(var(--status-alert-foreground))]'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {isBlinking ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {isBlinking ? 'Parar de Piscar' : 'Piscar Cronometro'}
          </button>
        </div>

        <div className="glass-card p-5 xl:col-span-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Mensagem no Cronometro
          </h3>
          {showMessage ? (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-primary/20" style={{ background: `${backgroundColor}cc` }}>
                <p className="text-sm text-muted-foreground mb-1">Mensagem exibida:</p>
                <p style={{ color: messageTextColor, fontSize: `${Math.min(messageFontSize, 6)}rem` }} className="font-display font-bold break-words">
                  {message}
                </p>
              </div>
              <button type="button" onClick={clearMessage} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors font-semibold">
                <EyeOff className="w-4 h-4" /> Remover Mensagem
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={msgDraft}
                  onChange={(event) => setMsgDraft(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                  placeholder="Digite a mensagem..."
                  className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!msgDraft.trim()}
                  className="px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Limites de Cor
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Amarelo em: {orangeThreshold}s</label>
              <Slider value={[orangeThreshold]} onValueChange={([value]) => setOrangeThreshold(value)} min={10} max={600} step={5} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Vermelho em: {redThreshold}s</label>
              <Slider value={[redThreshold]} onValueChange={([value]) => setRedThreshold(value)} min={5} max={300} step={5} />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Type className="w-4 h-4" /> Tamanho das Fontes
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Momento: {topFontSize.toFixed(1)}rem</label>
              <Slider value={[topFontSize]} onValueChange={([value]) => setTopFontSize(value)} min={1.25} max={8} step={0.25} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Cronometro: {timerFontSize.toFixed(1)}rem</label>
              <Slider value={[timerFontSize]} onValueChange={([value]) => setTimerFontSize(value)} min={6} max={40} step={0.5} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Responsavel: {bottomFontSize.toFixed(1)}rem</label>
              <Slider value={[bottomFontSize]} onValueChange={([value]) => setBottomFontSize(value)} min={1} max={6} step={0.25} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Mensagem: {messageFontSize.toFixed(1)}rem</label>
              <Slider value={[messageFontSize]} onValueChange={([value]) => setMessageFontSize(value)} min={2} max={24} step={0.5} />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 xl:col-span-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Cores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <ColorField label="Cor de fundo" value={backgroundColor} onChange={setBackgroundColor} />
            <ColorField label="Cor do cronometro" value={timerTextColor} onChange={setTimerTextColor} />
            <ColorField label="Cor do momento" value={topTextColor} onChange={setTopTextColor} />
            <ColorField label="Cor do responsavel" value={bottomTextColor} onChange={setBottomTextColor} />
            <ColorField label="Cor da mensagem" value={messageTextColor} onChange={setMessageTextColor} />
            <ColorField label="Cor do amarelo" value={warningColor} onChange={setWarningColor} />
            <ColorField label="Cor do vermelho" value={dangerColor} onChange={setDangerColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronometroControle;
