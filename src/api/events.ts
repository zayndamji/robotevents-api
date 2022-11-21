import { request } from "../funcs"
import { letters } from "../data"
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
  id: Number,
  sku: String,

  name: String,
  start: String,
  end: String,

  season: {
    id: Number,
    name: String,
    code: null
  },

  program: {
    id: Number,
    name: String,
    code: String
  },

  location: {
    venue: String,
    address_1: String,
    address_2: String | null,
    city: String,
    region: String,
    postcode: String,
    country: String,
    coordinates: {
      lat: Number,
      lon: Number
    }
  },

  divisions: Array<any>,
  level: String,
  ongoing: Boolean,
  awards_finalized: Boolean,
  event_type: String | null
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
   *  country: 'US'
   * });
   *
   */
  async teams(options: {
    number?: string,
    registered?: boolean,
    country?: string
  } = {}): Promise<Team[]> {
    let reqUrl: string = `events/${this.id}/teams`
    let reqArgs: string[] = []

    if (options.number != undefined) reqArgs.push(`number%5B%5D=${options.number.toUpperCase()}`)
    if (options.registered != undefined) reqArgs.push(`registered=${options.registered}`)
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
   *   teamId: 136072
   * });
   *
   */
   async skills(options: {
    teamId?: number
  } = {}): Promise<Team[]> {
    let reqUrl: string = `events/${this.id}/skills`
    let reqArgs: string[] = []

    if (options.teamId != undefined) reqArgs.push(`team%5B%5D=${options.teamId}`)

    return (await request(reqUrl, reqArgs))
  }
}