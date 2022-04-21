import { message } from 'antd'
import {
  updateResource,
  deleteResource,
  queryHistoryResources,
  uploadResource,
} from '../services/resource'
import { queryForms, queryOptions } from '../services/projectManage'

export default {
  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'resource',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    searchValues: {},
    searchList: [],
    pagination: {},
    searchLoading: false,
    updateModalVisible: false,
    updateType: '',
    updateIndex: -1,//更新的索引位置
    inputOptions: [],//单选，多选的选项
    dropdownInitData: [],
    fileList:[],
    fileListOne:[],
    fileUrlOne: '',
    fileNameOne: '',
    fileResourcesName:'',
    fileUrl: '',
    fileName: '',
    uploadModalVisible:false,
    resourcesRecord:null,
    formList:[],
    resourcesType:[],
    richTextTypeList:[]
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/visit/resource') {
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
      const data = yield call(queryHistoryResources, payload)
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
    * updateResource ({ payload }, { call, put, select }) {
      const data = yield call(updateResource, payload)
      if (data.success) {
        if (data.flag) {
          message.success('上传资源模板成功')
          yield put({
            type: 'querySuccess',
            payload: {
              updateModalVisible: false,
            },
          })
        } else {
          message.error('上传资源模板失败')
        }
      }
    },
    *deleteResource ({ payload = {} }, { call, put, select }) {
      console.log(payload);
      const data = yield call(deleteResource, payload)
      if (data.success) {
        let searchList = yield select(({ resource }) => resource.searchList)
        searchList.splice(payload.index, 1)
        yield put({
          type: 'querySuccess',
          payload: {
            searchList: searchList,
          },
        })
        message.success('删除成功')
      } else {
        message.success(data.message)
      }
    },
    * addResource ({ payload = {} }, { call, put, select }) {
      const data = yield call(uploadResource, payload)
      if (data.success) {
        if (data.flag) {
          message.success('保存成功')
          let searchValues = yield select(({ resource }) => resource.searchValues)
          let pagination = yield select(({ resource }) => resource.pagination)
          yield put({
            type: 'searchList',
            payload: {
              ...searchValues,
              ...pagination,
              uploadModalVisible: false,
            },
          })
        } else {
          message.error('保存失败')
        }
      }
    },
    /***
     * 弹出资源定义窗口
    ***/
    *popResourceModal ({ payload = {} }, { call, put, select }) {
      //自定表单下拉的列表
      console.log("---##-",payload);
      const data = yield call(queryForms, payload)
      //图文类型
      const richTextType = yield call(queryOptions, { id: 3 })
      let richTextTypeList = [];
      if (richTextType.success) {
        richTextTypeList = richTextType.list
      }
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            formList: data.obj.resultList,
            richTextTypeList,
            updateModalVisible: true,
          },
        })
      }
    },

  },
  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
