import {request, config} from 'utils'
const {api} = config
const {user, userLogout, userLogin} = api

// export async function login (params) {
//   return request({
//     url: userLogin+,
//     method: 'get',
//     data: params,
//   })
// }

export async function logout(params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  })
}
export async function getUnreadMessage(params) {
  // return request({
  //   url: userLogin + "/getUnreadMessage",
  //   method: 'get',
  //   data: params,
  // })
}

//查询用户权限
export async function queryMenu(params) {
  let p = params
  if (params != undefined) {
    if (params.user != undefined) {
      p = params.user
    }
    return request({
      url: userLogin + "/getMenu",
      method: 'get',
      data: p,
    })
  }else{
    return {success:false, obj:null}
  }
}

//查询用户权限
// export async function query(params) {
//   let userInfo = ""
//   let p = params
//   if (params != undefined) {
//     if (params.user != undefined) {
//       p = params.user
//     }
//     userInfo = userLogin + '/getStaffInfoById';
//   }
//
//   return request({
//     url: userInfo,
//     method: 'post',
//     data: p,
//   })
// }

export async function getCreateMaxNumber(params) {
  return request({
    url: userLogin + "/getCreateMaxNumber",
    method: 'get',
    data: params,
  })
}
