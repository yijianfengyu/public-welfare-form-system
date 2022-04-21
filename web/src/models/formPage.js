import {message,Modal,Tooltip} from 'antd'
import styles2 from '../utils/commonStyle.less'
import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import { EditorState} from 'draft-js';
import {download} from '../utils/config'
import TablesUtils from '../utils/TableUtils'
import {SelectPrincipal} from '../services/contactManagement'//查询负责人方法
import  {queryTempTable,deleteTempTable,updateTempTable,createTempTable,queryAllTempData,deleteTempData,
  onTempTableExcelModel,queryTempDataFrom,createTempData} from '../services/formPage'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'formPage',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    listLoading: false,//表单页面的圈圈
    activateKey: '1',//标签页的key
    createFromPageVisit: false,
    tablevalue: 0,
    inputType: 'Text',//选项类型
    uuid: 0,//生成选项的key
    buttonText: '',//添加表单内容时的绑定联系人名称
    contactType: false,//添加表单内容是的绑定联系人状态
    disabledSelect: false,
    tableList: [],//添加修改时的表单内容
    updateIndex: [],
    updateUuid: 0,//修改时表单时下拉框的uuid
    inputOptions: [],//增加修改表单时下拉框初始的值
    recordHideOne: {},//修改列时的值
    inputTypeOption: [],
    updateDefineModalVisit: false,
    tempTableList: [],
    vFilter: [],//查询所有表单的筛选条件
    selectList: [],//所有负责人
    tablePage: {},//页数
    dataTablePage: {},//数据页面页数
    editorState: EditorState.createEmpty(),//表单描述
    buttonType: false,//修改表单内容是的绑定联系人状态
    updateButtonText: false,//修改表单内容时的绑定联系人名称
    recordValue: {},//修改表单的值
    listDataLoading: false,
    tabDisabled: true,
    dataDefine_id: '',
    contactLine: {},//表单数据的绑定联系人列名
    filterDataLine: [],//表单数据的条件列
    dataLine: [],//表单数据的列
    tableLineData: [],//表单所有数据
    deleteIndex: '',
    vFilterData: [],
    excelModalVisit: false,
    fileList: [],
    systemEnvironmentData: [],
    systemEnvironmentTitle: [],
    channelTitle: [],
    channelData: [],
    eyeLink: '',
    eyeModalVisit: false,
    previewFromValue: '',
    checked: false,
    reacdDataDefind: "",
    reacdDataValue: {},
    UpdateDataModalVisit: false,
    contactSelectValue: TablesUtils.getContactTypeDefine(),
    contactSelectValueUpdate:TablesUtils.getContactTypeDefineForUpdate(),
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/formPage') {
          let user = JSON.parse(sessionStorage.getItem("UserStrom"))
          if (user == null) {
            dispatch({
              type: 'app/querys'
            })
          } else {
            dispatch({
              type: 'queryTempTable',
              payload: {
                companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
              }
            })
            dispatch({
              type: 'SelectPrincipal',
              payload: {
                companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
              }
            })
            dispatch({
              type: 'querySuccess',
              payload: {
                tabDisabled: true,
                activateKey: "1",
                tableLineData: [],
              }
            })
          }
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    //查询负责人
    *SelectPrincipal({payload}, {call,put}){
      const data = yield call(SelectPrincipal, payload);
      if (data.success == true) {
        yield put({
          type: 'querySuccess',
          payload: {
            selectList: data.list,
          }
        })
      }
    },
    //查询所有表单
    *queryTempTable({payload,}, {put, call}) {
      const data = yield call(queryTempTable, payload)
      if (data.flag == '1') {
        let obj = new Object()
        obj.total = data.obj.total
        obj.current = data.obj.currentPage
        obj.pageSize = data.obj.pageSize
        obj.totalPages = data.obj.totalPages
        yield put({
          type: 'queryTempTableSuccess',
          payload: {
            pagination: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            tablePage: obj,
            tempTableList: data.obj.resultList,
            //filterDate: undefined,
            listLoading: false
          }
        })
      } else {
        yield put({
          type: 'queryTempTableSuccess',
          payload: {
            pagination: {
              total: 0,
              current: 0,
              pageSize: 0,
              totalPages: 0,
            },
            tablePage: {},
            tempTableList: [],
            filterDate: undefined,
            listLoading: false
          }
        })
      }
    },
    //删除表单
    *deleteTempTable({payload,}, {put, call,select})
    {
      const data = yield call(deleteTempTable, payload)
      const tablePage = yield select(({formPage})=> formPage.tablePage)
      const vFilter = yield select(({formPage})=> formPage.vFilter)
      if (data.flag == '1') {
        let value = new Object()
        value = vFilter
        value.pageSize = tablePage.pageSize
        value.currentPage = tablePage.current
        value.companyCode = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
        yield put({
          type: 'queryTempTable',
          payload: {
            value
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
    //修改表单
    *updateTempTable({payload,}, {put, call,select}) {
      const data = yield call(updateTempTable, payload)
      const tablePage = yield select(({formPage})=> formPage.tablePage)
      const vFilter = yield select(({formPage})=> formPage.vFilter)
      if (data.flag == '1') {
        let value = new Object()
        value = vFilter
        value.pageSize = tablePage.pageSize
        value.currentPage = tablePage.current
        value.companyCode = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
        yield put({
          type: 'queryTempTable',
          payload: {
            value
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
    //添加表单
    *createTempTable({payload,}, {put, call}) {
      const data = yield call(createTempTable, payload)
      if (data.flag == '1') {
        yield put({
          type: 'queryTempTable',
          payload: {
            companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
    // 查询模板表所有数据
    *queryAllTempData({payload,}, {put, call, select,}){
      const data = yield call(queryAllTempData, payload)
      //const filterFormValue =TablesUtils.filterForm(data.obj);
      //const columnRelateContactValue = TablesUtils.columnRelateContact(data.obj)
      let filterFormValue = TablesUtils.filterForm(JSON.parse(data.obj.temp.define));
      let columnRelateContactValue = TablesUtils.columnRelateContact(data.obj);
      if (data.flag === 1) {
        let tableColumns = TablesUtils.tableDataAnalysis(data.obj.temp.define);
        //分页
        let objPage = new Object()
        objPage.total = data.obj.total
        objPage.current = data.obj.currentPage
        objPage.pageSize = data.obj.pageSize
        objPage.totalPages = data.obj.totalPages
        yield put({
          type: 'queryTempTableDataSuccess',
          payload: {
            paginationData: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            dataTablePage: objPage,
            dataLine:tableColumns,
            tableLineData: data.obj.resultList,
            filterDataLine: filterFormValue,
            contactLine: columnRelateContactValue,
            listDataLoading: false,
          }
        })
      } else if (data.flag === 0) {
        let value = TablesUtils.parseTableDefine(data.obj);
        yield put({
          type: 'queryTempTableDataSuccess',
          payload: {
            paginationData: {
              total: 0,
              current: 0,
              pageSize: 0,
              totalPages: 0,
            },
            dataTablePage: {},
            dataLine: value,
            tableLineData: [],
            filterDataLine: filterFormValue,
            contactLine: columnRelateContactValue,
            listDataLoading: false,
          }
        })
      }
    },
    // 删除模板表数据
    *deleteTempData({payload,}, {put, call, select,}){
      const data = yield call(deleteTempData, payload)
      const dataTablePage = yield select(({formPage})=> formPage.dataTablePage)
      const deleteIndex = yield select(({formPage})=> formPage.deleteIndex)
      const tableLineData = yield select(({formPage})=> formPage.tableLineData)
      if (data.flag == '1') {
        message.success(data.message)
        tableLineData.splice(deleteIndex, 1);
        dataTablePage.total = dataTablePage.total - 1
        yield put({
          type: 'queryTempTableDataSuccess',
          payload: {
            paginationData: {
              total: dataTablePage.total,
              current: dataTablePage.current,
              pageSize: dataTablePage.pageSize,
              totalPages: dataTablePage.totalPages,
            },
            tableLineData: tableLineData,
            dataTablePage: dataTablePage,
          }
        })
      } else {
        message.warning(data.message)
      }
    },
    // 修改模板表数据
    *updateTempData({payload,}, {put, call, select})
    {
      const data = yield call(createTempData, payload)
      const deleteIndex = yield select(({formPage})=> formPage.deleteIndex)
      const tableLineData = yield select(({formPage})=> formPage.tableLineData)
      if (data.flag == '1') {
        message.success(data.message)
        tableLineData.splice(deleteIndex, 1, payload.value);
        yield put({
          type: 'querySuccess',
          payload: {
            UpdateDataModalVisit: false,
            tableLineData: tableLineData,
          }
        })
      } else {
        message.warning(data.message)
      }
    },
    //下载模板
    *onTempTableExcelModel({payload,}, {put, call, select,}){
      const data = yield call(onTempTableExcelModel, payload)
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
    },
    //饼图
    *queryTempDataFrom({payload,}, {put, call}) {
      const data = yield call(queryTempDataFrom, payload)
      if (data.success) {
        if (data.list.length != 0) {
          let obj = data.list[0]
          let systemEnvironmentTitle = ['windows', 'android', 'ios'];
          let systemEnvironmentData = [
            {value: obj.windows, name: 'windows'},
            {value: obj.android, name: 'android'},
            {value: obj.ios, name: 'ios'},
          ];
          let channelTitle = ['其他渠道', '微信', '微博', 'QQ'];
          let channelData = [
            {value: obj.defaultFrom, name: '其他渠道'},
            {value: obj.weixin, name: '微信'},
            {value: obj.weibo, name: '微博'},
            {value: obj.qq, name: 'QQ '},
          ];
          yield put({
            type: 'querySuccess',
            payload: {
              systemEnvironmentTitle: systemEnvironmentTitle,
              systemEnvironmentData: systemEnvironmentData,
              channelTitle: channelTitle,
              channelData: channelData,
              activateKey: "3",
            }
          })
        }
      } else {
        message.warning(data.message)
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
    queryTempTableDataSuccess(state, {payload}){
      const {paginationData} = payload;
      return {
        ...state, ...payload,
        paginationData: {
          ...state.pagination,
          ...paginationData,
        }
      }
    },
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
  },
})
