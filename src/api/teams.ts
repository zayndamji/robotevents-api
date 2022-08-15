import request from "../request"

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
  "BellAVR": 55,
  "FAC": 56,
  "VAIC": 57
}

/**
 * Fetches team by number and program.
 * @param number Team Number
 * @param program Program
 *
 * @example
 * const team = await robotevents.teams.getByNumber('392X');
 * const team = await robotevents.teams.getByNumber('392X', 'VRC');
 *
 */
export async function getByNumber(number: string, program: string = ""): Promise<Team> {
  let reqStr = `teams?number%5B%5D=${number}`

  // @ts-ignore
  if (program in programs) reqStr += `&program%5B%5D=${programs[program]}`
  
  const data = (await request(reqStr)).data

  if (data[0] != undefined) {
    return new Team(data[0])
  }
  return new Team()
}

/**
 * Fetches team by RobotEvents id.
 * @param id RobotEvents ID
 *
 * @example
 * const team = await robotevents.teams.getByNumber(136072);
 *
 */
export async function getById(id: number): Promise<Team> {
  let reqStr = `teams/${id}`
  
  const data = (await request(reqStr))

  if (data != undefined) {
    return new Team(data)
  }
  return new Team()
}

export type TeamData = {
  id: Number,

  number: String
  team_name: String
  robot_name: String | null
  organization: String
  registered: Boolean

  program: { id: Number, name: String, code: String }
  grade: String

  location: {
    venue: String | null,
    address_1: String | null,
    address_2: String | null,
    city: String | null,
    region: String | null,
    postcode: String | null,
    country: String | null,
    coordinates: { lat: Number, lon: Number }
  }
}

export class Team {
  id = 0

  number = ''
  team_name = ''
  robot_name = ''
  organization = ''
  registered = false

  program = { id: 0, name: '', code: '' }
  grade = ''

  location = {
    venue: '',
    address_1: '',
    address_2: '',
    city: '',
    region: '',
    postcode: '',
    country: '',
    coordinates: { lat: 0, lon: 0 }
  }

  constructor(teamData: TeamData | Object = {}) {
    const entries: any = Object.entries(teamData)
    for (let i = 0; i < entries.length; i++) {
      // @ts-ignore
      this[entries[i][0]] = entries[i][1]
    }
  }

  async events(): Promise<JSON> {
    return (await request(`teams/${this.id}/events`)).data
  }

  async matches(): Promise<JSON> {
    return (await request(`teams/${this.id}/matches`)).data
  }

  async rankings(): Promise<JSON> {
    return (await request(`teams/${this.id}/rankings`)).data
  }

  async skills(): Promise<JSON> {
    return (await request(`teams/${this.id}/skills`)).data
  }

  async awards(): Promise<JSON> {
    return (await request(`teams/${this.id}/awards`)).data
  }
}