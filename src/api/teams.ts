import request from "../request"

const programs = {
  "VRC": 1,
  "VEXU": 4,
  "WORKSHOP": 37,
  "VIQC": 41,
  "NRL": 43,
  "ADC": 44,
  "TVRC": 46,
  "TIQC": 47,
  "VRAD": 51,
  "BellAVR": 55,
  "FAC": 56,
  "VAIC": 57
}

export async function get(number: string, program: string = ""): Promise<JSON> {
  let reqStr = `teams?number%5B%5D=${number}`

  // @ts-ignore
  if (program in programs) reqStr += `&program%5B%5D=${programs[program]}`

  return await request(reqStr)
}