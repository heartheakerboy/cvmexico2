// Cálculos de nómina México (LFT / LISR Art. 96 / LSS).
// Lógica portada de las calculadoras verificadas de calculadorasat.org.

export const UMA_2026 = 113.14;
export const SALARIO_MINIMO_2026 = 315.04;

// Tarifa mensual del Art. 96 LISR (retención por salarios).
export const ISR_BRACKETS = [
  { limitInferior: 0.01, limitSuperior: 746.04, cuotaFija: 0.0, tasa: 1.92 },
  { limitInferior: 746.05, limitSuperior: 6332.05, cuotaFija: 14.32, tasa: 6.4 },
  { limitInferior: 6332.06, limitSuperior: 11128.01, cuotaFija: 371.83, tasa: 10.88 },
  { limitInferior: 11128.02, limitSuperior: 12935.83, cuotaFija: 893.55, tasa: 16.0 },
  { limitInferior: 12935.84, limitSuperior: 15487.71, cuotaFija: 1182.81, tasa: 17.92 },
  { limitInferior: 15487.72, limitSuperior: 31236.49, cuotaFija: 1640.18, tasa: 21.36 },
  { limitInferior: 31236.5, limitSuperior: 49233.0, cuotaFija: 5004.12, tasa: 23.52 },
  { limitInferior: 49233.01, limitSuperior: 93993.41, cuotaFija: 9236.89, tasa: 30.0 },
  { limitInferior: 93993.42, limitSuperior: 125325.2, cuotaFija: 22664.36, tasa: 32.0 },
  { limitInferior: 125325.21, limitSuperior: 375975.61, cuotaFija: 32690.4, tasa: 34.0 },
  { limitInferior: 375975.62, limitSuperior: Infinity, cuotaFija: 117911.48, tasa: 35.0 },
] as const;

/** Días de vacaciones por años de servicio (Art. 76 LFT, Vacaciones Dignas). */
export function getVacationDays(years: number): number {
  const y = Math.max(1, Math.floor(years));
  if (y === 1) return 12;
  if (y === 2) return 14;
  if (y === 3) return 16;
  if (y === 4) return 18;
  if (y === 5) return 20;
  if (y <= 10) return 22;
  if (y <= 15) return 24;
  if (y <= 20) return 26;
  if (y <= 25) return 28;
  return 30;
}

/** Factor de integración para el SBC: aguinaldo 15 días + prima vacacional 25%. */
export function integrationFactor(years: number): number {
  const vacationDays = getVacationDays(years);
  return 1 + 15 / 365 + (vacationDays * 0.25) / 365;
}

/** ISR mensual causado para un ingreso gravable mensual (sin subsidio al empleo). */
export function calculateISR(monthlyTaxable: number): number {
  if (monthlyTaxable <= 0) return 0;
  let bracket: (typeof ISR_BRACKETS)[number] = ISR_BRACKETS[0];
  for (const b of ISR_BRACKETS) {
    if (monthlyTaxable >= b.limitInferior) bracket = b;
    else break;
  }
  const excedente = monthlyTaxable - bracket.limitInferior;
  return Math.max(0, bracket.cuotaFija + excedente * (bracket.tasa / 100));
}

export type NetSalaryResult = {
  gross: number;
  net: number;
  isr: number;
  imss: number;
  sbcDaily: number;
  factor: number;
  effectiveRate: number;
};

/** Sueldo neto mensual a partir del bruto (prestaciones mínimas de ley). */
export function netFromGross(grossMonthly: number, years: number = 1): NetSalaryResult {
  const factor = integrationFactor(years);
  const dailySalary = grossMonthly / 30;
  // SBC topado a 25 UMA (Art. 28 LSS).
  const sbcDaily = Math.min(dailySalary * factor, 25 * UMA_2026);

  // Cuotas obreras IMSS (sobre SBC diario):
  // Prestaciones en dinero 0.25%, gastos médicos pensionados 0.375%,
  // invalidez y vida 0.625%, cesantía y vejez 1.125%,
  // excedente de enfermedades y maternidad 0.40% sobre (SBC - 3 UMA).
  const excedenteBase = Math.max(0, sbcDaily - 3 * UMA_2026);
  const imssDaily = sbcDaily * (0.0025 + 0.00375 + 0.00625 + 0.01125) + excedenteBase * 0.004;
  const imss = imssDaily * 30.4;

  const isr = calculateISR(grossMonthly);
  const net = Math.max(0, grossMonthly - isr - imss);

  return {
    gross: grossMonthly,
    net,
    isr,
    imss,
    sbcDaily,
    factor,
    effectiveRate: grossMonthly > 0 ? ((isr + imss) / grossMonthly) * 100 : 0,
  };
}

/** Cálculo inverso: bruto necesario para un neto deseado (búsqueda binaria). */
export function grossFromNet(targetNet: number, years: number = 1): NetSalaryResult {
  let lower = targetNet;
  let upper = targetNet * 2.5;
  let iterations = 0;
  while (upper - lower > 0.01 && iterations < 60) {
    const mid = (lower + upper) / 2;
    if (netFromGross(mid, years).net > targetNet) upper = mid;
    else lower = mid;
    iterations++;
  }
  return netFromGross((lower + upper) / 2, years);
}

export type FiniquitoInput = {
  monthlyGross: number;
  yearsWorked: number;
  /** Días transcurridos del año en curso al momento de la baja (1-365). */
  daysCurrentYear: number;
  /** Días trabajados pendientes de pago del último periodo. */
  unpaidDays: number;
  reason: "renuncia" | "despido";
};

export type FiniquitoResult = {
  dailySalary: number;
  salariosDevengados: number;
  aguinaldoProporcional: number;
  vacacionesProporcionales: number;
  primaVacacional: number;
  primaAntiguedad: number;
  indemnizacion3Meses: number;
  indemnizacion20Dias: number;
  subtotalFiniquito: number;
  subtotalLiquidacion: number;
  total: number;
  vacationDaysEntitlement: number;
};

/** Finiquito (renuncia) y liquidación (despido injustificado) estimados, antes de ISR. */
export function calculateFiniquito(input: FiniquitoInput): FiniquitoResult {
  const { monthlyGross, yearsWorked, reason } = input;
  const daysCurrentYear = Math.min(365, Math.max(0, input.daysCurrentYear));
  const dailySalary = monthlyGross / 30;

  const salariosDevengados = dailySalary * Math.max(0, input.unpaidDays);
  const aguinaldoProporcional = ((dailySalary * 15) / 365) * daysCurrentYear;

  const vacationDaysEntitlement = getVacationDays(yearsWorked);
  const diasVacacionesProporcionales = (vacationDaysEntitlement / 365) * daysCurrentYear;
  const vacacionesProporcionales = dailySalary * diasVacacionesProporcionales;
  const primaVacacional = vacacionesProporcionales * 0.25;

  // Prima de antigüedad: 12 días por año, tope 2 salarios mínimos diarios.
  // Procede en despido a cualquier antigüedad y en renuncia con 15+ años (Art. 162 LFT).
  const exactYears = yearsWorked + daysCurrentYear / 365;
  const primaDiaria = Math.min(dailySalary, SALARIO_MINIMO_2026 * 2);
  let primaAntiguedad = 0;
  if (reason === "despido" || yearsWorked >= 15) {
    primaAntiguedad = primaDiaria * 12 * exactYears;
  }

  let indemnizacion3Meses = 0;
  let indemnizacion20Dias = 0;
  if (reason === "despido") {
    indemnizacion3Meses = monthlyGross * 3;
    indemnizacion20Dias = dailySalary * 20 * exactYears;
  }

  const subtotalFiniquito =
    salariosDevengados + aguinaldoProporcional + vacacionesProporcionales + primaVacacional;
  const subtotalLiquidacion = primaAntiguedad + indemnizacion3Meses + indemnizacion20Dias;

  return {
    dailySalary,
    salariosDevengados,
    aguinaldoProporcional,
    vacacionesProporcionales,
    primaVacacional,
    primaAntiguedad,
    indemnizacion3Meses,
    indemnizacion20Dias,
    subtotalFiniquito,
    subtotalLiquidacion,
    total: subtotalFiniquito + subtotalLiquidacion,
    vacationDaysEntitlement,
  };
}

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMXN(value: number): string {
  return mxn.format(value || 0);
}
