import { request, capitalizeFirst } from "../funcs"
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
    reqUrl: String = '',
    reqArgs: String[] = [],
    id: Boolean = false, 
    data: JSON
  
  idNumber = `${idNumber}`

  if (!letters.test(idNumber.toLowerCase())) {
    id = true
    reqUrl = `teams/${idNumber}`
  }
  else {
    reqUrl = `teams`
    reqArgs.push(`number%5B%5D=${idNumber}`)
  }
  
  program = program.toUpperCase()
  // @ts-ignore
  if (program in programs) reqArgs.push(`program%5B%5D=${programs[program]}`)
    
  data = await request(reqUrl, reqArgs)
  
  // @ts-ignore
  return new Team(data[0])
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
   * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/events
   * 
   * @example
   * const team = await robotevents.teams.getByNumber('23900B', 'VRC');
   * const events = await team.events({
   *  sku: 'RE-VRC-21-5434',
   *  level: 'World'
   * });
   *
   */
  async events(options: {
    sku: String | null | undefined,
    level: String | null | undefined
  } = { sku: undefined, level: undefined }): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/events`
    let reqArgs: string[] = []

    if (options.sku != undefined) reqArgs.push(`sku%5B%5D=${options.sku}`)

    if (options.level != undefined) {
      options.level = capitalizeFirst(options.level)
      reqArgs.push(`level%5B%5D=${options.level}`)
    }

    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches matches of a team.
   * 
   * @example
   * const team = await robotevents.teams.getByNumber('392X');
   * const matches = await team.matches();
   *
   */
  async matches(options: {
    eventId: number | null | undefined,
    instance: number | null | undefined,
    matchnum: number | null | undefined
  } = { eventId: undefined, instance: undefined, matchnum: undefined }): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/matches`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.instance != undefined) reqArgs.push(`instance%5B%5D=${options.instance}`)
    if (options.matchnum != undefined) reqArgs.push(`matchnum%5B%5D=${options.matchnum}`)
  
    return (await request(reqUrl, reqArgs))
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
    return (await request(`teams/${this.id}/rankings`))
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
    return (await request(`teams/${this.id}/skills`))
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
    return (await request(`teams/${this.id}/awards`))
  }
}