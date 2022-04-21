import {request, config} from 'utils'
const {api} = config
const {account,wx} = api

export async function queryAccount(params) {
  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url:account+ "/queryAccount",
    method: 'post',
    data:param,
  })
}
export async function updateUserPartner(params) {
  return request({
    url:account+ "/updateUserPartner",
    method: 'post',
    data:params,
  })
}

