import {request, config} from 'utils'
const {api} = config
const {user,wx} = api

export async function selectManger(params) {
  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url:user+ "/getAllUser",
    method: 'post',
    data:param,
  })
}
export async function getPersonalCenter(params) {
  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url:user+ "/getPersonalCenter",
    method: 'post',
    data:param,
  })
}
export async function insertManger(params) {
  return request({
    url:user+ "/insertUser",
    method: 'post',
    data:params.obj,
  })
}
export async function deleteManger(params) {
  return request({
    url:user+ "/deleteUser",
    method: 'post',
    data:params,
  })
}
export async function UpdateManger(params) {
  return request({
    url:user+ "/updateUser",
    method: 'post',
    data:params.obj,
  })
}
export async function UpdateMangers(params) {
  return request({
    url:user+ "/updateUser",
    method: 'post',
    data:params.value,
  })
}
export async function wxAuthorize(params) {
  return request({
    url: wx + "/wxAuthorize",
    method: 'get',
    data: params,
  })
}
