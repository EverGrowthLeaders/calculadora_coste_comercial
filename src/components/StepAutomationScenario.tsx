import type { CalculatorInputs } from '../types';
import { SliderInput } from './SliderInput';

interface StepAutomationScenarioProps {
  inputs: CalculatorInputs;
  onChange: (updates: Partial<CalculatorInputs>) => void;
}

export function StepAutomationScenario({ inputs, onChange }: StepAutomationScenarioProps) {
  // Validate: improved no-show should be ≤ current no-show
  const noShowWarning =
    inputs.improvedNoShowRate > inputs.currentNoShowRate
      ? 'La tasa estimada con recordatorios no debería ser mayor que la actual. Se ajustará automáticamente.'
      : undefined;

  // Auto-adjust if needed
  const handleImprovedNoShowChange = (v: number) => {
    onChange({ improvedNoShowRate: Math.min(v, inputs.currentNoShowRate) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-1">Automatización parcial y mejoras esperadas</h2>
        <p className="text-sm text-text-secondary">
          No hace falta automatizarlo todo. Estima qué parte del proceso podría mejorar con un sistema de IA.
        </p>
      </div>

      {/* Section: Automation scope */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-navy-500" />
          <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider">Alcance de la automatización</h3>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            ¿Qué parte del primer contacto quieres automatizar?
          </label>
          <p className="text-xs text-text-secondary mb-3">
            Selecciona el nivel de profundidad que deseas que alcance el sistema de IA.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Añadir al CRM + Primer mensaje', value: 0.1 },
              { label: 'Extracción de datos y cualificación', value: 0.5 },
              { label: 'Agendamiento', value: 0.8 },
              { label: 'Seguimientos', value: 1.0 },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => onChange({ automationShare: option.value, briefingCoverage: option.value })}
                className={`p-4 text-left border rounded-xl transition-all duration-200 ${
                  inputs.automationShare === option.value
                    ? 'bg-cyan-50 border-cyan-400 shadow-sm shadow-cyan-100'
                    : 'bg-white border-navy-100 hover:border-cyan-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${inputs.automationShare === option.value ? 'text-navy-900' : 'text-text-primary'}`}>
                    {option.label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${inputs.automationShare === option.value ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'}`}>
                    {option.value * 100}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section: Speed to lead */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-magenta-500" />
          <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider">Speed to lead</h3>
        </div>

        <SliderInput
          id="speed-to-lead-lift"
          label="Mejora estimada por responder y cualificar antes"
          helper={`Se aplica solo a la parte de leads que decidas automatizar (${Math.round(inputs.automationShare * 100)}%). La tasa pasaría del ${Math.round(inputs.currentAppointmentRate * 100)}% al ${Math.round(Math.min(inputs.currentAppointmentRate + inputs.speedToLeadLiftPP, 1) * 100)}% en esos leads.`}
          value={inputs.speedToLeadLiftPP}
          onChange={(v) => onChange({ speedToLeadLiftPP: v })}
          min={0}
          max={0.25}
          step={0.01}
          displayValue={`+${Math.round(inputs.speedToLeadLiftPP * 100)} pts`}
        />
      </div>

      {/* Section: No-show */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-magenta-500 to-magenta-300" />
          <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider">Recordatorios y no-show</h3>
        </div>

        <SliderInput
          id="improved-noshow"
          label="No-show estimado con recordatorios value-based"
          helper={`Debe ser menor o igual que la tasa actual (${Math.round(inputs.currentNoShowRate * 100)}%).`}
          value={inputs.improvedNoShowRate}
          onChange={handleImprovedNoShowChange}
          min={0}
          max={Math.max(inputs.currentNoShowRate, 0.01)}
          step={0.01}
          displayValue={`${Math.round(inputs.improvedNoShowRate * 100)}%`}
          warning={noShowWarning}
        />
      </div>

      {/* Section: Briefing IA */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-navy-500 to-navy-300" />
          <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider">Briefing IA para el comercial</h3>
        </div>

        <SliderInput
          id="briefing-coverage"
          label="¿Qué parte de las llamadas llegaría con resumen previo para el comercial?"
          helper="Resumen de perfil, dolor, urgencia, objeciones probables y mejor ángulo de conversación."
          value={inputs.briefingCoverage}
          onChange={(v) => onChange({ briefingCoverage: v })}
          min={0}
          max={1}
          step={0.05}
          displayValue={`${Math.round(inputs.briefingCoverage * 100)}%`}
        />

        <SliderInput
          id="close-rate-lift"
          label="Mejora estimada en cierre por llegar con contexto"
          helper="No cambia el producto ni el comercial. Solo estima el impacto de llegar mejor preparado."
          value={inputs.closeRateLiftPP}
          onChange={(v) => onChange({ closeRateLiftPP: v })}
          min={0}
          max={0.20}
          step={0.01}
          displayValue={`+${Math.round(inputs.closeRateLiftPP * 100)} pts`}
        />
      </div>
    </div>
  );
}
