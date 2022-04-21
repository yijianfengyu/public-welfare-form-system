import {request, config} from 'utils'
const {api} = config
const {userLogin} = api

export async function login(data) {
  return request({
    url: userLogin + "/getLoginPage",
    method: 'post',
    data: data,
  })
}
export async function selectAccount(data) {
  return request({
    url: userLogin + "/selectAccount",
    method: 'post',
    data: data,
  })
}

export async function setUser(data) {
  await sessionStorage.setItem("userStorage", data)
}

export async function getUser(data) {
  let u = await sessionStorage.getItem("userStorage", data)
  return u
}

export async function checkCompanyCodes(data) {
  return request({
    url: userLogin + "/checkCompanyCodes",
    method: 'post',
    data: data,
  })
}



export async function loginOut(params) {
  return request({
    url: userLogin + "/singnOutLogin",
    method: 'post',
    data: params,
  })
}

export async function insertLogin(params) {
  return request({
    url: userLogin + "/insertLogin",
    method: 'post',
    data: params,
  })
}

export async function getRolesAndCompanys(params) {
  return request({
    url: userLogin + "/getRolesAndCompanys",
    method: 'post',
    data: params,
  })
}

export async function toSms1(params) {
  return request({
    url: userLogin + "/toSms",
    method: 'post',
    data: params,
  })
}

export async function registerUser(params) {
  return request({
    url: userLogin + "/registerUser",
    method: 'post',
    data: params,
  })
}
