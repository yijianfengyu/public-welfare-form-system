import {request, config} from 'utils'
const {api} = config
const {waterworks} = api

export async function getReportInfoList(params) {
  return request({
    url:waterworks+ "/findReportAll",
    method: 'post',
    data:params,
  })
}


export async function downloadReport(params) {
  return request({
    url:waterworks+ "/downloadReport",
    method: 'post',
    data:params,
  })
}

export async function proportion(params) {
  return request({
    url:waterworks+ "/proportion",
    method: 'post',
    data:params,
  })
}

export async function downloadProportion(params) {
  return request({
    url:waterworks+ "/downloadProportion",
    method: 'post',
    data:params,
  })
}


export async function testDownload(params) {
  return request({
    url:waterworks+ "/testDownload",
    method: 'post',
    data:params,
  })
}


export async function updateReport(params) {
  return request({
    url:waterworks+ "/updateReport",
    method: 'post',
    data:params,
  })
}
