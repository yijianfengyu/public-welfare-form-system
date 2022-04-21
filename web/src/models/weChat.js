import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {config} from 'utils'
import {queryGoAuthorUrl,queryWxInfo,queryMaterial,insertMaterial,updateMaterial,sendMaterial,deleteMaterial} from '../services/weChat'
import {message} from 'antd'
const {api,download} = config

export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'weChat',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    authorizationUrl:"",
    wxInfoList:[],
    wxInfoRecord:{},
    materialList:[],
    listLoading:false,
    authorizationModalVisible: false,
    materialType:"news",
    addMaterialModalVisible:false,
    materialRecord:{},
    materialRecordItem:{},
    editorState:null,
    imageListModalVisible:false,
    imageList:[],
    materialSaveType:"insert",//编辑素材modal类型，insert|update
    imageSaveType:"cover",//打开图片modal类型，cover|content
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/weChat') {
            dispatch({
              type: 'SelectAll',
              payload: {
              }
            })
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    *SelectAll({payload}, {call,put,select}){
      const data = yield call(queryWxInfo, payload);
      if (data.success == true) {
        let defaultWxInfo = {};
        if(data.obj.length>0){
          defaultWxInfo = data.obj[0]
        }
        yield put({
          type: 'querySuccess',
          payload: {
            wxInfoList:data.obj,
            wxInfoRecord:defaultWxInfo
          }
        })
      }
    },
    *queryMaterial({payload}, {call,put,select}){
      const data = yield call(queryMaterial, payload);
      if (data.success == true) {
        yield put({
          type: "querySuccessPage",
          payload: {
            materialList: data.resultList,
            listLoading: false,
            pagination: {
              current: data.currentPage,
              pageSize: data.pageSize,
              total: data.total,
              totalPage: data.totalPages,
              showSizeChanger:false,
            }
          }
        })
      }
    },
    *queryMaterialImage({payload}, {call,put,select}){
      const data = yield call(queryMaterial, payload);
      if (data.success == true) {
        yield put({
          type: "querySuccessPageImg",
          payload: {
            imageList: data.resultList,
            listLoading: false,
            paginationImg: {
              current: data.currentPage,
              pageSize: data.pageSize,
              total: data.total,
              totalPage: data.totalPages,
              showSizeChanger:false,
            }
          }
        })
      }
    },
    *insertMaterial({payload}, {call,put,select}){
      const data = yield call(insertMaterial, payload);
      let wxInfoRecord = yield select(({weChat}) => weChat.wxInfoRecord);
      let materialType = yield select(({weChat}) => weChat.materialType);

      if (data.success == true) {
        if(data.flag==1){
          yield put({
            type: 'querySuccess',
            payload: {
              addMaterialModalVisible:false,
            }
          })
          yield put({
            type: 'queryMaterial',
            payload: {
              appid:wxInfoRecord.authorizerAppid,
              materialType: materialType,
            }
          })
          message.success(data.message)
        }else{
          message.error(data.message)
        }
      }
    },
    *updateMaterial({payload}, {call,put,select}){
      const data = yield call(updateMaterial, payload);
      let wxInfoRecord = yield select(({weChat}) => weChat.wxInfoRecord);
      let materialType = yield select(({weChat}) => weChat.materialType);

      if (data.success == true) {
        if(data.flag==1){
          yield put({
            type: 'querySuccess',
            payload: {
              addMaterialModalVisible:false,
            }
          })
          yield put({
            type: 'queryMaterial',
            payload: {
              appid:wxInfoRecord.authorizerAppid,
              materialType: materialType,
            }
          })
          message.success(data.message)
        }else{
          message.error(data.message)
        }
      }
    },
    *deleteMaterial({payload}, {call,put,select}){
      const data = yield call(deleteMaterial, payload);
      let wxInfoRecord = yield select(({weChat}) => weChat.wxInfoRecord);
      let materialType = yield select(({weChat}) => weChat.materialType);
      if (data.success == true) {
        if(data.flag==1){
          yield put({
            type: 'queryMaterial',
            payload: {
              appid:wxInfoRecord.authorizerAppid,
              materialType: materialType,
            }
          })
          message.success(data.message)
        }else{
          message.error(data.message)
        }
      }
    },
    *sendMaterial({payload}, {call,put,select}){
      const data = yield call(sendMaterial, payload);
      if (data.success == true) {
        if(data.flag==1){
          message.success(data.message)
        }else{
          message.error(data.message)
        }
      }
    },
    *queryGoAuthorUrl({payload}, {call,put,select}){
      const data = yield call(queryGoAuthorUrl, payload);
      if (data.success == true) {
        yield put({
          type: "querySuccess",
          payload: {
            authorizationUrl: data.obj,
          }
        })
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
    querySuccessPage(state, {payload}){
      const {pagination} = payload;
      return {
        ...state, ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    querySuccessPageImg(state, {payload}){
      const {paginationImg} = payload;
      return {
        ...state, ...payload,
        paginationImg: {
          ...state.paginationImg,
          ...paginationImg,
        }
      }
    },
  },
})
