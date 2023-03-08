type AllianceTeam = {
  team: {
    id: number,
    name: string,
    code: string | null
  },
  sitting: boolean
}

type Alliance = {
  color: string,
  score: number,
  teams: AllianceTeam[]
}

export class Match {
  id = 0

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

  round = 0
  instance = 0
  matchnum = 0
  scheduled = ""
  started = ""
  field = ""
  scored = false
  name = ""

  alliances: Alliance[] = []

  constructor(matchData: Object = {}) {
    const entries: any = Object.entries(matchData)
    for (let i = 0; i < entries.length; i++) {
      // @ts-ignore
      this[entries[i][0]] = entries[i][1]
    }
  }
}