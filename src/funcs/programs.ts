export const programs = {
  "VRC": 1,
  "VEXU": 4,
  "WORKSHOP": 37,
  "VIQC": 41,
  "NRL": 43,
  "ADC": 44,
  "TVRC": 46,
  "TIQC": 47,
  "VRAD": 51,
  "BELLAVR": 55,
  "FAC": 56,
  "VAIC": 57
}

export function getProgramCode(program: string): number | undefined { // @ts-ignore
  if (programs.hasOwnProperty(program)) { // @ts-ignore
    return programs[program]
  }
}