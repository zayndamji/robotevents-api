export type RankingsData = {
  id: number,
  rank: number,

  event: {
    id: number,
    name: string,
    code: string
  },

  division: {
    id: number,
    name: string,
    code: string | null
  },

  team: {
    id: number,
    name: string,
    code: string | null
  },

  wins: number,
  losses: number,
  ties: number,
  wp: number,
  ap: number,
  sp: number,
  high_score: number,
  average_points: number,
  total_points: number
}

export class Rankings {
  id = 0
  rank = 0

  event = {
    id: 0,
    name: "",
    code: ""
  }

  division = {
    id: 0,
    name: "",
    code: null
  }

  team = {
    id: 0,
    name: "",
    code: null
  }

  wins = 0
  losses = 0
  ties = 0
  wp = 0
  ap = 0
  sp = 0
  high_score = 0
  average_points = 0
  total_points = 0

  constructor(rankingsData: RankingsData | Object = {}) {
    const entries: any = Object.entries(rankingsData)
    for (let i = 0; i < entries.length; i++) {
      // @ts-ignore
      this[entries[i][0]] = entries[i][1]
    }
  }
}