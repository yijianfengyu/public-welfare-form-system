import {message} from 'antd'
import {queryProjectName,createProjectDaily,queryProjectDailyByPage} from '../services/projectManage'

export default{
  namespace: 'dailyReport',
  state:{
    modalVisible:false,
    modalType:'create',
    expand:false,
    projectName1:[],
    projectName2:[],
    projectName3:[],
    createTime:{},
    dailyReportList:[],
    startTime:"",
    endTime:"",
    filter:{},
  },

  subscriptions: {
    setup ({dispatch,history}) {
      history.listen(location => {
        if (location.pathname === '/visit/DailyReport') {
          dispatch({type: 'querys'})
        }
      })
    },
  },
  effects:{
    *querys ({payload}, {call, put}) {
      const data= yield call(queryProjectDailyByPage, payload);
      let list=data.resultList

      if(data.success){
        yield put({ type: 'dailyReport/querySuccess',
          payload:
          {
            dailyReportList: list,
            pagination:{
              total: data.total,
              current: data.currentPage,
              pageSize: data.pageSize,
              totalPages: data.totalPages,
            }
          } })
      }

    },
    *queryProjectName ({payload}, {call, put}) {
      const {success, list}= yield call(queryProjectName, payload);
      if(success){
        if( 1 == payload.type){
          yield put({ type: 'querySuccess', payload: { projectName1: list, } })
        }else if(2 == payload.type){
          yield put({ type: 'querySuccess', payload: { projectName2: list, } })
        }else if(3 == payload.type){
          yield put({ type: 'querySuccess', payload: { projectName3: list, } })
        }

      }
    },
    *createProjectDaily({payload = {}}, {call, put}){
      const data = yield call(createProjectDaily, payload);
      if(data.success){
        if(data.flag){
          message.success(data.message)
        }else{
          message.error(data.message)
        }
      }
    },
  },
  reducers:{
    querySuccess(state, {payload}){
      return {
        ...state,
        ...payload
      }
    },
  },
}
