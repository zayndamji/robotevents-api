import { request } from "../funcs/request"
import { capitalize } from "../funcs/capitalize"
import { Seasons } from "../funcs/seasons"
import { letters } from "../data/letters"
import { rounds } from "../data/rounds"

import { Event } from "./events"
import { Skills } from "./skills"
import { Rankings } from "./rankings"
import { Match } from "./matches"
import { Programs } from "./programs"

/**
 * Fetches team by number and program.
 * @param number Team Number
 * @param program Program
 *
 * @example
 * const team = await robotevents.teams.get('11101B');
 * const team = await robotevents.teams.get('11101B', robotevents.Programs.V5RC);
 *
 */
export async function get(number: string, program: Programs): Promise<Team>

/**
 * Fetches team by RobotEvents id.
 * @param id RobotEvents ID
 *
 * @example
 * const team = await robotevents.teams.get(86313);
 *
 */
export async function get(id: number): Promise<Team>

export async function get(idNumber: any, program: Programs = Programs.DEFAULT): Promise<Team> {
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
  
  if (program != Programs.DEFAULT) reqArgs.push(`program%5B%5D=${program}`)
    
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
   * const team = await robotevents.teams.get('11101B', robotevents.Programs.V5RC);
   * const events = await team.events({
   *  sku: 'RE-V5RC-24-5557',
   *  season: '2024-2025',
   *  start: '2024-08-01T00:00:00Z',
   *  end: '2022-08-05T00:00:00Z',
   *  level: 'Signature'
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

    if (options.sku != undefined) reqArgs.push(`sku%5B%5D=${options.sku}`) // @ts-ignore
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${Seasons[this.program.code.toUpperCase()][options.season]}`)
    
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
   * const team = await robotevents.teams.get('11101B', robotevents.Programs.V5RC);
   * const matches = await team.matches({
   *   eventId: 55557,
   *   season: '2024-2025',
   *   round: 'finals',
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
  } = {}): Promise<Match[]> {
    let reqUrl: string = `teams/${this.id}/matches`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`) // @ts-ignore
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${Seasons[this.program.code.toUpperCase()][options.season]}`)
    if (options.round != undefined) {
      options.round == options.round.toLowerCase()
      if (options.round.substring(0, 4) in rounds) { // @ts-ignore
        reqArgs.push(`round%5B%5D=${rounds[options.round.substring(0, 4)]}`)
      }
    }
    if (options.instance != undefined) reqArgs.push(`instance%5B%5D=${options.instance}`)
    if (options.matchnum != undefined) reqArgs.push(`matchnum%5B%5D=${options.matchnum}`)
  
    const unparsedMatches = await request(reqUrl, reqArgs)
    const matches = []
    for (const match of unparsedMatches) {
      matches.push(new Match(match))
    }

    return matches
  }

  /**
   * Fetches rankings of a team.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/rankings
   * 
   * @example
   * const team = await robotevents.teams.get('11101B', robotevents.Programs.V5RC);
   * const rankings = await team.rankings({
   *   eventId: 55557,
   *   rank: 7,
   *   season: "2024-2025"
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
    if (options.rank != undefined) reqArgs.push(`rank%5B%5D=${options.rank}`) // @ts-ignore
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${Seasons[this.program.code.toUpperCase()][options.season]}`)

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
   * const team = await robotevents.teams.get('11101B', robotevents.Programs.V5RC);
   * const skills = await team.skills({
   *   eventId: 55557,
   *   type: 'driver',
   *   season: '2024-2025'
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
    if (options.type != undefined) reqArgs.push(`type%5B%5D=${options.type.toLowerCase()}`) // @ts-ignore
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${Seasons[this.program.code.toUpperCase()][options.season]}`)

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
   * const team = await robotevents.teams.get('11101B', robotevents.Programs.V5RC);
   * const awards = await team.awards({
   *   eventId: 55557,
   *   season: '2024-2025'
   * });
   *
   */
  async awards(options: {
    eventId?: number,
    season?: string
  } = {}): Promise<JSON> {
    let reqUrl: string = `teams/${this.id}/awards`
    let reqArgs: string[] = []

    if (options.eventId != undefined) reqArgs.push(`event%5B%5D=${options.eventId}`) // @ts-ignore
    if (options.season != undefined) reqArgs.push(`season%5B%5D=${Seasons[this.program.code.toUpperCase()][options.season]}`)

    return (await request(reqUrl, reqArgs))
  }
}