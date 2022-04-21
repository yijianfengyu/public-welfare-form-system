import modelExtend from 'dva-model-extend'
import {querysCustomer, insertCustomer, updateCustomer,transferCustomer,queryLocation} from '../services/customer'
import {queryCustomerContact, insertCustomerContact, updateCustomerContact,} from '../services/customer'
import {querySalesChildList,} from '../services/pi'
import {querySalesName} from '../services/muManage'
import {pageModel} from './common'
import {config} from 'utils'
import {message} from 'antd'


export default modelExtend(pageModel, {
  namespace: 'customer',
  state: {
    cuPage: [],
    formalCustomerList: [],
    salesChildList: [],
    customerModalType: "create",
    customerModalVisible: false,
    cusDetailModalVisible: false,
    customerData: [],
    vFilter: [],
    expand: false,
    customerContactType: "create",
    customerContactModalVisible: false,
    customerContactList: [],
    customerPOList: [],
    customerPIList: [],
    customerRFQList: [],
    customerContactData: [],
    customerID: "",
    date1: "",
    previewVisible: false,
    ContactExcelVisible:false,
    CustomerTempExcelVisible:false,
    previewFile: '',
    maxFileSize:[],
    fileList:[],
    uploading:false,
    salesNameList:[],
    transferModalVisible:false,
    locationList:[],
    tipsModalVisible:false,
    current:0,
    currentChildSteps:0,
  },

  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/customer') {
          let user = sessionStorage.getItem("userStorage")
          dispatch({
            type: 'querysCustomer', payload: {
              user,
            }
          })
          dispatch({type: 'queryLocation'})
          dispatch({
            type: 'querySalesChildList', payload: {
              user,
            }
          })
          dispatch({
            type: 'querysSuccess', payload: {
              vFilter: '',
              cuPage: '',
              expand: false
            }
          })
        }
      })
    },
  },

  effects: {
    *querysCustomer({payload}, {call, put}){
      const data = yield call(querysCustomer, payload);
      if (data) {
        yield put({
          type: 'queryCustomerSuccess',
          payload: {
            pagination: {
              total: data.total,
              current: data.currentPage,
              pageSize: data.pageSize,
              totalPages: data.totalPages,
            },
            formalCustomerList: data.resultList,
          }
        })
      } else {
        throw data
      }
    },
    *querySalesChildList({payload}, {call, put}){
      const data = yield call(querySalesChildList, payload);
      if (data.list[0] != "false" && data.list[0] != "userfalse") {
        yield put({
          type: "queryCustomerSuccess",
          payload: {
            salesChildList: data.list[0],
          }
        })
      }
    },
    *transferCustomer({payload = {}}, {call, put}){
      const data = yield call(transferCustomer, payload);
      if(data.success){
        message.success("转移客户成功,请重新查询")
      }else{
        message.success("转移客户失败")
      }
    },
    *queryAllSales ({payload = {}}, {call, put}){
      const data = yield call(querySalesName, payload);
      if (data.success) {
        yield put({
          type: 'queryCustomerSuccess',
          payload: {salesNameList: data.list}
        })
      }
    },
    *insertCustomer({payload}, {call, put}){
      const data = yield call(insertCustomer, payload);
      if (data.success) {
        message.success("添加客户成功")
        yield put({
          type: "hideCustomerModalVisible", payload: {
            customerData: "",
          }
        })
        yield put({
          type: "querysCustomer", payload: {
            user: sessionStorage.getItem("userStorage"),
          }
        })
      } else {
        message.error("添加客户失败")
      }
    },
    *updateCustomer({payload}, {select, call, put}){
      const cPage = yield select(({customer}) => customer.cuPage)
      const cufilter = yield select(({customer}) => customer.vFilter)
      const data = yield call(updateCustomer, payload);
      if (data.success) {
        message.success("修改客户成功")
        yield put({
          type: "hideCustomerModalVisible", payload: {
            customerData: "",
          }
        })
        yield put({
          type: "querysCustomer",
          payload: {
            currentPage: cPage.current,
            pageSize: cPage.pageSize,
            companyEn: cufilter.companyEn,
            groupClass: cufilter.groupClass,
            location: cufilter.location,
            salesName: cufilter.salesName,
            source: cufilter.source,
            status: cufilter.status,
            level: cufilter.level,
            contactor: cufilter.contactor,
            email: cufilter.email,
            contactEmail: cufilter.contactEmail,
            web: cufilter.web,
            user: sessionStorage.getItem("userStorage"),
          }
        })
      } else {
        message.error("修改客户失败")
      }
    },
    *queryCustomerContact({payload}, {call, put}){
      const data = yield call(queryCustomerContact, payload);
      //const data1 = yield call(queryOptions,payload);
      if (data.success) {
        yield put({
          type: 'queryCustomerSuccess', payload: {
            customerContactList: data.customerContact,
            customerPOList: data.customerPo,
            customerPIList: data.customerPi,
            customerRFQList: data.customerRfq,
          }
        })
      }
    },
    *insertCustomerContact({payload}, {call, put, select}){
      const data = yield call(insertCustomerContact, payload);
      let customerID = yield select(({customer}) => customer.customerID);
      if (data.success) {
        message.success("添加联系人成功")
        yield put({
          type: "hideCustomerContactModalVisible", payload: {
            customerContactData: "",
          }
        })
        yield put({
          type: "queryCustomerContact", payload: {
            id: customerID
          }
        })
      } else {
        message.error("添加联系人失败")
      }
    },
    *updateCustomerContact({payload}, {call, put, select}){
      const data = yield call(updateCustomerContact, payload);
      let customerID = yield select(({customer}) => customer.customerID);
      if (data.success) {
        message.success("修改联系人成功")
        yield put({
          type: "hideCustomerContactModalVisible", payload: {
            customerContactData: "",
          }
        })
        yield put({
          type: "queryCustomerContact", payload: {
            id: customerID
          }
        })
      } else {
        message.error("修改联系人失败")
      }
    },
    *queryLocation({payload}, {call, put}){
      const data = yield call(queryLocation, payload);
      if(data.success){
        yield put({
          type: "querySuccess", payload: {
            locationList: data.list
          }
        })
      }
    }
  },

  reducers: {
    queryCustomerSuccess(state, {payload}){
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
    showCustomerModalVisible (state, {payload}) {
      return {...state, ...payload, customerModalVisible: true}
    },

    hideCustomerModalVisible (state, {payload}) {
      return {...state, ...payload, customerModalVisible: false}
    },
    showCusDetailModalVisible (state, {payload}) {
      return {...state, ...payload, cusDetailModalVisible: true}
    },

    hideCusDetailModalVisible (state, {payload}) {
      return {...state, ...payload, cusDetailModalVisible: false}
    },
    showContactExcel (state, {payload}) {
      return {...state, ...payload, ContactExcelVisible: true}
    },
    hideContactExcel (state) {
      return {...state, ContactExcelVisible: false}
    },
    showCustomerTempExcel(state) {
      return {...state, CustomerTempExcelVisible: true}
    },
    hideCustomerTempExcel(state) {
      return {...state, CustomerTempExcelVisible: false}
    },
    showCustomerContactModalVisible (state, {payload}) {
      return {...state, ...payload, customerContactModalVisible: true}
    },

    hideCustomerContactModalVisible (state, {payload}) {
      return {...state, ...payload, customerContactModalVisible: false}
    },
    showTransferModalVisible (state, {payload}) {
      return {...state, ...payload, transferModalVisible: true}
    },
    hideTransferModalVisible (state, {payload}) {
      return {...state, ...payload, transferModalVisible: false}
    },
  }
})
