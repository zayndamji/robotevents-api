import nodeFetch from 'node-fetch'
import * as fs from 'fs'

let token = '', mode = 'token', cache: string | undefined = undefined

export function setToken(newToken: string) {
  token = newToken
}

export function setMode(newMode: string) {
  mode = newMode
}

export function setCache(newCache: string) {
  cache = newCache
}

export function getCache(file: string): JSON | undefined {
  if (cache == undefined) {
    return undefined
  }
  
  if (!fs.existsSync(cache + '/' + file)) {
    return undefined
  }

  return JSON.parse(fs.readFileSync(cache + '/' + file).toString())
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

  const cached = getCache("" + url.replace(/\//g, '') + argsStr)
  if (cached != undefined) {
    return cached
  }

  while (isNextPage != null) {
    const fetched = await nodeFetch(`https://www.robotevents.com/api/v2/${url}?per_page=100&page=${currentIndex}${argsStr}`, {
      headers: mode == 'token' ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      } : mode == 'cookie' ? {
        'Accept': 'application/json',
        'Cookie': token
      } : {}
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

  if (cache != undefined) {
    fs.writeFileSync(cache + '/' + url.replace(/\//g, '') + argsStr, JSON.stringify(data))
  }

  return data
}