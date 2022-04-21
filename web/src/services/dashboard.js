import {request, config} from 'utils'
const {api} = config
const {homePage} = api


export async function queryHomeCounts(params) {
  return request({
    url: homePage + "/queryHomeCounts",
    method: 'post',
    data: params,
  })
}

export async function queryPeopleHotMapService(params) {
  return request({
    url: homePage + "/queryBaiduMapData",
    method: 'post',
    data: params,
  })
}

