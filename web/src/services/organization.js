
import {request, config} from 'utils'
const {api} = config
const {user} = api


export async function updateOrganization(params) {
  return request({
    url:user + "/updateOrganization",
    method: 'post',
    data: params.value,
  })
}
export async function queryOrganization(params) {
  return request({
    url:user + "/queryOrganization",
    method: 'post',
    data: params,
  })
}
