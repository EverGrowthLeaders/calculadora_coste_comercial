import type { CalculatorInputs } from '../types';
import { NumberInput } from './NumberInput';
import { SliderInput } from './SliderInput';

interface StepBusinessBasicsProps {
  inputs: CalculatorInputs;
  onChange: (updates: Partial<CalculatorInputs>) => void;
}

export function StepBusinessBasics({ inputs, onChange }: StepBusinessBasicsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-1">Datos básicos del negocio</h2>
        <p className="text-sm text-text-secondary">
          Necesitamos unos pocos datos para estimar tu situación actual. Puedes usar valores aproximados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberInput
          id="monthly-leads"
          label="¿Cuántos leads entran al mes?"
          helper="Incluye formularios, WhatsApp, llamadas, anuncios, portales o bases de datos reactivadas."
          value={inputs.monthlyLeads}
          onChange={(v) => onChange({ monthlyLeads: v })}
          min={0}
          step={1}
        />

        <NumberInput
          id="ticket-average"
          label="Ticket medio por cliente"
          helper="Usa ingreso medio, comisión media o margen medio generado por cada nuevo cliente."
          value={inputs.ticketAverage}
          onChange={(v) => onChange({ ticketAverage: v })}
          suffix="€"
          min={0}
          step={100}
        />
      </div>

      <SliderInput
        id="appointment-rate"
        label="¿Qué porcentaje de leads termina agendando una llamada?"
        helper="Ejemplo: de cada 100 leads, cuántos acaban con una cita en calendario."
        value={inputs.currentAppointmentRate}
        onChange={(v) => onChange({ currentAppointmentRate: v })}
        min={0}
        max={1}
        step={0.01}
        displayValue={`${Math.round(inputs.currentAppointmentRate * 100)}%`}
      />

      <SliderInput
        id="noshow-rate"
        label="¿Qué porcentaje de citas no aparece?"
        helper="Incluye personas que cancelan, no contestan o llegan sin intención real."
        value={inputs.currentNoShowRate}
        onChange={(v) => onChange({ currentNoShowRate: v })}
        min={0}
        max={1}
        step={0.01}
        displayValue={`${Math.round(inputs.currentNoShowRate * 100)}%`}
      />

      <SliderInput
        id="close-rate"
        label="¿Qué porcentaje de llamadas celebradas termina en cliente?"
        helper="Calculado solo sobre llamadas que sí se presentan."
        value={inputs.currentCloseRate}
        onChange={(v) => onChange({ currentCloseRate: v })}
        min={0}
        max={1}
        step={0.01}
        displayValue={`${Math.round(inputs.currentCloseRate * 100)}%`}
      />
    </div>
  );
}
