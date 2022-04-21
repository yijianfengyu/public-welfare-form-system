import {request, config} from 'utils'
const {api} = config
const {draw,form} = api
export async function saveOverlayPath(params) {
  return request({
    url: draw + "/save",
    method: 'post',
    data: params,
  })
}
export async function querysOverlayPath(params) {
  return request({
    url: draw + "/paths",
    method: 'post',
    data: params,
  })
}
export async function deletePath(params) {

  return request({
    url: draw + "/delete/"+params.guid,
    method: 'post',
    data: params,
  })
}

