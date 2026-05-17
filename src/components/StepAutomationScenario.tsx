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

        <SliderInput
          id="automation-share"
          label="¿Qué parte del primer contacto quieres automatizar?"
          helper="No hace falta automatizarlo todo. Puedes estimar solo la parte repetitiva: primeras llamadas, cualificación básica, WhatsApps iniciales o leads fuera de horario."
          value={inputs.automationShare}
          onChange={(v) => {
            onChange({ automationShare: v, briefingCoverage: v });
          }}
          min={0}
          max={1}
          step={0.05}
          displayValue={`${Math.round(inputs.automationShare * 100)}%`}
        />
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
