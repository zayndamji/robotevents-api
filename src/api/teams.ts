import request from "../request"

export async function get(number: String, program: String = ""): Promise<JSON> {
  let reqStr = `teams?number%5B%5D=${number}`

  if (program == 'VRC') reqStr += `&program%5B%5D=1`
  else if (program == 'VEXU') reqStr += `&program%5B%5D=4`
  else if (program == 'VIQC') reqStr += `&program%5B%5D=41`
  else if (program == 'WORKSHOP') reqStr += `&program%5B%5D=37`

  return await request(reqStr)
}