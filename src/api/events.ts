import { request } from "../funcs/request"
import { letters } from "../data/letters"
import { rounds } from "../data/rounds"

import { Team } from "./teams"
import { Skills } from "./skills"
import { Rankings } from "./rankings"
import { Match } from "./matches"

/**
 * Fetches event by SKU.
 * @param sku Event SKU
 *
 * @example
 * const event = await robotevents.events.get('RE-V5RC-24-5557');
 *
 */
export async function get(sku: string): Promise<Event>

/**
 * Fetches event by RobotEvents id.
 * @param id RobotEvents ID
 *
 * @example
 * const event = await robotevents.events.get(55557);
 *
 */
export async function get(id: number): Promise<Event>
 
export async function get(idSku: any): Promise<Event> {
  let
    reqUrl: String = '',
    reqArgs: String[] = [],
    id: Boolean = false, 
    data: JSON
  
  idSku = `${idSku}`

  if (!letters.test(idSku.toLowerCase())) {
    id = true
    reqUrl = `events/${idSku}`
  }
  else {
    reqUrl = `events`
    reqArgs.push(`sku%5B%5D=${idSku}`)
  }
    
  data = await request(reqUrl, reqArgs)
  
  // @ts-ignore
  return new Event(data[0])
}

/**
 * Contains methods mirrored from RobotEvents API for /events.
 */
export class Event {
  id = 0
  sku = ""

  name = ""
  start = ""
  end = ""

  season = {
    id: 0,
    name: "",
    code: null
  }

  program = {
    id: 0,
    name: "",
    code: ""
  }

  location = {
    venue: "",
    address_1: "",
    address_2: "",
    city: "",
    region: "",
    postcode: "",
    country: "",
    coordinates: {
      lat: 0,
      lon: 0
    }
  }

  divisions = []
  level = ""
  ongoing = false
  awards_finalized = false
  event_type = ""

  constructor(eventData: Object = {}) {
    const entries: any = Object.entries(eventData)
    for (let i = 0; i < entries.length; i++) {
      // @ts-ignore
      this[entries[i][0]] = entries[i][1]
    }
  }

  /**
   * Fetches teams of an event.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/teams
   * 
   * @example
   * const event = await robotevents.events.get('RE-V5RC-24-5557');
   * const teams = await event.teams({
   *  number: '11101B',
   *  registered: true,
   *  grade: "High School",
   *  country: 'US'
   * });
   *
   */
  async teams(options: {
    number?: string,
    registered?: boolean,
    grade?: string,
    country?: string
  } = {}): Promise<Team[]> {
    let reqUrl: string = `events/${this.id}/teams`
    let reqArgs: string[] = []

    if (options.number != undefined) reqArgs.push(`number%5B%5D=${options.number.toUpperCase()}`)
    if (options.registered != undefined) reqArgs.push(`registered=${options.registered}`)
    if (options.grade != undefined) reqArgs.push(`grade=${options.grade}`)
    if (options.country != undefined) reqArgs.push(`country%5B%5D=${options.country}`)

    const unparsedTeams = await request(reqUrl, reqArgs)
    const teams = []
    for (const event of unparsedTeams) {
      teams.push(new Team(event))
    }

    return teams
  }

  /**
   * Fetches skills of an event.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/skills
   * 
   * @example
   * const event = await robotevents.events.get('RE-V5RC-24-5557');
   * const skills = await event.skills({
   *   teamId: 86313,
   *   type: 'driver'
   * });
   *
   */
  async skills(options: {
    teamId?: number,
    type?: string
  } = {}): Promise<Skills[]> {
    let reqUrl: string = `events/${this.id}/skills`
    let reqArgs: string[] = []

    if (options.teamId != undefined) reqArgs.push(`team%5B%5D=${options.teamId}`)
    if (options.type != undefined) reqArgs.push(`type%5B%5D=${options.type}`)

    const unparsedSkills = await request(reqUrl, reqArgs)
    const skills = []
    for (const skillsRun of unparsedSkills) {
      skills.push(new Skills(skillsRun))
    }

    return skills
  }

  /**
   * Fetches awards of an event.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/awards
   * 
   * @example
   * const event = await robotevents.events.get('RE-V5RC-24-5557');
   * const awards = await event.awards({
   *   teamId: 86313,
   *   winner: '11101B'
   * });
   *
   */
  async awards(options: {
    teamId?: number,
    winner?: string
  } = {}): Promise<JSON> {
    let reqUrl: string = `events/${this.id}/awards`
    let reqArgs: string[] = []

    if (options.teamId != undefined) reqArgs.push(`team%5B%5D=${options.teamId}`)
    if (options.winner != undefined) reqArgs.push(`winner%5B%5D=${options.winner}`)

    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches matches of an event (by division).
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/divisions/{div}/matches
   * 
   * @example
   * const event = await robotevents.events.get('RE-V5RC-24-5557');
   * const matches = await event.matches({
   *   divId: 1,
   *   teamId: 86313,
   *   round: 'qualifications',
   *   instance: 1,
   *   matchnum: 16
   * });
   *
   */
  async matches(options: {
    divId?: number,
    teamId?: number,
    round?: string,
    instance?: number,
    matchnum?: number
  } = {}): Promise<Match[]> {
    options.divId = options.divId ?? 1
    let reqUrl: string = `events/${this.id}/divisions/${options.divId}/matches`
    let reqArgs: string[] = []

    if (options.teamId != undefined) reqArgs.push(`team%5B%5D=${options.teamId}`)
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
   * Fetches rankings of an event (by division).
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/divisions/{div}/rankings
   * 
   * @example
   * const event = await robotevents.events.get('RE-V5RC-24-5557');
   * const rankings = await event.rankings({
   *   divId: 1,
   *   teamId: 86313,
   *   rank: 7
   * });
   *
   */
  async rankings(options: {
    divId?: number,
    teamId?: number,
    rank?: number
  } = {}): Promise<Rankings[]> {
    options.divId = options.divId ?? 1
    let reqUrl: string = `events/${this.id}/divisions/${options.divId}/rankings`
    let reqArgs: string[] = []

    if (options.teamId != undefined) reqArgs.push(`team%5B%5D=${options.teamId}`)
    if (options.rank != undefined) reqArgs.push(`rank%5B%5D=${options.rank}`)

    const unparsedRankings = await request(reqUrl, reqArgs)
    const rankings = []
    for (const ranking of unparsedRankings) {
      rankings.push(new Rankings(ranking))
    }

    return rankings
  }
}