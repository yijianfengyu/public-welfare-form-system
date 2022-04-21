import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {config} from 'utils'
import {selectManger,insertManger,UpdateManger,deleteManger,} from '../services/accountManagement'
import {message} from 'antd'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'accountManagement',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    tableList: [],
    CreateModalVisit: false,
    updateValue:{},
    isCreate:false,
    isDiv:"",
    isUpdate:"none",
    listLoading:false,
    vFilter:[],
    shareUrl:'',
    shareModalVisit:false,
    isDisable:false,
    recordIndex:{},
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/accountManagement'||location.pathname === '/visit/personalCenter') {
          let user=JSON.parse(sessionStorage.getItem("UserStrom"))
          if(user==null){
            dispatch({
              type:'app/querys'
            })
          }else {
            if (user.roleId != "1") {

              dispatch({
                type: 'querySuccess',
                payload: {
                  isCreate: true,
                  isDiv: "none",
                  isUpdate: "",
                }
              })
            }
            dispatch({
              type: 'SelectAll',
              payload: {
                //companyCode: user.companyCode,
                //id: user.id,
                //roleType: user.roleType,
              }
            })
            dispatch({
              type: 'querySuccess',
              payload: {
                listLoading: true,
              }
            })
          }
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    //查询
    *SelectAll({payload}, {call,put}){
      const data = yield call(selectManger, payload);
      if (data.success == true) {
        if(data.resultList.length!=0){
          yield put({
            type: 'queryManagerSuccess',
            payload: {
              pagination: {
                total: data.total,
                current: data.currentPage,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
              },
              tableList: data.resultList,
              listLoading:false,
            }
          })
        }else {
          yield put({
            type: 'queryManagerSuccess',
            payload: {
              pagination: {
                total:0,
                current:0,
                pageSize:0,
                totalPages:0,
              },
              tableList:[],
              listLoading:false,
            }
          })
        }
      }
    },

    //删除
    *deleteAccount({payload}, {call,put,select}){
      const data = yield call(deleteManger, payload);
      let recordIndex = yield select(({accountManagement}) => accountManagement.recordIndex);
      let tableList = yield select(({accountManagement}) => accountManagement.tableList);
      if(data.flag == 1){
        message.success(data.message)
        tableList.splice(recordIndex,1)
        yield put({
          type:'querySuccess',
          payload:{
            tableList:tableList,
          }
        })
      }else{
        message.warning(data.message)
      }
    },
    //添加
    *insertAccount({payload}, {call,put}){
      const data = yield call(insertManger, payload);
      if (data.flag == 1) {
        message.success(data.message)
        yield put({
          type: 'hideCreateModalVisit',
          payload:{
            updateValue:{}
          }
        })
        yield put({
          type: 'SelectAll',
          payload: {
            companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
            id: JSON.parse(sessionStorage.getItem("UserStrom")).id,
            roleType:JSON.parse(sessionStorage.getItem("UserStrom")).roleType,
          }
        })
      } else {
        message.warning(data.message)
      }
    },
     //修改
    *UpdateAccount({payload}, {call,put,select}){
      const data = yield call(UpdateManger, payload);
      let recordIndex = yield select(({accountManagement}) => accountManagement.recordIndex);
      let tableList = yield select(({accountManagement}) => accountManagement.tableList);
      if (data.flag == 1) {
        message.success(data.message)
        tableList[recordIndex] = payload.obj
        yield put({
          type: 'hideCreateModalVisit',
          payload:{
            updateValue:{},
            tableList:tableList,
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
    queryManagerSuccess(state, {payload}){
      const {pagination} = payload;
      return {
        ...state, ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    showCreateModalVisit (state, {payload}) {
      return {...state, ...payload, CreateModalVisit: true,}
    },
    hideCreateModalVisit (state, {payload}) {
      return {...state, ...payload, CreateModalVisit: false,}
    },
    showShareModalVisit (state, {payload}) {
      return {...state, ...payload, shareModalVisit: true,}
    },
    hideShareModalVisit (state, {payload}) {
      return {...state, ...payload, shareModalVisit: false,}
    },
  },
})
