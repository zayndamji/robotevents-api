import { request, capitalize, getSeasonCode } from "../funcs"
import { programs, letters, rounds } from "../data"

/**
 * Fetches team by number and program.
 * @param number Team Number
 * @param program Program
 *
 * @example
 * const team = await robotevents.teams.get('392X');
 * const team = await robotevents.teams.get('392X', 'VRC');
 *
 */
export async function get(number: string, program: string): Promise<Team>

/**
 * Fetches team by RobotEvents id.
 * @param id RobotEvents ID
 *
 * @example
 * const team = await robotevents.teams.get(136072);
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
   *  season: '2021-2022',
   *  start: '2022-05-02T00:00:00Z',
   *  end: '2022-05-06T00:00:00Z',
   *  level: 'World'
   * });
   *
   */
  async events(options: {
    sku: string | undefined,
    season: string | undefined,
    start: string | undefined,
    end: string | undefined,
    level: string | undefined
  } = { sku: undefined, season: undefined, start: undefined, end: undefined, level: undefined }): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/events`
    let reqArgs: string[] = []

    if (options.sku != undefined) reqArgs.push(`sku%5B%5D=${options.sku}`)

    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)
    
    if (options.start != undefined) reqArgs.push(`start=${options.start}`)
    if (options.end != undefined) reqArgs.push(`end=${options.end}`)

    if (options.level != undefined) {
      options.level = capitalize(options.level)
      reqArgs.push(`level%5B%5D=${options.level}`)
    }

    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches matches of a team.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/matches
   * 
   * @example
   * const team = await robotevents.teams.get('23900B', 'VRC');
   * const matches = await team.matches({
   *   eventId: 45414,
   *   season: '2021-2022',
   *   round: 'round-of-16',
   *   instance: 1,
   *   matchnum: 1
   * });
   */
  async matches(options: {
    eventId: number | undefined,
    season: string | undefined,
    round: string | undefined,
    instance: number | undefined,
    matchnum: number | undefined
  } = { eventId: undefined, season: undefined, round: undefined, instance: undefined, matchnum: undefined }): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/matches`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)
    if (options.round != undefined) {
      options.round == options.round.toLowerCase()
      if (options.round.substring(0, 4) in rounds) { // @ts-ignore
        reqArgs.push(`round%5B%5D=${rounds[options.round.substring(0, 4)]}`)
      }
    }
    if (options.instance != undefined) reqArgs.push(`instance%5B%5D=${options.instance}`)
    if (options.matchnum != undefined) reqArgs.push(`matchnum%5B%5D=${options.matchnum}`)
  
    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches rankings of a team.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/rankings
   * 
   * @example
   * const team = await robotevents.teams.get('23900B', 'VRC');
   * const rankings = await team.rankings({
   *   eventId: 46025,
   *   rank: 19,
   *   season: "2021-2022"
   * });
   *
   */
  async rankings(options: {
    eventId: number | undefined,
    rank: number | undefined,
    season: string | undefined
  } = { eventId: undefined, rank: undefined, season: undefined }): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/rankings`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.rank != undefined) reqArgs.push(`rank%5B%5D=${options.rank}`)
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)

    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches skills of a team.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/skills
   * 
   * @example
   * const team = await robotevents.teams.get('23900B', 'VRC');
   * const skills = await team.skills({
   *   eventId: 47030,
   *   type: 'driver',
   *   season: '2021-2022'
   * });
   *
   */
  async skills(options: {
    eventId: number | undefined,
    type: string | undefined,
    season: string | undefined
  } = { eventId: undefined, type: undefined, season: undefined }): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/skills`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.type != undefined) reqArgs.push(`type%5B%5D=${options.type.toLowerCase()}`)
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)

    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches awards of a team.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/awards
   * 
   * @example
   * const team = await robotevents.teams.get('315B', 'VRC');
   * const awards = await team.awards({
   *   eventId: 47030,
   *   season: '2020-2021'
   * });
   *
   */
  async awards(options: {
    eventId: number | undefined,
    season: string | undefined
  } = { eventId: undefined, season: undefined }): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/awards`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)

    return (await request(reqUrl, reqArgs))
  }
}