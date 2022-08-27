import { seasons } from '../data'

export function getSeasonCode(code: string, season: string): number | undefined { // @ts-ignore
  if (seasons[code].hasOwnProperty(season)) { // @ts-ignore
    return seasons[code][season]
  }
}