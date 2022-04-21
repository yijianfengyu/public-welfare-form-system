import modelExtend from 'dva-model-extend'
import {create, update,register} from '../services/user'
import {updateUnderling,} from '../services/user'
import {query} from '../services/users'
import {message} from 'antd'
import {config} from 'utils'
import {pageModel} from './common'

const {prefix} = config

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    successModel: true,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    list: [],
    user: {},
    roleList: [],
    dateTime: "",
    vFiled: [],
    detailModalVisible: false,
    clickString:"",
    fileList:[],
    cardKey:"1",
    tipsModalVisible:false,
    current:0,
    currentChildSteps:0,
  },

  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/Employee') {
          dispatch({
            type: 'query',
            payload: {
              staffStatus:"ACTIVE",
              user: sessionStorage.getItem('userStorage'),
              currentPage: 1,
            }
          })
          let vFiled = []
          vFiled.staffStatus = "ACTIVE"
          dispatch({
            type: 'querySuccess',
            payload: {
              vFiled
            }
          })
        }
      })
    },
  },

  effects: {
    //查询所有用户信息(employee权限)
    *query ({payload = {}}, {call, put,select}) {
      const data = yield call(query, payload)
      //list[0] 用戶詳細信息  [1]所有角色清單
      if (data.success) {
        let list = []
        if (payload.currentPage == 1 && data.list[0].length>10) {
          for(let i=0;i<10;i++){
            list.push(data.list[0][i])
          }
        } else {
          list = data.list[0]
        }
        let clickString = ""
        if (list.length < data.list[0].length) {
          clickString = "加载余下数据"
        } else {
          clickString = "数据已加载完毕"
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list,
            clickString,
          }
        })
      }
    },
    *create ({payload}, {call, put}) {
        payload.value.codeKey=sessionStorage.getItem("code")
        const data = yield call(create, payload)
        if (data.flag) {
          let users = JSON.parse(sessionStorage.getItem("userStorage"))
          let underling = users.underling.split(",")
          underling.push(payload.userName)
          underling = underling.toString()
          let id = users.id
          yield call(updateUnderling, payload={underling,id})
          yield put({type: 'hideDetailModal'})
          message.success(data.message)
        } else {
          message.warning(data.message)
        }


    },
    *update ({payload}, {call,put}) {
      payload.value.codeKey=sessionStorage.getItem("code")
      const data = yield call(update, payload.value)
      if (data.flag) {
        message.success(data.message+",请重新查询")
      } else {
        message.warning(data.message)
      }
    },
    *register ({payload}, {call,select,put}) {

      payload.value.birthday = yield select(({user}) => user.dateTime);
      payload.value.codeKey = sessionStorage.getItem("code")
      const data = yield call(register, payload)
      if (data.flag) {
        message.success("注册信息已提交，请等待审核")
      } else {
        message.error(data.message)
        yield put({type: 'login/querySuccess', payload: {
          submitLoading:false,
        }})
      }
    },
  },

  reducers: {
    querySuccess (state, {payload}) {
      return {...state, ...payload}
    },

    showDetailModal (state, {payload}) {
      return {...state, ...payload, detailModalVisible: true}
    },

    hideDetailModal (state, {payload}) {
      return {...state, ...payload, detailModalVisible: false}
    },

    operateSuccess (state) {
      return {...state, ...payload, modalVisible: false}
    },

    switchIsMotion (state) {
      localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return {...state, ...payload, isMotion: !state.isMotion}
    },

    updateRole (state, {payload}) {
      const {roleList}=payload;
      return {
        ...state,
        ...payload,
      }
    },

  },
})
