import request from "../request"

export async function get(number: String): Promise<JSON> {
  return await request(`teams?number%5B%5D=${number}`)
}