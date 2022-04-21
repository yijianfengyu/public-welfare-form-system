
import {request, config} from 'utils'
const {api} = config
const {wx} = api

export async function queryGoAuthorUrl(params) {
  return request({
    url:wx + "/goAuthorization",
    method: 'post',
    data: params,
  })
}

export async function queryWxInfo(params) {
  return request({
    url:wx + "/queryWxInfo",
    method: 'post',
    data: params,
  })
}

export async function queryMaterial(params) {
  return request({
    url:wx + "/material/queryMaterial",
    method: 'post',
    data: params,
  })
}

export async function insertMaterial(params) {
  return request({
    url:wx + "/material/insertMaterial",
    method: 'post',
    data: params,
  })
}

export async function updateMaterial(params) {
  return request({
    url:wx + "/material/updateMaterial",
    method: 'post',
    data: params,
  })
}

export async function deleteMaterial(params) {
  return request({
    url:wx + "/material/deleteMaterial",
    method: 'post',
    data: params,
  })
}

export async function sendMaterial(params) {
  return request({
    url:wx + "/material/sendMaterial",
    method: 'post',
    data: params,
  })
}


