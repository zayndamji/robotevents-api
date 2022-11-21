import { request, capitalize, getSeasonCode } from "../funcs"
import { programs, letters, rounds } from "../data"
import { Event } from "./events"
import { Skills } from "./skills"
import { Rankings } from "./rankings"

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
    reqUrl: string = '',
    reqArgs: string[] = [],
    id: boolean = false, 
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

  constructor(teamData: Object = {}) {
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
   * const team = await robotevents.teams.get('23900B', 'VRC');
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
    sku?: string,
    season?: string,
    start?: string,
    end?: string,
    level?: string
  } = {}): Promise<Event[]> {
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

    const unparsedEvents = await request(reqUrl, reqArgs)
    const events = []
    for (const event of unparsedEvents) {
      events.push(new Event(event))
    }

    return events
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
    eventId?: number,
    season?: string,
    round?: string,
    instance?: number,
    matchnum?: number
  } = {}): Promise<JSON> {
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
    eventId?: number,
    rank?: number,
    season?: string
  } = {}): Promise<Rankings[]> {
    let reqUrl: string = `teams/${this.id}/rankings`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.rank != undefined) reqArgs.push(`rank%5B%5D=${options.rank}`)
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)

    const unparsedRankings = await request(reqUrl, reqArgs)
    const rankings = []
    for (const ranking of unparsedRankings) {
      rankings.push(new Rankings(ranking))
    }

    return rankings
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
    eventId?: number,
    type?: string,
    season?: string
  } = {}): Promise<Skills[]> {
    let reqUrl: string = `teams/${this.id}/skills`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.type != undefined) reqArgs.push(`type%5B%5D=${options.type.toLowerCase()}`)
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)

    const unparsedSkills = await request(reqUrl, reqArgs)
    const skills = []
    for (const skillsRun of unparsedSkills) {
      skills.push(new Skills(skillsRun))
    }

    return skills
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
    eventId?: number,
    season?: string
  } = {}): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/awards`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`)
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${getSeasonCode(this.program.code, options.season)}`)

    return (await request(reqUrl, reqArgs))
  }
}