import nodeFetch from 'node-fetch'

let token = ''

export function setToken(newToken: string) {
  token = newToken
}

export async function request(url: String, args: String[] = []): Promise<any> {
  let 
    isNextPage: boolean | null = true, 
    currentIndex: number = 1, 
    data: Array<any> = [],
    argsStr: String = ``
  
  for (let i = 0; i < args.length; i++) {
    argsStr += `&${args[i]}`
  }

  while (isNextPage != null) {
    const fetched = await nodeFetch(`https://www.robotevents.com/api/v2/${url}?per_page=100&page=${currentIndex}${argsStr}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const json = await fetched.json()
    if (json.data != undefined) {
      if (json.data[0] != undefined) {
        data = data.concat(json.data)
      }
      isNextPage = json.meta['next_page_url']
    }
    else {
      data.push(json)
      isNextPage = null
    }
    currentIndex++
  }

  return data
}