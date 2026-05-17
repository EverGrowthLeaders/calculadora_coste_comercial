/** All input fields the user fills in across the wizard steps */
export interface CalculatorInputs {
  // Step 1 — Business basics
  monthlyLeads: number;
  ticketAverage: number;
  currentAppointmentRate: number; // 0–1
  currentNoShowRate: number;      // 0–1
  currentCloseRate: number;       // 0–1

  // Step 2 — Manual cost
  manualMinutesPerLead: number;
  hourlyCost: number;
  manualLeadShare: number;        // 0–1

  // Step 3 — Automation scenario
  automationShare: number;        // 0–1
  automationEfficiency: number;   // 0–1
  speedToLeadLiftPP: number;     // absolute pp, e.g. 0.05
  reminderCoverage: number;       // 0–1
  improvedNoShowRate: number;     // 0–1
  briefingCoverage: number;       // 0–1
  closeRateLiftPP: number;       // absolute pp, e.g. 0.03
}

/** Calculated current-state metrics */
export interface CurrentMetrics {
  bookedBase: number;
  heldBase: number;
  salesBase: number;
  revenueBase: number;
}

/** Calculated improved-state metrics */
export interface ImprovedMetrics {
  bookedSpeed: number;
  heldNoShow: number;
  salesBriefing: number;
  revenueBriefing: number;
  recoveredHours: number;
  timeSavings: number;
}

/** Breakdown of the four leakage sources */
export interface LeakageBreakdown {
  timeSavings: number;
  speedImpact: number;
  noShowImpact: number;
  briefingImpact: number;
}

/** Full result object */
export interface CalculatorResults {
  current: CurrentMetrics;
  improved: ImprovedMetrics;
  leakage: LeakageBreakdown;
  monthlyHiddenCost: number;
  annualHiddenCost: number;
  additionalRevenue: number;
  additionalSales: number;
  additionalBookedCalls: number;
  additionalHeldCalls: number;
  topLeakage: 'time' | 'speed' | 'noshow' | 'briefing';
}
