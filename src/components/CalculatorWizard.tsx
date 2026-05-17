import { useState, useCallback } from 'react';
import type { CalculatorInputs } from '../types';
import { useCalculatorLogic } from '../hooks/useCalculatorLogic';
import { ProgressBar } from './ProgressBar';
import { StepBusinessBasics } from './StepBusinessBasics';
import { StepManualCost } from './StepManualCost';
import { StepAutomationScenario } from './StepAutomationScenario';
import { ResultsDashboard } from './ResultsDashboard';

const TOTAL_STEPS = 4;
const STEP_LABELS = ['Datos básicos', 'Coste manual', 'Automatización', 'Resultados'];

/** Default values matching the spec */
const defaultInputs: CalculatorInputs = {
  monthlyLeads: 150,
  ticketAverage: 3000,
  currentAppointmentRate: 0.15,
  currentNoShowRate: 0.25,
  currentCloseRate: 0.20,
  manualMinutesPerLead: 8,
  hourlyCost: 30,
  manualLeadShare: 1.0,
  automationShare: 0.60,
  speedToLeadLiftPP: 0.05,
  improvedNoShowRate: 0.15,
  briefingCoverage: 0.60, // Defaults to automationShare
  closeRateLiftPP: 0.03,
};

export function CalculatorWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const results = useCalculatorLogic(inputs);

  const handleInputChange = useCallback((updates: Partial<CalculatorInputs>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  }, []);

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep1 = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validation: required fields for final step
  const canShowResults = inputs.monthlyLeads > 0 && inputs.ticketAverage > 0;

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero Header ──────────────────────────────── */}
      <header className="hero-gradient text-white py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-cyan-200 uppercase tracking-wider">Diagnóstico gratuito</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Calcula cuánto te cuestan los leads que llegan tarde, mal filtrados o sin contexto
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Una estimación rápida para detectar si tu fuga está en el tiempo del equipo, el speed to lead, los no-shows o la calidad de las llamadas comerciales.
          </p>
        </div>
      </header>

      {/* ── Wizard Content ───────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 -mt-6 sm:-mt-8 pb-16">
        {/* Card container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-navy-900/5 border border-navy-100/30 p-6 sm:p-8 md:p-10">
          {/* Progress bar */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepLabels={STEP_LABELS}
          />

          {/* Step content with transition */}
          <div key={currentStep} className="animate-fade-in-up">
            {currentStep === 1 && (
              <StepBusinessBasics inputs={inputs} onChange={handleInputChange} />
            )}
            {currentStep === 2 && (
              <StepManualCost inputs={inputs} onChange={handleInputChange} />
            )}
            {currentStep === 3 && (
              <StepAutomationScenario inputs={inputs} onChange={handleInputChange} />
            )}
            {currentStep === 4 && (
              canShowResults ? (
                <ResultsDashboard results={results} onRecalculate={goToStep1} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-magenta-200/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-magenta-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-text-primary font-semibold mb-2">Faltan datos obligatorios</p>
                  <p className="text-sm text-text-secondary mb-6">
                    Introduce al menos los leads mensuales y el ticket medio para ver los resultados.
                  </p>
                  <button
                    onClick={goToStep1}
                    className="px-6 py-2.5 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-xl transition-smooth"
                  >
                    Volver al paso 1
                  </button>
                </div>
              )
            )}
          </div>

          {/* Navigation buttons (hidden on results step) */}
          {currentStep < TOTAL_STEPS && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-navy-50">
              <button
                id="wizard-prev-btn"
                onClick={goPrev}
                disabled={currentStep === 1}
                className="px-5 py-2.5 text-sm font-medium text-navy-500 hover:text-navy-700 hover:bg-navy-50 rounded-xl
                           transition-smooth disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                ← Anterior
              </button>
              <button
                id="wizard-next-btn"
                onClick={goNext}
                className="px-7 py-3 bg-gradient-to-r from-navy-700 to-navy-800 text-white font-semibold rounded-xl
                           hover:from-navy-600 hover:to-navy-700 transition-smooth
                           shadow-lg shadow-navy-700/20 hover:shadow-xl hover:shadow-navy-700/30
                           active:scale-[0.98] text-sm"
              >
                {currentStep === TOTAL_STEPS - 1 ? 'Ver resultados' : 'Siguiente →'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="py-8 text-center">
        <p className="text-xs text-text-muted">
          Esta calculadora ofrece una estimación orientativa. No representa una promesa de resultados.
        </p>
      </footer>
    </div>
  );
}
