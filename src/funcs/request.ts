import nodeFetch from 'node-fetch'

export default async function request(url: String, args: String[] = []): Promise<any> {
  let 
    isNextPage: boolean = true, 
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
        'Authorization': `Bearer ${process.env.TOKEN}`
      }
    })

    // @ts-ignore
    const json = await fetched.json() // @ts-ignore
    if (json.data[0] != undefined) { // @ts-ignore
      data = data.concat(data, json.data)
    } // @ts-ignore
    else if (json.data.length != 0) data.push(json) // @ts-ignore
    isNextPage = json.meta['next_page_url'];
    currentIndex++
  }

  return data
}