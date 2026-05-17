import type { CalculatorInputs } from '../types';
import { NumberInput } from './NumberInput';
import { SliderInput } from './SliderInput';

interface StepManualCostProps {
  inputs: CalculatorInputs;
  onChange: (updates: Partial<CalculatorInputs>) => void;
}

export function StepManualCost({ inputs, onChange }: StepManualCostProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-1">Coste operativo del seguimiento manual</h2>
        <p className="text-sm text-text-secondary">
          Vamos a traducir el tiempo de tu equipo en coste operativo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberInput
          id="manual-minutes"
          label="Minutos medios que tu equipo dedica a cada lead"
          helper="Incluye llamadas, intentos fallidos, WhatsApps, notas, CRM y seguimiento básico."
          value={inputs.manualMinutesPerLead}
          onChange={(v) => onChange({ manualMinutesPerLead: v })}
          suffix="min"
          min={0}
          step={1}
        />

        <NumberInput
          id="hourly-cost"
          label="Coste hora estimado del perfil que atiende leads"
          helper="No tiene que ser exacto. Sirve para traducir tiempo en coste operativo."
          value={inputs.hourlyCost}
          onChange={(v) => onChange({ hourlyCost: v })}
          suffix="€/h"
          min={0}
          step={5}
        />
      </div>

      <SliderInput
        id="manual-lead-share"
        label="¿Qué parte de los leads requiere intervención manual hoy?"
        helper="Si todos pasan por alguien del equipo, déjalo en 100%."
        value={inputs.manualLeadShare}
        onChange={(v) => onChange({ manualLeadShare: v })}
        min={0}
        max={1}
        step={0.05}
        displayValue={`${Math.round(inputs.manualLeadShare * 100)}%`}
      />

      {/* Live summary card */}
      <div className="bg-navy-50/50 rounded-2xl p-5 border border-navy-100/50 animate-fade-in">
        <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">Vista previa</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted">Minutos manuales/mes</p>
            <p className="text-lg font-bold text-text-primary">
              {new Intl.NumberFormat('es-ES').format(
                Math.round(inputs.monthlyLeads * inputs.manualLeadShare * inputs.manualMinutesPerLead)
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Horas manuales/mes</p>
            <p className="text-lg font-bold text-text-primary">
              {new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(
                (inputs.monthlyLeads * inputs.manualLeadShare * inputs.manualMinutesPerLead) / 60
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Coste operativo/mes</p>
            <p className="text-lg font-bold text-navy-700">
              {new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(
                (inputs.monthlyLeads * inputs.manualLeadShare * inputs.manualMinutesPerLead / 60) * inputs.hourlyCost
              )} €
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
