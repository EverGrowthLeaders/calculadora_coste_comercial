import { useMemo } from 'react';
import type { CalculatorInputs, CalculatorResults } from '../types';

/**
 * Core calculator logic hook.
 * All formulas follow the spec exactly — each step builds on the previous.
 */
export function useCalculatorLogic(inputs: CalculatorInputs): CalculatorResults {
  return useMemo(() => {
    const {
      monthlyLeads,
      ticketAverage,
      currentAppointmentRate,
      currentNoShowRate,
      currentCloseRate,
      manualMinutesPerLead,
      hourlyCost,
      manualLeadShare,
      automationShare,
      speedToLeadLiftPP,
      improvedNoShowRate,
      briefingCoverage,
      closeRateLiftPP,
    } = inputs;

    // ── Current situation ──────────────────────────────────────
    const bookedBase = monthlyLeads * currentAppointmentRate;
    const heldBase = bookedBase * (1 - currentNoShowRate);
    const salesBase = heldBase * currentCloseRate;
    const revenueBase = salesBase * ticketAverage;

    // ── Step 1: Speed to lead impact ──────────────────────────
    // Improved appointment rate (capped at 100%)
    const improvedAppointmentRate = Math.min(currentAppointmentRate + speedToLeadLiftPP, 1);

    // Blended booked calls: manual portion keeps old rate, automated gets improved rate
    const bookedSpeed =
      monthlyLeads * (
        (1 - automationShare) * currentAppointmentRate +
        automationShare * improvedAppointmentRate
      );

    const heldSpeed = bookedSpeed * (1 - currentNoShowRate);
    const salesSpeed = heldSpeed * currentCloseRate;
    const revenueSpeed = salesSpeed * ticketAverage;
    const speedImpact = revenueSpeed - revenueBase;

    // ── Step 2: No-show reduction impact ──────────────────────
    // Assuming 100% of booked calls get reminders
    const effectiveShowRate = 1 - improvedNoShowRate;

    const heldNoShow = bookedSpeed * effectiveShowRate;
    const salesNoShow = heldNoShow * currentCloseRate;
    const revenueNoShow = salesNoShow * ticketAverage;
    const noShowImpact = revenueNoShow - revenueSpeed;

    // ── Step 3: Briefing IA impact ────────────────────────────
    // Improved close rate (capped at 100%)
    const improvedCloseRate = Math.min(currentCloseRate + closeRateLiftPP, 1);

    // Blended close rate: non-briefed keeps old, briefed gets improved
    const effectiveCloseRate =
      (1 - briefingCoverage) * currentCloseRate +
      briefingCoverage * improvedCloseRate;

    const salesBriefing = heldNoShow * effectiveCloseRate;
    const revenueBriefing = salesBriefing * ticketAverage;
    const briefingImpact = revenueBriefing - revenueNoShow;

    // ── Step 4: Time savings ──────────────────────────────────
    const manualMinutesMonthly = monthlyLeads * manualLeadShare * manualMinutesPerLead;
    const manualHoursMonthly = manualMinutesMonthly / 60;
    const manualCostMonthly = manualHoursMonthly * hourlyCost;
    const timeSavings = manualCostMonthly * automationShare;
    const recoveredHours = manualHoursMonthly * automationShare;

    // ── Totals ────────────────────────────────────────────────
    const monthlyHiddenCost = speedImpact + noShowImpact + briefingImpact + timeSavings;
    const annualHiddenCost = monthlyHiddenCost * 12;
    const additionalRevenue = revenueBriefing - revenueBase;
    const additionalSales = salesBriefing - salesBase;
    const additionalBookedCalls = bookedSpeed - bookedBase;
    const additionalHeldCalls = heldNoShow - heldBase;

    // ── Detect top leakage ────────────────────────────────────
    const leakageMap = {
      time: timeSavings,
      speed: speedImpact,
      noshow: noShowImpact,
      briefing: briefingImpact,
    } as const;

    const topLeakage = (Object.entries(leakageMap) as [keyof typeof leakageMap, number][])
      .sort((a, b) => b[1] - a[1])[0][0];

    return {
      current: { bookedBase, heldBase, salesBase, revenueBase },
      improved: { bookedSpeed, heldNoShow, salesBriefing, revenueBriefing, recoveredHours, timeSavings },
      leakage: { timeSavings, speedImpact, noShowImpact, briefingImpact },
      monthlyHiddenCost,
      annualHiddenCost,
      additionalRevenue,
      additionalSales,
      additionalBookedCalls,
      additionalHeldCalls,
      topLeakage,
    };
  }, [inputs]);
}
