import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {message,} from 'antd';
import {queryTempTableByIds,createTempData,queryTempDataById} from '../services/createForm'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'selectForm',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    filterDate: [],
    tempTableList: [],
    vFilter: [],
    EditFormVisit: false,
    previewFrom: [],
    isHide: 'none',
    OneTempDatasList: [],
    onRowList: [],
    selectFromTableVisit: false,
    columns: [],
    columnsList: [],
    dataSourceList: [],
    dateString: undefined,
    OneTempDatasLists: [],
    OneTempDatasListsUpdate: [],
    tempTableListId: {},
    isDate: '',
    query: {},
    isQuery: "",
    objValue: {},
    createFlag: '',
    insertFlag:'',
    insertValues:{},
    columnsValue:{},
    subFormShow:{},//容纳被选中的跳题条件选项的uuid
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history,}) {
      history.listen(location => {
        if (location.pathname === '/submit_success') {
          dispatch({
            type: 'app/querySuccess',
            payload: {
              headerVisible: false,
              menuVisible: false,
            }
          })
          dispatch({
            type: 'queryTempTableById',
            payload: {
              id: location.query.id,
              code_key: location.query.code,
              companyCode:location.query.code,
            }
          })
        }
        if (location.pathname === '/visit/selectForms') {
          dispatch({
            type: 'app/querySuccess',
            payload: {
              headerVisible: false,
              menuVisible: false,
            }
          })
          dispatch({
            type: 'querySuccess',
            payload: {
              query: location.query,
            }
          })
          dispatch({
            type: 'queryTempTableById',
            payload: {
              id: location.query.id,
              companyCode: location.query.code,
              code_key: location.query.code,
              rowDataId: location.query.rowDataId
            }
          })

          if(location.query.method!== undefined){
            dispatch({
              type: 'queryTempDataByIds',
              payload: {
                define_id: location.query.id,
                companyCode: location.query.code,
                data_uuid: location.query.UUID,
                code_key: location.query.code,
                rowDataId: location.query.rowDataId
              }
            })
          }
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    *subFormShowAdd({payload,}, {select,put, call}){
      const subFormShow = yield select(({selectForm}) => selectForm.subFormShow);
      //记录是哪个单选控件的，哪个选项被选中
      subFormShow[payload.uuid]=payload.subUuid;
      //console.log("---显示的跳表---",subFormShow);
      yield put({
        type: 'querySuccess',
        payload: {
          subFormShow
        }
      })

    },
    *queryTempTableById({payload,}, {put, call}) {
      const data = yield call(queryTempTableByIds, payload)
      if (data.flag == '1') {
        let define=JSON.parse(data.obj.define)
        let dataOne=define.schema
        let dataObj = new Object()
        let dataObjValue = new Object()
        for (var k in dataOne) {
         if(dataOne[k].contactType!=undefined){
           dataObj[dataOne[k].col_data] =dataOne[k].contactType;
         }
          //所有的列
        }
        dataObjValue.columns=dataObj

        yield put({
          type: 'querySuccess',
          payload: {
            tempTableListId: data.obj,
            createFlag: data.flag,
            columnsValue:JSON.stringify(dataObjValue),
            rowDataId:payload.rowDataId
          }
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            createFlag: data.flag,
          }
        })
      }
    },
    // 添加模板表数据
    *createTempDatas({payload,}, {put, call,select}) {
      //console.log(payload);
      const data = yield call(createTempData, payload)
      const query = yield select(({selectForm})=> selectForm.query)
      if (data.flag == 1) {
        window.location = `${location.origin}/submit_success?id=`+query.id;
      } else {
        message.warning(data.message)
      }
    },

    *queryTempDataByIds({payload,}, {put, call}) {

      const data = yield call(queryTempDataById, payload)
      if (data.flag == '1') {
        let OneTempDatasListsUpdate = data.obj.resultList
        const ww = []
        const hash = []
        const num = []
        const tiaojian = []
        let obj2 = new Object()
        if (OneTempDatasListsUpdate.length != 0) {
          for (var i = 0; i < OneTempDatasListsUpdate.length; i++) {
            for (var k in OneTempDatasListsUpdate[i]) {
              //所有的列
              ww.push(k)
            }
          }
          //给列去重复
          for (var i = 0; i < ww.length; i++) {
            if (hash.indexOf(ww[i]) == -1) {
              hash.push(ww[i]);
            }
          }

          //获得所有的col_data列
          for (var k in hash) {
            if (hash[k].slice(0, 8) == "col_data") {
              tiaojian.push(hash[k])
            }
          }
          for (var o in OneTempDatasListsUpdate) {
            for (var l in tiaojian) {
              if (OneTempDatasListsUpdate[o][tiaojian[l]] != "") {
                num.push(OneTempDatasListsUpdate[o][tiaojian[l]].col_data)
              }
            }
          }
          for (var o in OneTempDatasListsUpdate) {
            for (var l in num) {
              if (OneTempDatasListsUpdate[o][num[l]].type == "Checkboxes") {
                if (OneTempDatasListsUpdate[o][num[l]][num[l]] != "") {
                  if (OneTempDatasListsUpdate[o][num[l]][num[l]].slice(0, 1) == "[") {
                    obj2[[num[l]]] = JSON.parse(OneTempDatasListsUpdate[o][num[l]][num[l]])
                  } else {
                    obj2[[num[l]]] = OneTempDatasListsUpdate[o][num[l]][num[l]]
                  }

                }
              } else {

                if (OneTempDatasListsUpdate[o][num[l]][num[l]] == "") {
                  obj2[[num[l]]] = ""
                }
                //if(OneTempDatasListsUpdate[o][num[l]][num[l]]=="")
                obj2[[num[l]]] = OneTempDatasListsUpdate[o][num[l]][num[l]]
              }
            }
          }
        }
        yield put({
          type: 'queryTempTableSuccess',
          payload: {
            pagination: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            OneTempDatasList: data.obj.resultList,
            isDate: data.flag,
            objValue: obj2,
          }
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            isDate: data.flag
          }
        })
      }
    },
  },
  reducers: {
    queryTempTableSuccess(state, {payload}){
      const {pagination} = payload;
      return {
        ...state, ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
    showSelectFromTableVisitVisible (state, {payload}) {
      return {...state, ...payload, selectFromTableVisit: true,}
    },
    hidSelectFromTableVisitVisible (state, {payload}) {
      return {...state, ...payload, selectFromTableVisit: false,}
    },

  },
})
