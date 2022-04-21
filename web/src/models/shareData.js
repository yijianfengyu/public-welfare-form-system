import {message,Tooltip} from 'antd'
import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import styles2 from '../utils/commonStyle.less'
import { EditorState} from 'draft-js';
import {queryAllTempDataByPage,queryAllTempDataByDefineId,openEditDataModal,modifyFormDataByPw,vertifyPw} from '../services/createForm'
import {download} from '../utils/config'
import TablesUtils from '../utils/TableUtils'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'shareData',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    columns: [],
    dataSourceList: [],
    filterColumns: [],
    vFilter: [],
    title: "",//标题
    tableDefine: [],
    orderByStatus:false,
    loadingSpinning:false,
    affirmingVisible:true,//免责申明
    cityList:[],
    isPwEditFormDataVisiable:false,
    tempTableListId:{}, columnsValue:{},vertifyError:true
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/shareData') {
          dispatch({
            type: 'app/querySuccess',
            payload: {
              headerVisible: false,
              menuVisible: false,
            }
          })
          if (location.query != null) {

            if(location.query.define!=undefined){
              dispatch({
                type: 'queryAllTempDataByPage',
                payload: {
                  define: location.query.define,
                  dataSource:[],
                }
              })
            }else{
              dispatch({
                type: 'queryAllTempDataByDefineId',
                payload: {
                  define_id: location.query.define_id,
                }
              })
            }
          }
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    // 查询模板表所有数据
    *queryAllTempDataByPage({payload,}, {put, call, select,}){

      const data =  yield call(queryAllTempDataByPage, payload)
      let filterFormValue = TablesUtils.filterForm(JSON.parse(data.obj.temp.define));
      let columnRelateContactValue = TablesUtils.columnRelateContact(data.obj);
      if (data.flag === 1) {
        let value = TablesUtils.parseTableDefine(data.obj.temp.define);

        let datas=payload.dataSource.concat(data.obj.resultList?data.obj.resultList:[]);
        yield put({
          type: 'queryTempTableSuccess',
          payload: {
            pagination: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            filterColumns: filterFormValue,
            columns: value,
            dataSourceList:datas ,

            title: data.obj.temp.formTitle,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            orderByStatus:!payload.orderByStatus,//为原来的反向值
            loadingSpinning:false,
          }
        })
      } else if (data.flag === 0) {

        let value = TablesUtils.parseTableDefine(data.obj.temp.define);
        yield put({
          type: 'queryTempTableSuccess',
          payload: {
            pagination: {
              total: 0,
              current: 0,
              pageSize: 0,
              totalPages: 0,
            },
            filterColumns: filterFormValue,
            columns: value,
            dataSourceList: payload.dataSource.concat(data.obj.resultList?data.obj.resultList:[]),
            title: data.obj.temp.formTitle,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            orderByStatus:!payload.orderByStatus,
            loadingSpinning:false,
          }
        })
      }
    },// 查询模板表所有数据
    *queryAllTempDataByDefineId({payload,}, {put, call, select,}){
      const data = yield call(queryAllTempDataByDefineId, payload)
      let filterFormValue = TablesUtils.filterForm(JSON.parse(data.obj.temp.define));
      //let columnRelateContactValue = TablesUtils.columnRelateContact(data.obj);
      if (data.flag === 1) {
        let value = TablesUtils.parseTableDefine(data.obj.temp.define);
        yield put({
          type: 'queryTempTableSuccess',
          payload: {
            pagination: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            filterColumns: filterFormValue,
            columns: value,
            dataSourceList: data.obj.resultList,
            cityList: data.obj.others,
            title: data.obj.temp.formTitle,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            formDescription: data.obj.temp.formDescription,//描述
          }
        })
      } else if (data.flag === 0) {
        let value = TablesUtils.parseTableDefine(data.obj.temp.define);
        yield put({
          type: 'queryTempTableSuccess',
          payload: {
            pagination: {
              total: 0,
              current: 0,
              pageSize: 0,
              totalPages: 0,
            },
            filterColumns: filterFormValue,
            columns: value,
            dataSourceList: [],
            cityList: data.obj.others,
            title: data.obj.temp.formTitle,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            formDescription: data.obj.temp.formDescription,//描述
          }
        })
      }
    },
    *openEditDataModal({payload,}, {put, call, select,}){
      if(sessionStorage.getItem("vertify_modify_pw")==null){
        yield put({
          type: 'querySuccess',
          payload: {
            vertifyError:true,
            isPwEditFormDataVisiable:true,
            ...payload,
          }
        })
      }else{
        //带上缓存去校验
        payload.vertify_modify_pw=sessionStorage.getItem("vertify_modify_pw");
        const data = yield call(openEditDataModal, payload);
        if (data.flag == 1) {
          yield put({
            type: 'querySuccess',
            payload: {
              tempTableListId: data.obj,
              ...payload,
              vertifyError:false,
              isPwEditFormDataVisiable:true,
            }
          })
        }else{
          //服务器缓存校验失败,删除旧的缓存
          sessionStorage.removeItem("vertify_modify_pw")
          yield put({
            type: 'querySuccess',
            payload: {
              ...payload,
              vertifyError:true,
              isPwEditFormDataVisiable:true,
            }
          })
        }
      }

    },
    *modifyFormDataByPw({payload,}, {put, call, select,}){
      const data = yield call(modifyFormDataByPw, payload)
      yield put({
        type: 'querySuccess',
        payload: {
          isPwEditFormDataVisiable: false,
        }
      })
    },
    *vertifyPw({payload,}, {put, call, select,}){
      const data = yield call(vertifyPw, payload);
      if(data.flag==1){
        sessionStorage.setItem("vertify_modify_pw",data.obj.vertify_modify_pw);//设置缓存
        //查询数据
        payload.vertify_modify_pw=data.obj.vertify_modify_pw;
        const data2 = yield call(openEditDataModal, payload);
        if (data2.flag == 1) {
          yield put({
            type: 'querySuccess',
            payload: {
              tempTableListId: data2.obj,
              ...payload,
              vertifyError:false,
              isPwEditFormDataVisiable:true,
            }
          })
        }

      }else{
        yield put({
          type: 'querySuccess',
          payload: {
            isPwEditFormDataVisiable: true,
            vertifyError:true,
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
  },
})
