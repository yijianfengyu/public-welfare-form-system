import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {config} from 'utils'
import {selectContact,queryContactDefineDataList,downloadContactData,insertContact,deleteContact,UpdateContact,SelectPrincipal,downloadContacts,queryContactRepeatList} from '../services/contactManagement'
import {queryAllTempDataByDefineId,} from '../services/createForm'
import {message,Modal,Select} from 'antd'
import  ParseCityUtils from '../utils/ParseCityUtils'
const Option = Select.Option;
import {download} from '../utils/config'
import TableUtils from '../utils/TableUtils'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'contactManagement',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    tableList: [],
    CreateModalVisit: false,
    updateValue: {},
    selectList: [],
    optionItem: [],
    fileList: [],
    ContactExcelModalVisit: false,
    listLoading: false,
    vFilter: [],
    shareModalVisit: false,
    shareUrl: '',
    recordIndex: {},
    principalName: '',
    dataPage: {},
    contactRepeatDataList: [],
    contactFormRowKey: 0,
    provinceData: [],
    cityData: {},
    countyData: {},
    cities: [],
    countys: [],
    showHeaderVisit: false,
    userProjExpandedRowKey: 0,
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/contactManagement') {
          let user = JSON.parse(sessionStorage.getItem("UserStrom"))
          if (user == null) {
            dispatch({
              type: 'app/querys'
            })
          } else {
            dispatch({
              type: 'SelectAll',
              payload: {
                //companyCode: user.companyCode,
                //id: user.id,
              }
            })
            let areaData = ParseCityUtils
            //省
            let provinceData = areaData.provinceData;
            //市
            let cityData = areaData.cityData;
            //县
            let countyData = areaData.countyData;
            dispatch({
              type: 'querySuccess',
              payload: {
                listLoading: true,
                provinceData: provinceData,
                cityData: cityData,
                countyData: countyData,
                contactRepeatDataList: [],
              },
            })
          }
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    *downloadContact({payload}, {call,put}){
      const data = yield call(downloadContacts, payload);
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
    *downloadContactData({payload}, {call,put}){
      const data = yield call(downloadContactData, payload);
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
    //查询
    *SelectAll({payload}, {call,put}){
      const data = yield call(selectContact, payload);
      if (data.success == true) {
        if (data.resultList.length != 0) {
          yield put({
            type: 'queryContactSuccess',
            payload: {
              pagination: {
                total: data.total,
                current: data.currentPage,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
              },
              dataPage: {
                total: data.total,
                current: data.currentPage,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
              },
              tableList: data.resultList,
              listLoading: false,
            }
          })
        } else {
          yield put({
            type: 'queryContactSuccess',
            payload: {
              pagination: {
                total: 0,
                current: 0,
                pageSize: 0,
                totalPages: 0,
              },
              dataPage: {
                total: 0,
                current: 0,
                pageSize: 0,
                totalPages: 0,
              },
              tableList: [],
              listLoading: false,
            }
          })
        }
        yield put({
          type: 'SelectPrincipalAll',
          payload: {
            //companyCode:JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
          }
        })
      }
    },
    //查询负责人
    *SelectPrincipalAll({payload}, {call,put}){
      const data = yield call(SelectPrincipal, payload);
      if (data.success == true) {
        const item = []
        if (data.list.length > 0) {
          for (var a in data.list) {
            item.push(<Option key={data.list[a].id}>{data.list[a].userName}</Option>)
          }
        }
        yield put({
          type: 'querySuccess',
          payload: {
            selectList: data.list,
            optionItem: item
          }
        })
      }
    },
    //删除
    *deleteContactOne({payload}, {call,put,select}){
      const data = yield call(deleteContact, payload);
      let recordIndex = yield select(({contactManagement}) => contactManagement.recordIndex);
      let tableList = yield select(({contactManagement}) => contactManagement.tableList);
      let dataPage = yield select(({contactManagement}) => contactManagement.dataPage);
      if (data.flag == 1) {
        dataPage.total = dataPage.total - 1
        tableList.splice(recordIndex, 1)
        yield put({
          type: 'querySuccess',
          payload: {
            tableList: tableList,
            dataPage: dataPage,
            contactRepeatDataList: []
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
    //添加
    *insertContactOne({payload}, {call,put}){
      const data = yield call(insertContact, payload);
      if (data.flag == 1) {
        message.success(data.message)
        yield put({
          type: 'hideCreateModalVisit',
          payload: {
            updateValue: {},
            principalName: ''
          }
        })
        yield put({
          type: 'SelectAll',
          payload: {
            companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
            id: JSON.parse(sessionStorage.getItem("UserStrom")).id,
          }
        })
      } else {
        message.warning(data.message)
      }
    },
    //修改
    *UpdateContactOne({payload}, {call,put,select}){
      const data = yield call(UpdateContact, payload);
      let recordIndex = payload.recordIndex;
      let tableList = payload.tableList;
      if (data.flag == 1) {
        message.success(data.message);
        tableList[recordIndex] = payload.value;
        yield put({
          type: 'hideCreateModalVisit',
          payload: {
            updateValue: {},
            tableList: tableList,
            principalName: ''
          }
        })
      } else {
        message.warning(data.message)
      }
    },

    //查询联系人所在数据表 contact_define_data
    *queryContactDefineDataList({payload,}, {put, call, select,}){
      const data = yield call(queryContactDefineDataList, payload);
      if (data.success == true) {
        let list = data.resultList;
        let rule = {};
        let newfood = [];
        for (var i in list) {
          let tableColumns = TableUtils.tableDataAnalysis(list[i].define);
          list[i]["tableColumns"] = tableColumns;
          list[i]["list"] =JSON.stringify(list[i]);
        }
        for(var l in list){
          let key = list[l].define_id;
          if (rule[key]) {
            rule[key].list = rule[key].list+"&*&*&*&*%%"+list[l].list;
            rule[key].dataCounts=rule[key].dataCounts+list[l].dataCounts;
          } else {
            rule[key] = {};
            rule[key].list =list[l].list;
            rule[key].dataCounts =list[l].dataCounts;
          }
          rule[key].id = list[l].id;
          rule[key].tableColumns = list[l].tableColumns;
          rule[key].formTitle = list[l].formTitle;
        }
        for (var k in rule) {
          let ruleList=rule[k].list.split("&*&*&*&*%%");
          for(var j in ruleList){
            ruleList[j]=JSON.parse(ruleList[j]);
          }
          rule[k].list=ruleList;
          newfood.push(rule[k])
        }

        yield put({
          type: 'querySuccess',
          payload: {
            contactRepeatDataList: newfood,
          }
        })
      } else {
        message.warning(data.message)
      }
    },

  },
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
    queryContactSuccess(state, {payload}){
      const {pagination} = payload;
      return {
        ...state, ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    showCreateModalVisit (state, {payload}) {
      return {...state, ...payload, CreateModalVisit: true,}
    },
    hideCreateModalVisit (state, {payload}) {
      return {...state, ...payload, CreateModalVisit: false,}
    },
    showShareModalVisit (state, {payload}) {
      return {...state, ...payload, shareModalVisit: true,}
    },
    hideShareModalVisit (state, {payload}) {
      return {...state, ...payload, shareModalVisit: false,}
    },

    showContactExcelModalVisit (state, {payload}) {
      return {...state, ...payload, ContactExcelModalVisit: true,}
    },
    hideContactExcelModalVisit (state, {payload}) {
      return {...state, ...payload, ContactExcelModalVisit: false,}
    },

  },
})
