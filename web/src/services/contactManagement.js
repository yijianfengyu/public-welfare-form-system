import {request, config} from 'utils'
const {api} = config
const {user} = api
const {pm} = api
const {dlowdContactUpload} = api
export async function selectContact(params) {
  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url:user+ "/getAllContact",
    method: 'post',
    data:param,
  })
}
export async function insertContact(params) {
  return request({
    url:user+ "/insertContact",
    method: 'post',
    data:params.value,
  })
}
export async function deleteContact(params) {
  return request({
    url:user+ "/deleteContact",
    method: 'post',
    data:params,
  })
}
export async function UpdateContact(params) {
  return request({
    url:user+ "/updateContact",
    method: 'post',
    data:params.value,
  })
}

export async function SelectPrincipal(params) {
  return request({
    url:pm+ "/queryAllActiveUser",
    method: 'post',
    data:params,
  })
}
export async function downloadContacts(params) {
  return request({
    url:dlowdContactUpload+ "/onContactExcelModel",
    method: 'post',
    data:params,
  })
}
export async function downloadContactData(params) {
  return request({
    url:user+ "/downloadContactData",
    method: 'post',
    data:params.value,
  })
}
export async function queryContactRepeatList(params) {
  return request({
    url:user+ "/queryContactRepeatList",
    method: 'post',
    data:params,
  })
}
export async function queryContactDefineDataList(params) {
  return request({
    url:user+ "/queryContactDefineDataList",
    method: 'post',
    data:params,
  })
}
