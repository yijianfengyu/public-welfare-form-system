import { queryAccount } from '../services/account'
import { getPartnerList } from '../services/projectManage'

export default {
  namespace: 'account',
  state: {
    searchValues: {},
    searchList: [],
    pagination: {},
    searchLoading: false,
    bindModalVisible: false,
    updateType: '',
    userId: '',
    partnerId: '',
    updateIndex: -1,//更新的索引位置
    accountRecord: {},//更新的索引位置
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/visit/account') {
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
  effects: {
    * searchList ({ payload }, { call, put, select }) {
      console.log("--查询条件--",payload);
      const data = yield call(queryAccount, payload);
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
    * queryPartnerList ({ payload = {} }, { call, put, select }) {
      const data = yield call(getPartnerList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            projectPartnerList: data.list,
          },
        })
      }
    },
    * updateUserPartner ({ payload = {} }, { call, put, select }) {
      const data = yield call(updateUserPartner, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            projectPartnerList: data.list,
          },
        })
      }
    },
    /** updateAccount ({ payload }, { call, put, select }) {
      console.log("----上传数据:",payload);
      const searchList = yield select(({ account }) => account.searchList)
      let data = null
      if (payload.updateType == 'update') {
        payload.flag=0;
        data = yield call(updateAccount, payload);
        console.log('========',data);
        const updateIndex = yield select(({ account }) => account.updateIndex);
        console.log(updateIndex,payload);
        searchList.splice(updateIndex,1,payload);
      } else {
        //新增
        payload.flag=1;
        data = yield call(updateAccount,payload);
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
    },*/
  },
  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
