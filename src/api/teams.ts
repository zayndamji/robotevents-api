import request from "../request"
import { programs, letters } from "../data"

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
export async function get(number: string, program: string): Promise<Team>

/**
 * Fetches team by RobotEvents id.
 * @param id RobotEvents ID
 *
 * @example
 * const team = await robotevents.teams.getByNumber(136072);
 *
 */
export async function get(id: number): Promise<Team>

export async function get(idNumber: any, program: string = ""): Promise<Team> {
  let
    reqStr: string, 
    id: boolean = false, 
    data: JSON
  
  idNumber = `${idNumber}`

  if (!letters.test(idNumber.toLowerCase())) {
    id = true
    reqStr = `teams/${idNumber}`
  }
  else reqStr = `teams?number%5B%5D=${idNumber}`
  
  // @ts-ignore
  if (program in programs) reqStr += `&program%5B%5D=${programs[program]}`
    
  data = (await request(reqStr))
  
  if (id) { return new Team(data) }
  // @ts-ignore
  else if (data.data[0] != undefined) { return new Team(data.data[0]) }
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

/**
 * Contains methods mirrored from RobotEvents API for /teams.
 */
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

  /**
   * Fetches events of a team.
   * 
   * @example
   * const team = await robotevents.teams.getByNumber('392X');
   * const events = await team.events();
   *
   */
  async events(): Promise<JSON> {
    return (await request(`teams/${this.id}/events`)).data
  }

  /**
   * Fetches matches of a team.
   * 
   * @example
   * const team = await robotevents.teams.getByNumber('392X');
   * const matches = await team.matches();
   *
   */
  async matches(): Promise<JSON> {
    return (await request(`teams/${this.id}/matches`)).data
  }

  /**
   * Fetches rankings of a team.
   * 
   * @example
   * const team = await robotevents.teams.getByNumber('392X');
   * const rankings = await team.rankings();
   *
   */
  async rankings(): Promise<JSON> {
    return (await request(`teams/${this.id}/rankings`)).data
  }

  /**
   * Fetches skills of a team.
   * 
   * @example
   * const team = await robotevents.teams.getByNumber('392X');
   * const skills = await team.skills();
   *
   */
  async skills(): Promise<JSON> {
    return (await request(`teams/${this.id}/skills`)).data
  }

  /**
   * Fetches awards of a team.
   * 
   * @example
   * const team = await robotevents.teams.getByNumber('392X');
   * const awards = await team.awards();
   *
   */
  async awards(): Promise<JSON> {
    return (await request(`teams/${this.id}/awards`)).data
  }
}