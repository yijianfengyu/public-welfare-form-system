import {request, config} from 'utils'
const {api} = config
const {customer} = api

export async function querysCustomer(params) {
  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url: customer + "/querysProductQuotation",
    method: 'post',
    data: param,
  })
}
export async function insertCustomer(params) {
  return request({
    url: customer + "/insertCustomer",
    method: 'post',
    data: params.values,
  })
}
export async function updateCustomer(params) {
  return request({
    url: customer + "/updateCustomer",
    method: 'post',
    data: params.values,
  })
}
export async function queryCustomerContact(params) {
  return request({
    url: customer + "/querysCustomerContact",
    method: 'post',
    data: params,
  })
}
export async function insertCustomerContact(params) {
  return request({
    url: customer + "/insertCustomerContact",
    method: 'post',
    data: params.values,
  })
}
export async function updateCustomerContact(params) {
  return request({
    url: customer + "/updateCustomerContact",
    method: 'post',
    data: params.values,
  })
}
export async function queryCustomerById(params) {
  return request({
    url: customer + "/queryCustomerById",
    method: 'post',
    data: params,
  })
}
export async function queryCustomerContactById(params) {
  return request({
    url: customer + "/queryCustomerContactById",
    method: 'post',
    data: params,
  })
}
export async function transferCustomer(params) {
  return request({
    url: customer + "/transferCustomer",
    method: 'post',
    data: params,
  })
}
export async function queryLocation(params) {
  return request({
    url: customer + "/queryLocation",
    method: 'post',
    data: params,
  })
}
