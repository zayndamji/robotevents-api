import fetch from 'node-fetch'

export default async function request(url: String): Promise<JSON> {
  const data = await fetch(`https://www.robotevents.com/api/v2/${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TOKEN}`
    }
  })

  const result: JSON = await data.json()

  return result
}