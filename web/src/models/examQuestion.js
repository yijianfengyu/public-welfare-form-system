import { login, getRolesAndCompanys, loginOut, checkCompanyCodes, selectAccount } from '../services/login'
import { queryURL } from 'utils'
import { message } from 'antd'
import { warning, warningByPermission } from '../utils/common'
import { routerRedux } from 'dva/router'
import { queryOrganization } from '../services/organization'
import { queryExamQuestion, updateExamQuestion } from '../services/createForm'
import { queryOptions } from '../services/projectManage'

export default {
  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'examQuestion',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    searchValues: {},
    searchList: [],
    pagination: {},
    labelList: [],//题目分类
    searchLoading: false,
    updateModalVisit: false,
    updateType: '',
    defaultColumnType: 'FormInput',//默认新增题目使用类型
    column: {},//列描述
    updateIndex: -1,//更新的索引位置
    columnLabel: '',//分类
    inputOptions: [],//单选，多选的选项
    dropdownInitData: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/visit/examQuestion') {
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
      let labelList = yield select(({ examQuestion }) => examQuestion.labelList)
      if (labelList && labelList.length < 1) {
        //如果没有缓存则后台查询
        let data = yield call(queryOptions, { id: 4 })
        labelList = data.list
      }
      console.log("--查询条件--",payload);
      const data = yield call(queryExamQuestion, payload)
      if (data.success == true) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchValues:payload.searchValues,
            searchList: data.resultList,
            labelList,
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
    * updateExamQuestion ({ payload }, { call, put, select }) {
      //const pagination = yield select(({examQuestion}) => examQuestion.pagination);
      let column = payload.column;

      const searchList = yield select(({ examQuestion }) => examQuestion.searchList)
      let data = null
      if (payload.updateType == 'update') {
        searchList[payload.updateIndex].question = JSON.stringify(column)
        searchList[payload.updateIndex].title = column.title
        searchList[payload.updateIndex].columnScore = column.columnScore
        searchList[payload.updateIndex].label = column.label
        //console.log('===', searchList[payload.updateIndex])
        data = yield call(updateExamQuestion, searchList[payload.updateIndex])
      } else {
        let obj = new Object()
        obj.uuid = column.uuid
        obj.question = JSON.stringify(column);
        obj.title = column.title;
        obj.columnScore=column.columnScore;
        obj.label=column.label;
        obj.createTime=new Date().format('yyyy-MM-dd hh:mm:ss');
        //data
        data = yield call(updateExamQuestion,obj);
        if(data.success == true){
          console.log("---id-----",data);
          obj.id=data.obj;
          searchList.unshift(obj);
          console.log("9999999",searchList);
        }
      }

      if (data.success == true) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchList: searchList,
            updateModalVisit: false,
            column:{}
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
