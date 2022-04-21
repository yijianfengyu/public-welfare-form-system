import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {config} from 'utils'
import {updateOrganization,queryOrganization} from '../services/organization'
import {message} from 'antd'
const {api,download} = config
const {dingding} = api
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'organization',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    companyInformation: {},
    userCompanyName: '',
    id: 0,
    fileList: [],
    fileUrl: '',
    fileName: '',
    text: ''
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/organization') {
          let user = JSON.parse(sessionStorage.getItem("UserStrom"))
          if (user == null) {
            dispatch({
              type: 'app/querys'
            })
          } else {
            dispatch({
              type: 'SelectAll',
              payload: {
                //companyCode: user.companyCode,
              }
            })
          }
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    *SelectAll({payload}, {call,put,}){
      const data = yield call(queryOrganization, payload);
      if (data.success == true) {
        if (data.list.length != 0) {
          const List = []
          if (data.list[0].logo != ""&&data.list[0].logo!=null) {
            List.push({
              uid: -1,
              name: data.list[0].logo,
              status: 'done',
              url: download + "/" + data.list[0].logo,
              thumbUrl: download + "/" + data.list[0].logo,
            })
          }
          yield put({
            type: 'querySuccess',
            payload: {
              companyInformation: data.list[0],
              id: data.list[0].id,
              fileList: List
            }
          })
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              companyInformation: JSON.parse(sessionStorage.getItem("UserStrom")),
              id: 0,
            }
          })
        }
      }
    },
    *updateOrganization({payload}, {call,put,select}){
      const data = yield call(updateOrganization, payload);
      const userCompanyName = yield select(({organization})=> organization.userCompanyName)
      const fileUrl = yield select(({organization})=> organization.fileUrl)
      sessionStorage.setItem("companyName", userCompanyName)
      if (fileUrl != "") {
        let logo =fileUrl
        sessionStorage.setItem("imgOne", logo)
      }else if(fileUrl == ""){
        sessionStorage.setItem("imgOne", "")
      }
      if (data.flag == 1) {
        message.success(data.message)
        yield put({
          type: 'app/querySuccess',
          payload: {
            companyName: sessionStorage.getItem("companyName"),
            imgOne: fileUrl==""?"":sessionStorage.getItem("imgOne")
          }
        })
        yield put({
          type: 'querySuccess',
          payload: {
            text: ''
          }
        })
        yield put({
          type: 'SelectAll',
          payload: {
            //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
          }
        })
      } else {
        message.warning(data.message)
      }
    }
  },
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
    queryOrganizationSuccess(state, {payload}){
      const {pagination} = payload;
      return {
        ...state, ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    showOrganizationModalVisit (state, {payload}) {
      return {...state, ...payload, OrganizationModalVisit: true,}
    },
    hideOrganizationModalVisit (state, {payload}) {
      return {...state, ...payload, OrganizationModalVisit: false,}
    },
  },
})
