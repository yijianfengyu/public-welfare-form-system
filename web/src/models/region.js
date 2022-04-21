import { login, getRolesAndCompanys, loginOut, checkCompanyCodes, selectAccount } from '../services/login'
import { queryURL } from 'utils'
import { message } from 'antd'
import { warning, warningByPermission } from '../utils/common'
import { routerRedux } from 'dva/router'
import { queryOrganization } from '../services/organization'
import { queryExamQuestion, queryRegion, updateExamQuestion, updateRegion } from '../services/createForm'
import { queryOptions } from '../services/projectManage'

export default {
  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'region',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    searchValues: {},
    searchList: [],
    pagination: {},
    searchLoading: false,
    updateModalVisible: false,
    updateType: '',
    updateIndex: -1,//更新的索引位置
    regionRecord: {},//更新的索引位置
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/visit/region') {
          let user = JSON.parse(sessionStorage.getItem('UserStrom'))
          if (user == null) {
            dispatch({
              type: 'app/querys',
            })
          } else {
            dispatch({
              type: 'searchList',
              payload: {
                //companyCode: user.companyCode,
              },
            })
          }
        }
      })
    },
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    * searchList ({ payload }, { call, put, select }) {
      console.log("--查询条件--",payload);
      const data = yield call(queryRegion, payload);
      console.log(data);
      if (data.success == true) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchValues:payload.searchValues,
            searchList: data.resultList,
            pagination: {
              current: data.currentPage,
              pageSize: data.pageSize,
              total: data.total,
              totalPage: data.totalPages,
              showSizeChanger: false,
            },
            searchLoading: false,
          },
        })
      }
    },
    * updateRegion ({ payload }, { call, put, select }) {
      console.log("----上传数据:",payload);
      const searchList = yield select(({ region }) => region.searchList)
      let data = null
      if (payload.updateType == 'update') {
        payload.flag=0;
        data = yield call(updateRegion, payload);
        console.log('========',data);
        const updateIndex = yield select(({ region }) => region.updateIndex);
        console.log(updateIndex,payload);
        searchList.splice(updateIndex,1,payload);
      } else {
        //新增
        payload.flag=1;
        data = yield call(updateRegion,payload);
        if(data.success == true){
          payload.createTime=new Date().format('yyyy-MM-dd hh:mm:ss');
          searchList.unshift(payload);
          console.log("9999999",searchList);
        }
      }

      if (data.success == true) {
        if(data.flag==1){
          yield put({
            type: 'querySuccess',
            payload: {
              searchList: [].concat(searchList),
              updateModalVisible: false,
              updateType: '',
              updateIndex: -1,//更新的索引位置
            },
          })
        }else{
          message.warn(data.message);
        }

      }
    },
  },
  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
