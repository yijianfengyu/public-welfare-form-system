import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {config} from 'utils'
import {message, Modal} from 'antd'

const {api, download} = config
import {getReportInfoList, downloadReport,proportion,downloadProportion,updateReport,testDownload} from '../services/report'

export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'report',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    tempTableList: [],
    paginations: {},
    text: '',
    IntroInfoVisible: false,
    listLoading: false,
    proportionLoading:false,
    vFilter: {},
    proportionList:[],
    createModalVisible:false,
    updateValue:{},
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/report') {
          dispatch({
            type: 'getReportInfoList',
            payload: {}
          })
          dispatch({
            type: 'proportion',
            payload: {}
          })
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    * getReportInfoList({payload}, {call, put, select}) {
      const data = yield call(getReportInfoList, payload.value);
      if (data.success == true) {
        yield put({
          type: "querySuccess",
          payload: {
            tempTableList: data.obj.list,
            paginations: {
              total: data.obj.total,
              totalPages: data.obj.totalPages,
              pageSize: data.obj.pageSize,
              currentPage: data.obj.currentPage,
            },
            listLoading: false,
          }
        })
      }
    },


    * proportion({payload}, {call, put, select}) {
      const data = yield call(proportion, payload.value);
      console.log(data);
      if (data.flag ===1) {
        yield put({
          type: "querySuccess",
          payload: {
            proportionList: data.obj,
            proportionLoading: false,
          }
        })
      }
    },

    * updateReport({payload}, {call, put, select}) {
      const data = yield call(updateReport, payload);
      console.log(data);
      if (data.flag ===1) {
        yield put({
          type: "getReportInfoList",
          payload: {
          }
        });
        message.success("修改成功");
      }else{
        message.warning("修改失败");
      }
    },


    * download({payload}, {call, put}) {
      const data = yield call(downloadReport, payload.value);
      console.log(data);
      if (data.success) {
        let str = data.list[0].split("/")
        Modal.confirm({
          title: '确认框',
          content: '是否下载？',
          onOk() {
            window.open(download + "/" + str[str.length - 1]);
          },
          onCancel() {
            return
          }
        })
      } else {
        message.warning("下载失败")
      }
      yield put({
        type: "querySuccess",
        payload: {
          listLoading: false,
        }
      })
    },


    * testDownload({payload}, {call, put}) {
      const data = yield call(testDownload, payload);
      console.log(data);
      if (data.success) {
        let str = data.list[0].split("/")
        Modal.confirm({
          title: '确认框',
          content: '是否下载？',
          onOk() {
            window.open(download + "/" + str[str.length - 1]);
          },
          onCancel() {
            return
          }
        })
      } else {
        message.warning("下载失败")
      }
      yield put({
        type: "querySuccess",
        payload: {
          listLoading: false,
        }
      })
    },


    * downloadProportion({payload}, {call, put}) {
      const data = yield call(downloadProportion, payload.value);
      console.log(data);
      if (data.success) {
        let str = data.list[0].split("/")
        Modal.confirm({
          title: '确认框',
          content: '是否下载？',
          onOk() {
            window.open(download + "/" + str[str.length - 1]);
          },
          onCancel() {
            return
          }
        })
      } else {
        message.warning("下载失败")
      }
      yield put({
        type: "querySuccess",
        payload: {
          proportionLoading: false,
        }
      })
    },

  },


  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    querySuccessPage(state, {payload}) {
      const {pagination} = payload;
      return {
        ...state, ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    querySuccessPageImg(state, {payload}) {
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
