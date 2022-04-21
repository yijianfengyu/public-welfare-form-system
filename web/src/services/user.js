import {request, config} from 'utils'
const {api} = config
const {user} = api

export async function query(params) {
  return request({
    url: user + "/getOneStaffInfoById",
    method: 'post',
    data: params,
  })
}

export async function create(params) {
  return request({
    url: user + "/insertStaff",
    method: 'post',
    data: params.value,
  })
}

export async function remove(params) {
  return request({
    url: user,
    method: 'delete',
    data: params,
  })
}

export async function update(params) {
  return request({
    url: user + "/updateStaff",
    method: 'post',
    data: params,
  })
}


export async function queryMenu(params) {
  return request({
    url: user + "/getRootMenuByRole",
    method: 'post',
    data: params,
  })
}

export async function updateMenu(params) {
  return request({
    url: user + "/updateMenuById",
    method: 'post',
    data: params,
  })
}

export async function queryUnderlying(params) {
  return request({
    url: user + "/getUnderlying",
    method: 'post',
    data: params,
  })
}

export async function updateUnderling(params) {
  return request({
    url: user + "/updateUnderling",
    method: 'post',
    data: params,
  })
}

export async function queryAllStaff(params) {
  return request({
    url: user + "/queryAllStaff",
    method: 'post',
    data: params,
  })
}

export async function register(params) {
  return request({
    url: user + "/registerStaff",
    method: 'post',
    data: params.value,
  })
}



