import {login, getRolesAndCompanys, loginOut, checkCompanyCodes,selectAccount} from '../services/login'
import {queryURL} from 'utils'
import {message} from 'antd'
import {warning, warningByPermission} from '../utils/common'
import {routerRedux} from 'dva/router'

export default {
  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'login',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    loginLoading: false,
    loginStatus: false,
    values: [],
    registerModalVisible: false,
    roleList: [],
    companyList: [],
    fileList: [],
    hasPermission: false,
    submitLoading: false,
    userOption: [],
    selectUserModalVisible: false,
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch}) {
      ////保存公司的code
      //
      //if (location.href.indexOf("register") >= 0) {
      //  if (sessionStorage.getItem("code") != null) {
      //    // dispatch({type: 'app/switchSider'})
      //    dispatch({type: 'getRolesAndCompanys'})
      //    dispatch({
      //      type: 'app/querySuccess', payload: {
      //        headerVisible: false,
      //        menuVisible: false,
      //      }
      //    })
      //  } else {
      //    if (location.search.indexOf("code") >= 0) {
      //      let code = location.search.substr(1).match(new RegExp("(^|&)code=([^&]*)(&|$)"))[2]
      //      sessionStorage.setItem("code", code)
      //      dispatch({type: 'getRolesAndCompanys'})
      //      dispatch({
      //        type: 'app/querySuccess', payload: {
      //          headerVisible: false,
      //          menuVisible: false,
      //        }
      //      })
      //    } else {
      //      warningByPermission("检测到您未拥有系统的使用权限，请联系企业管理员或者前往以下网站申请：https://sw.tenonegroup.com")
      //    }
      //  }
      //
      //} else {
      //  if (location.search.indexOf("code") >= 0) {
      //    let code = location.search.substr(1).match(new RegExp("(^|&)code=([^&]*)(&|$)"))[2]
      //    sessionStorage.setItem("code", code)
      //  }
      //}

    },
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    //请求action
    *login ({payload,}, {put, call}) {
      yield put({type: 'showLoginLoading'})
      const data = yield call(login, payload)
      //获取登录结果
      let code = sessionStorage.getItem("code")
      if (data.status == "failing") {
        warningByPermission("检测到您未拥有系统的使用权限，请联系企业管理员或者前往以下网站申请：https://sw.tenonegroup.com")
      } else {
        if (data.success) {
          //登录成功
          const result = data.list[0].loginResult;
          const lastVisitUrl = data.list[0].last_visit_url;
          if (lastVisitUrl) {
            sessionStorage.setItem("last_visit_url", lastVisitUrl)
          }
          if (result == '1') {
            if (data.list[1] instanceof Array) {
              yield put({
                type: 'querySuccess',
                payload: {
                  userOption: data.list[1],
                  selectUserModalVisible: true,
                }
              })
            } else {
              sessionStorage.setItem("UserStrom", JSON.stringify(data.list[1]))
              sessionStorage.setItem("userStorage", JSON.stringify(data.list[1]))
              sessionStorage.setItem("userNameOne", data.list[1].userName)
              sessionStorage.setItem("companyName", data.list[1].companyName)
              if (data.list[1].logo != null && data.list[1].logo != "") {
                let logo = data.list[1].logo
                sessionStorage.setItem("imgOne", logo)
              } else {
                sessionStorage.setItem("imgOne", "")
              }
              yield put({
                  type: 'app/querySuccess',
                  payload: {
                    companyName: sessionStorage.getItem("companyName"),
                    userNameOne: sessionStorage.getItem("userNameOne"),
                    imgOne: sessionStorage.getItem("imgOne"),
                  }
                }
              )
              yield put({type: 'app/querys', param: data.list[1]});
            }
            //window.location.reload();//刷新需要加载的js
          } else if (result == 'unlogin') {
            message.warning("账号未注册")
            yield put({type: 'hideLoginLoading'})
          }
          else if (result == 'inactive') {
            message.warning("该用户已离职")
            yield put({type: 'hideLoginLoading'})
          } else if (result == '0') {
            message.warning("密码错误")
            yield put({type: 'hideLoginLoading'})
          } else if (result == '4') {
            yield put({
              type: 'hideLoginLoading', payload: {
                loginStatus: true
              }
            })
          } else if (result == 'inaudit') {
            message.warning("此用户信息未审核，请联系相关人士")
          }
        } else {
          message.error("网络错误，请重试")
          yield put({type: 'hideLoginLoading'})
        }
      }
    },

    *selectAccount ({payload,}, {put, call}) {
      const data = yield call(selectAccount, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            selectUserModalVisible: false,
          }
        })
        if (data.flag == '1') {
          sessionStorage.setItem("UserStrom", JSON.stringify(data.obj))
          sessionStorage.setItem("userStorage", JSON.stringify(data.obj))
          sessionStorage.setItem("userNameOne", data.obj.userName)
          sessionStorage.setItem("companyName", data.obj.companyName)
          if (data.obj.logo != null && data.obj.logo != "") {
            let logo = data.obj.logo
            sessionStorage.setItem("imgOne", logo)
          } else {
            sessionStorage.setItem("imgOne", "")
          }
          yield put({
              type: 'app/querySuccess',
              payload: {
                companyName: sessionStorage.getItem("companyName"),
                userNameOne: sessionStorage.getItem("userNameOne"),
                imgOne: sessionStorage.getItem("imgOne"),
              }
            }
          )
          yield put({type: 'app/querys', param: data.obj});
        }
      }
    },
    *loginByEmail ({payload,}, {put, call}) {
      yield put({type: 'showLoginLoading'})
      //获取登录结果
      const data = yield call(login, payload)
      if (data.success) {
        //登录成功
        let result = data.list[0].loginResult;
        if (result == '1') {
          sessionStorage.setItem("UserStrom", JSON.stringify(data.list[1]))
          sessionStorage.setItem("userStorage", JSON.stringify(data.list[1]))
          yield put({type: 'app/querys', param: data.list[1]})
          yield put(routerRedux.push("/visit/projectManage"));
        }
        else if (result === 'unlogin') {
          message.warning("未注册")
          yield put({type: 'hideLoginLoading'})
        }
        else if (result == '0') {
          message.warning("密码错误")
          yield put({type: 'hideLoginLoading'})
        }
        else if (result == '4') {
          yield put({
            type: 'hideLoginLoading', payload: {
              loginStatus: true
            }
          })
        }
        else if (result == 'inaudit') {
          message.warning("此用户信息未审核，请联系相关人士")
        }
        else {
          message.error("网络错误，请重试")
          yield put({type: 'hideLoginLoading'})
        }
      }
    },
    *checkCompanyCodes ({payload,}, {put, call}) {
      //获取登录结果
      const data = yield call(checkCompanyCodes, payload)

      if (data.success) {
        //登录成功
        if (data.list[0] == "true") {
          yield put({
            type: 'querySuccess',
            payload: {
              hasPermission: true,
            }
          })
        }
      } else {

      }
    },
    *mandatoryLogin ({payload,}, {put, call}) {
      const data = yield call(loginOut, payload.values)
      if (data.success) {
        yield put({
          type: 'login',
          payload: {
            userName: payload.values.userName,
            password: payload.values.password
          }
        })
      }
    },
    *getRolesAndCompanys ({payload,}, {put, call}) {
      // const data = yield call(getRolesAndCompanys, payload)
      // //获取登录结果
      // let code=sessionStorage.getItem("code")
      // if(data.status == "failing"){
      //   warningByPermission("检测到您未拥有系统的使用权限，请联系企业管理员或者前往以下网站申请：https://sw.tenonegroup.com")
      // }else if (data.success) {
      //     // 未注册
      //     yield put({
      //       type: 'querySuccess',
      //       payload: {
      //         roleList: data.list[0],
      //         companyList: data.list[1],
      //       }
      //     })
      //
      // }
    },
    *goToRegister ({payload,}, {put, call}) {
      // const data=yield call(getCreateMaxNumber, payload);
      // if(data.status == "failing" || sessionStorage.getItem("code") == "") {
      //   warningByPermission("检测到您未拥有系统的使用权限，请联系企业管理员或者前往以下网站申请：https://sw.tenonegroup.com")
      // }else if(false == data.list[0]){
      //   yield put({
      //     type: 'app/querySuccess',payload:{
      //       addStaffPermission:data.list[0],
      //     }
      //   })
      //   warning("没有剩余可添加用户数量");
      // }else{

      // yield put({
      //   type: 'app/querySuccess',payload:{
      //     headerVisible:false,
      //     menuVisible:false,
      //   }
      // })
      // yield put({
      //   type: 'login/getRolesAndCompanys'
      // })

      // yield put(routerRedux.push("register",{code_key: sessionStorage.getItem("code")}))
      window.location = `${location.origin}/register?code=` + sessionStorage.getItem("code")
      // }
    },
  },
  // 该属性存放的是对state的合并方法。基本上就是将新的state值合并到原来的state中, 以达到state的同步。reducer的含义就是多个合并返回一个的意思。
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state, {payload}) {
      return {...state, ...payload, loginLoading: false}
    },
  },
}
