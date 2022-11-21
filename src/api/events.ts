import { request } from "../funcs"
import { letters, rounds } from "../data"
import { Team } from "./teams"

/**
 * Fetches event by SKU.
 * @param sku Event SKU
 *
 * @example
 * const event = await robotevents.events.get('RE-VRC-22-7950');
 *
 */
export async function get(sku: string): Promise<Event>

/**
 * Fetches event by RobotEvents id.
 * @param id RobotEvents ID
 *
 * @example
 * const event = await robotevents.events.get(47950);
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

export type EventData = {
  id: number,
  sku: string,

  name: string,
  start: string,
  end: string,

  season: {
    id: number,
    name: string,
    code: string | null
  },

  program: {
    id: number,
    name: string,
    code: string
  },

  location: {
    venue: string,
    address_1: string,
    address_2: string | null,
    city: string,
    region: string,
    postcode: string,
    country: string,
    coordinates: {
      lat: number,
      lon: number
    }
  },

  divisions: Array<any>,
  level: string,
  ongoing: boolean,
  awards_finalized: boolean,
  event_type: string | null
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

  constructor(eventData: EventData | Object = {}) {
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
   * const event = await robotevents.events.get('RE-VRC-21-7030');
   * const teams = await event.teams({
   *  number: '23900B',
   *  registered: false,
   *  grade: "Middle School",
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
   * const event = await robotevents.events.get(47030);
   * const skills = await event.skills({
   *   teamId: 136072,
   *   type: 'driver'
   * });
   *
   */
  async skills(options: {
    teamId?: number,
    type?: string
  } = {}): Promise<JSON> {
    let reqUrl: string = `events/${this.id}/skills`
    let reqArgs: string[] = []

    if (options.teamId != undefined) reqArgs.push(`team%5B%5D=${options.teamId}`)
    if (options.type != undefined) reqArgs.push(`type%5B%5D=${options.type}`)

    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches awards of an event.
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/awards
   * 
   * @example
   * const event = await robotevents.events.get('RE-VRC-22-0008');
   * const awards = await event.awards({
   *   teamId: 139290,
   *   winner: '392X'
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
   * const event = await robotevents.events.get('RE-VRC-22-0008');
   * const matches = await event.matches({
   *   divId: 1,
   *   teamId: 139290,
   *   round: 'qualifications',
   *   instance: 1,
   *   matchnum: 4
   * });
   *
   */
  async matches(options: {
    divId?: number,
    teamId?: number,
    round?: string,
    instance?: number,
    matchnum?: number
  } = {}): Promise<JSON> {
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

    return (await request(reqUrl, reqArgs))
  }

  /**
   * Fetches rankings of an event (by division).
   * 
   * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/divisions/{div}/rankings
   * 
   * @example
   * const event = await robotevents.events.get('RE-VRC-22-0008');
   * const rankings = await event.rankings({
   *   divId: 1,
   *   teamId: 139290,
   *   rank: 2
   * });
   *
   */
  async rankings(options: {
    divId?: number,
    teamId?: number,
    rank?: number
  } = {}): Promise<JSON> {
    options.divId = options.divId ?? 1
    let reqUrl: string = `events/${this.id}/divisions/${options.divId}/rankings`
    let reqArgs: string[] = []

    if (options.teamId != undefined) reqArgs.push(`team%5B%5D=${options.teamId}`)
    if (options.rank != undefined) reqArgs.push(`rank%5B%5D=${options.rank}`)

    return (await request(reqUrl, reqArgs))
  }
}