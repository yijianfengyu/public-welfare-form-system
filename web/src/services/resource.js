import {request, config} from 'utils'
const {api} = config
const {resource} = api

export async function queryHistoryResources(params) {
  return request({
    url: resource + "/queryHistoryResources",
    method: 'post',
    data: params,
  })
}

export async function updateResource(params) {
  return request({
    url: resource + "/updateResource",
    method: 'post',
    data: params,
  })
}

export async function deleteResource(params) {
  return request({
    url: resource + "/deleteResource",
    method: 'post',
    data: params,
  })
}

export async function uploadResource(params) {
  return request({
    url: resource + "/uploadResource",
    method: 'post',
    data: params,
  })
}
