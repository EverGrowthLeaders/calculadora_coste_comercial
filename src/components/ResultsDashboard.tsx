import { useState } from 'react';
import type { CalculatorResults } from '../types';
import { formatEuros, formatNumber } from '../utils/format';
import { MetricCard } from './MetricCard';
import { BreakdownBar } from './BreakdownBar';
import { LeadCaptureModal } from './LeadCaptureModal';

interface ResultsDashboardProps {
  results: CalculatorResults;
  onRecalculate: () => void;
}

// Diagnosis messages per top leakage type
const diagnosisMessages: Record<CalculatorResults['topLeakage'], { title: string; message: string }> = {
  time: {
    title: 'Carga operativa',
    message: 'Tu principal fuga parece estar en la carga operativa. No es solo el coste directo: es el foco comercial que se pierde atendiendo conversaciones repetitivas.',
  },
  speed: {
    title: 'Speed to lead',
    message: 'Tu principal fuga parece estar entre la entrada del lead y el agendamiento. Cuando la respuesta llega tarde, parte de la demanda se enfría antes de hablar con un humano.',
  },
  noshow: {
    title: 'No-shows',
    message: 'Tu principal fuga parece estar después del agendamiento. No basta con llenar el calendario si una parte relevante de las personas no aparece o llega desconectada.',
  },
  briefing: {
    title: 'Calidad de la llamada',
    message: 'Tu principal fuga parece estar en la calidad de la llamada comercial. Llegar sin contexto hace que cada llamada empiece demasiado fría y dependa demasiado de la improvisación del comercial.',
  },
};

// Icons for metric cards
const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>
);

export function ResultsDashboard({ results, onRecalculate }: ResultsDashboardProps) {
  const [showModal, setShowModal] = useState(false);
  const diagnosis = diagnosisMessages[results.topLeakage];

  const handleDownloadPdf = () => {
    import('html2pdf.js').then((html2pdf) => {
      const element = document.getElementById('results-dashboard');
      if (!element) return;
      
      const opt = {
        margin:       0.5,
        filename:     'diagnostico-costes-comerciales.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#f8fafc' },
        jsPDF:        { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };
      
      html2pdf.default().set(opt).from(element).save();
    });
  };

  return (
    <div className="space-y-10" id="results-dashboard">
      {/* ── Hero number ─────────────────────────────── */}
      <div className="text-center animate-fade-in-up">
        <p className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-3">
          Coste oculto estimado
        </p>
        <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold gradient-text leading-tight mb-2">
          {formatEuros(results.monthlyHiddenCost)}/mes
        </p>
        <p className="text-lg sm:text-xl text-text-secondary font-medium">
          Equivalente anual: <span className="font-bold text-text-primary">{formatEuros(results.annualHiddenCost)}/año</span>
        </p>
      </div>

      {/* ── Main subtitle ───────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <p className="text-base text-text-secondary leading-relaxed">
          Podrías estar dejando sobre la mesa aproximadamente <strong className="text-text-primary">{formatEuros(results.monthlyHiddenCost)}</strong> cada mes 
          entre ingresos potencialmente recuperables y capacidad operativa desperdiciada.
        </p>
      </div>

      {/* ── Four impact cards ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<ClockIcon />}
          label="Tiempo comercial recuperable"
          value={`${formatEuros(results.leakage.timeSavings)}/mes`}
          subvalue={`${formatNumber(results.improved.recoveredHours)} horas/mes`}
          color="cyan"
          delay={100}
        />
        <MetricCard
          icon={<BoltIcon />}
          label="Speed to lead"
          value={`${formatEuros(results.leakage.speedImpact)}/mes`}
          color="navy"
          delay={200}
        />
        <MetricCard
          icon={<CalendarIcon />}
          label="Reducción de no-show"
          value={`${formatEuros(results.leakage.noShowImpact)}/mes`}
          color="magenta"
          delay={300}
        />
        <MetricCard
          icon={<BrainIcon />}
          label="Briefing IA"
          value={`${formatEuros(results.leakage.briefingImpact)}/mes`}
          color="emerald"
          delay={400}
        />
      </div>

      {/* ── Breakdown bar ───────────────────────────── */}
      <div className="bg-white rounded-2xl border border-navy-100/50 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider mb-5">Desglose por fugas</h3>
        <BreakdownBar
          items={[
            { label: 'Tiempo operativo recuperable', value: results.leakage.timeSavings, color: '#00d4ff' },
            { label: 'Impacto por speed to lead', value: results.leakage.speedImpact, color: '#2a4d8a' },
            { label: 'Impacto por reducción de no-show', value: results.leakage.noShowImpact, color: '#e91e8c' },
            { label: 'Impacto por briefing comercial con IA', value: results.leakage.briefingImpact, color: '#22c55e' },
          ]}
        />
      </div>

      {/* ── Operational metrics ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-navy-100/50 p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards', opacity: 0 }}>
        <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider mb-5">Métricas operativas estimadas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-text-muted mb-1">Citas adicionales</p>
            <p className="text-2xl font-bold text-text-primary">{formatNumber(results.additionalBookedCalls, 0)}<span className="text-sm font-medium text-text-muted">/mes</span></p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Llamadas celebradas</p>
            <p className="text-2xl font-bold text-text-primary">{formatNumber(results.additionalHeldCalls, 0)}<span className="text-sm font-medium text-text-muted">/mes</span></p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Clientes adicionales</p>
            <p className="text-2xl font-bold text-text-primary">{formatNumber(results.additionalSales, 1)}<span className="text-sm font-medium text-text-muted">/mes</span></p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Horas recuperables</p>
            <p className="text-2xl font-bold text-text-primary">{formatNumber(results.improved.recoveredHours, 1)}<span className="text-sm font-medium text-text-muted">/mes</span></p>
          </div>
        </div>
      </div>

      {/* ── Situation comparison ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current situation */}
        <div className="bg-white rounded-2xl border border-navy-100/50 p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: '450ms', animationFillMode: 'forwards', opacity: 0 }}>
          <h3 className="text-sm font-bold text-navy-400 uppercase tracking-wider mb-4">Situación actual</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-navy-50">
              <span className="text-sm text-text-secondary">Citas agendadas</span>
              <span className="font-semibold text-text-primary">{formatNumber(results.current.bookedBase, 1)}/mes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-navy-50">
              <span className="text-sm text-text-secondary">Llamadas celebradas</span>
              <span className="font-semibold text-text-primary">{formatNumber(results.current.heldBase, 1)}/mes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-navy-50">
              <span className="text-sm text-text-secondary">Clientes cerrados</span>
              <span className="font-semibold text-text-primary">{formatNumber(results.current.salesBase, 1)}/mes</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-text-secondary">Ingresos estimados</span>
              <span className="font-bold text-navy-700">{formatEuros(results.current.revenueBase)}/mes</span>
            </div>
          </div>
        </div>

        {/* Improved scenario */}
        <div className="bg-gradient-to-br from-navy-50/80 to-cyan-100/20 rounded-2xl border border-cyan-200/30 p-6 shadow-sm shadow-cyan-500/10 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards', opacity: 0 }}>
          <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-wider mb-4">Con sistema parcial de IA</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-navy-100/30">
              <span className="text-sm text-text-secondary">Citas agendadas</span>
              <span className="font-semibold text-text-primary">{formatNumber(results.improved.bookedSpeed, 1)}/mes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-navy-100/30">
              <span className="text-sm text-text-secondary">Llamadas celebradas</span>
              <span className="font-semibold text-text-primary">{formatNumber(results.improved.heldNoShow, 1)}/mes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-navy-100/30">
              <span className="text-sm text-text-secondary">Clientes cerrados</span>
              <span className="font-semibold text-text-primary">{formatNumber(results.improved.salesBriefing, 1)}/mes</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-text-secondary">Ingresos estimados</span>
              <span className="font-bold text-navy-700">{formatEuros(results.improved.revenueBriefing)}/mes</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Diagnosis ───────────────────────────────── */}
      <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl animate-fade-in-up" style={{ animationDelay: '550ms', animationFillMode: 'forwards', opacity: 0 }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              Diagnóstico principal · {diagnosis.title}
            </p>
            <p className="text-white/90 leading-relaxed text-sm sm:text-base">
              {diagnosis.message}
            </p>
          </div>
        </div>
      </div>

      {/* ── Additional copy ─────────────────────────── */}
      <div className="bg-navy-50/40 rounded-2xl p-6 border border-navy-100/40 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards', opacity: 0 }}>
        <p className="text-sm text-text-secondary leading-relaxed">
          Esta estimación no pretende decirte que tengas que automatizarlo todo. De hecho, en muchos procesos high ticket lo inteligente es automatizar solo la parte repetitiva: cualificación inicial, recordatorios, seguimiento y preparación de la llamada. <strong className="text-text-primary">El equipo humano debería entrar cuando más valor aporta.</strong>
        </p>
      </div>

      {/* ── CTA Buttons ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '650ms', animationFillMode: 'forwards', opacity: 0 }} data-html2canvas-ignore>
        <button
          id="download-diagnosis-btn"
          onClick={handleDownloadPdf}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl
                     hover:from-cyan-400 hover:to-cyan-500 transition-smooth
                     shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40
                     active:scale-[0.98] text-base"
        >
          Descargar diagnóstico (PDF)
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 text-white font-semibold rounded-xl
                     hover:from-navy-600 hover:via-navy-700 hover:to-navy-800 transition-smooth
                     shadow-lg shadow-navy-800/30 hover:shadow-xl hover:shadow-navy-800/40
                     active:scale-[0.98] text-base"
        >
          Quiero ayuda para solucionarlo
        </button>
        <button
          id="recalculate-btn"
          onClick={onRecalculate}
          className="w-full sm:w-auto px-8 py-4 bg-white text-navy-700 font-semibold rounded-xl border-2 border-navy-100
                     hover:border-navy-200 hover:bg-navy-50 transition-smooth
                     active:scale-[0.98] text-base"
        >
          Recalcular con otros datos
        </button>
      </div>

      {/* ── Disclaimer ──────────────────────────────── */}
      <div className="text-center animate-fade-in" style={{ animationDelay: '700ms', animationFillMode: 'forwards', opacity: 0 }}>
        <p className="text-xs text-text-muted max-w-lg mx-auto">
          Esta calculadora ofrece una estimación orientativa basada en los datos introducidos. No representa una promesa de resultados.
        </p>
      </div>

      {/* ── Lead capture modal ──────────────────────── */}
      <LeadCaptureModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
