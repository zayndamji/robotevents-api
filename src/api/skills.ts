export class Skills {
  id = 0
  type = ""

  event = {
    id: 0,
    name: "",
    code: ""
  }

  team = {
    id: 0,
    name: "",
    code: null
  }

  season = {
    id: 0,
    name: "",
    code: null
  }

  division = null
  rank = 0
  score = 0
  attempts = 0

  constructor(skillsData: Object = {}) {
    const entries: any = Object.entries(skillsData)
    for (let i = 0; i < entries.length; i++) {
      // @ts-ignore
      this[entries[i][0]] = entries[i][1]
    }
  }
}