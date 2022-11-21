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

  constructor(rankingsData: Object = {}) {
    const entries: any = Object.entries(rankingsData)
    for (let i = 0; i < entries.length; i++) {
      // @ts-ignore
      this[entries[i][0]] = entries[i][1]
    }
  }
}