import {queryHomeCounts,} from '../services/dashboard'
import {queryFocusFrom} from '../services/createForm'
import {
  queryProjectDaily,
  queryUserProject,
  createProjectDaily,
  queryAllActiveStaff,
  createProject,
  updateProject,
  updateProjectDaily,
  deleteProjectDaily,
  queryFocusProject,
  deleteFocusProject,
  queryHomeProjectResources,
  dashboardQueryProjectResources,
  updateNewDaily,
} from '../services/projectManage'
import {download,sharedLinks} from '../utils/config';
import { config} from 'utils'
const {api} = config
const {urls} = api
import {message} from 'antd'
import TableUtils from '../utils/TableUtils'
export default {
  namespace: 'dashboard',
  state: {
    dispatch: null,
    contactCount: "",
    formCount: "",
    projectCount: "",
    userCount: "",//首页显示的统计值
    addLogModalVisit: false,
    addLogProjectRecord: {},
    dailyValue: {},//添加修改项目日志弹出窗口addSubprojectModalVisible: false,
    principalValue: [],
    selectExecutorName: "",//添加子项目、根项目的弹出窗口
    userProjectListCurrentPage: 0,
    userProjectList: [],
    resourcesListPage: 0,
    isShowDocumentation: false,//是否显示相关文档
    userProjDailyListCurrPage: 0,
    userProjDailyList: [],
    userProjExpandedRowKey: 0,//查看我的项目和日志
    userFocusProjRowKey: 0,
    userFocusProjectListCurrPage: 0,
    userFocusProjectList: [],
    userFocusDailyList: [],
    isShowFocusDocumentation: false,
    resourcesFocusList: [],
    resourcesFocusListPage: 0,
    userFocusDailyListCurrPage: 0,//查看我关注的项目
    userDocumentProjRowKey: 0,
    userDocumentProjectList: [],
    userDocumentListCurrPage: 0,//最新文档
    vfilter: "",
    resourcesList: [],//资源
    echartsPeopleHotSetting: {},
    //关注的表单
    userFocusFromList: [],
    userFocusFromRowKey: 0,
    userFocusFromListCurrPage: 0,
  },
  subscriptions: {
    setup ({dispatch,history}) {
      history.listen(location => {
        if (location.pathname == "/" || location.pathname == "/dashboard") {
          let user = JSON.parse(sessionStorage.getItem("UserStrom"))
          if (user == null) {
            dispatch({
              type: 'app/querys'
            })
          } else {
            dispatch({
              type: 'querySuccess',
              payload: {
                dispatch: dispatch,
                userFocusProjRowKey: 0,
                userProjExpandedRowKey: 0,
              }
            });
            dispatch({
              dispatch: dispatch,
              type: 'queryHomeCounts',
              payload: {
                companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
              }
            })
            dispatch({
              type: 'queryUserProject',
              payload: {
                userProjectListCurrentPage: 0,
                userProjDailyListCurrPage: 0,
              },
            })
            dispatch({
              type: 'queryFocusProject',
              payload: {
                userFocusProjRowKey: 0,
                userFocusProjectListCurrPage: 0,
              },
            })
            dispatch({
              type: 'queryFocusFrom',
              payload: {
                userFocusFromRowKey: 0,
                userFocusFromListCurrPage: 0,
              },
            })
            dispatch({
              type: 'queryHomeProjectResources',
              payload: {
                userDocumentProjRowKey: 0,
                userDocumentListCurrPage: 0,
              },
            })
            /**dispatch({
              type: 'queryPeopleHotMap',
              payload: {},
            })**/

          }
        }
      })
    }
  },
  effects: {
    *queryHomeCounts({payload}, {call,put,select}){
      const data = yield call(queryHomeCounts, payload)
      if (data.success == true) {
        yield put({
          type: 'querySuccess',
          payload: {
            contactCount: data.contactCount,
            formCount: data.tempTableCount,
            projectCount: data.pmCount,
            userCount: data.userCount,
          }
        })
      }
    },
    *queryUserProject({payload}, {call,put,select}){
      payload.currentPage = 1;
      const data = yield call(queryUserProject, payload)

      if (data.success == true) {
        if (data.list.length == 0) {
          message.success("没有更多数据");
        } else {

          yield put({
            type: 'querySuccess',
            payload: {
              userProjectList: data.list,
              userProjectListCurrentPage: 1,
            }
          })
        }
      }
    },
    *queryUserProjectMore({payload}, {call,put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.userProjectListCurrentPage);
      payload.currentPage = currentPage + 1;
      const data = yield call(queryUserProject, payload)
      if (data.success == true) {
        if (data.list.length == 0) {
          message.success("没有更多数据");
        } else {
          let userProjectList = yield select(({dashboard}) => dashboard.userProjectList);
          yield put({
            type: 'querySuccess',
            payload: {
              userProjectList: userProjectList.concat(data.list),
              userProjectListCurrentPage: currentPage + 1,
            }
          })
        }
      }
    },
    *queryProjectDaily ({payload = {}}, {call, put,select}){
      payload.currentPage = 1;
      let userProjectList = yield select(({dashboard}) => dashboard.userProjectList);

      var projectRecord = payload.project;
      payload.dataId = projectRecord.id;
      payload.groupId = projectRecord.groupId;
      payload.parentId = projectRecord.parentId;
      const data = yield call(queryProjectDaily, payload);
      if (payload.project.renewal == true) {
        payload.projectId = projectRecord.id;
        const dataUpdate = yield call(updateNewDaily, payload);
        userProjectList[payload.index].renewal = false
      }
      if (data.success) {
        let dailyList = data.list;
        let shareUrl = urls + "/temp/dataShare?id=";
        let urlAndImg;
        for (let i in dailyList) {
          urlAndImg = "&dailyStatus=" + dailyList[i].status + "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
          let contentArr = dailyList[i].content.split("@+!Z?@");
          let urlHost = dailyList[i].dailyType === 'resources' && contentArr.length > 1 ? download : ((dailyList[i].dailyType === 'form' || dailyList[i].dailyType === 'addForm') && contentArr.length > 1 ? shareUrl : window.location.protocol + "//" + window.location.host);
          let imgUrlHost = urls + "/pm/teletextShare";
          dailyList[i].content = contentArr.length <= 1 ? contentArr[0] : (
            dailyList[i].dailyType === 'resources' ? contentArr[0] + "<a  href='" + urlHost + "/" + dailyList[i].dailyUrl + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
              dailyList[i].dailyType === 'form' ? contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
                dailyList[i].dailyType === 'addForm' ?
                contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&projectId=" + payload.project.id + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
                  : contentArr[0] + "<a  href='" + imgUrlHost + "/" + dailyList[i].dailyUrl +urlAndImg+"' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
              )
            )
          );
        }
        yield put({
          type: "querySuccess",
          payload: {
            userProjExpandedRowKey: projectRecord.id,
            userProjDailyListCurrPage: 1,
            userProjDailyList: dailyList,
            isShowDocumentation: false,
            userProjectList: userProjectList,
          }
        })
      }
    },
    *queryProjectDailyMore ({payload = {}}, {call, put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.userProjDailyListCurrPage);
      payload.currentPage = currentPage + 1;
      var projectRecord = payload.project;
      payload.dataId = projectRecord.id;
      payload.groupId = projectRecord.groupId;
      payload.parentId = projectRecord.parentId;
      const data = yield call(queryProjectDaily, payload);
      if (data.success) {
        let dailyListCache = yield select(({dashboard}) => dashboard.userProjDailyList);
        if (data.list.length > 0) {
          let dailyList = data.list;
          let shareUrl = urls + "/temp/dataShare?id=";
          let urlAndImg;
          for (let i in dailyList) {
            urlAndImg = "&dailyStatus=" + dailyList[i].status + "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
            let contentArr = dailyList[i].content.split("@+!Z?@");
            let urlHost = dailyList[i].dailyType === 'resources' && contentArr.length > 1 ? download : ((dailyList[i].dailyType === 'form' || dailyList[i].dailyType === 'addForm') && contentArr.length > 1 ? shareUrl : window.location.protocol + "//" + window.location.host);
            let imgUrlHost = urls + "/pm/teletextShare";
            dailyList[i].content = contentArr.length <= 1 ? contentArr[0] : (
              dailyList[i].dailyType === 'resources' ? contentArr[0] + "<a  href='" + urlHost + "/" + dailyList[i].dailyUrl + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
                dailyList[i].dailyType === 'form' ? contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
                  dailyList[i].dailyType === 'addForm' ?
                  contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&projectId=" + payload.project.id + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
                    : contentArr[0] + "<a  href='" + imgUrlHost + "/" + dailyList[i].dailyUrl +urlAndImg+ "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
                )
              )
            );
          }
          dailyListCache = dailyListCache.concat(dailyList);
        } else {
          message.success("没有更多数据");
        }
        yield put({
          type: "querySuccess",
          payload: {
            userProjDailyListCurrPage: currentPage + 1,
            userProjDailyList: dailyListCache
          }
        })
      }
    },
    //添加日志
    *createProjectDaily({payload = {}}, {call, put,select}){
      const data = yield call(createProjectDaily, payload);
      const userProjDailyList = yield select(({dashboard})=> dashboard.userProjDailyList)
      const userProjExpandedRowKey = yield select(({dashboard})=> dashboard.userProjExpandedRowKey)
      if (data.success) {
        if (data.flag) {
          payload.dailyType = "work"
          if (userProjExpandedRowKey != "0" && userProjExpandedRowKey == payload.id) {
            payload.id = data.obj
            userProjDailyList.push(payload)
          } else {
            payload.id = data.obj
          }
          //按创建日期排序
          userProjDailyList.sort(function (a, b) {
            if (a.createDate > b.createDate) {
              return -1;
            } else if (a.createDate < b.createDate) {
              return 1;
            } else {
              if (a.createDate > b.createDate) {
                return 1;
              } else if (a.createDate < b.createDate) {
                return -1;
              }
              return 0;
            }
          });
          message.success(data.message)
          yield put({
            type: 'querySuccess',
            payload: {
              addLogModalVisit: false,
              addLogProjectRecord: {},
              userProjDailyList: userProjDailyList,
            }
          })
        } else {
          message.error(data.message)
        }
      }
    },
    //修改日志
    *updateProjectDaily ({payload = {}}, {call, put,select}){
      const data = yield call(updateProjectDaily, payload);
      const userProjDailyList = yield select(({dashboard})=> dashboard.userProjDailyList)
      if (data.flag == 1) {
        payload.dailyValue.content = payload.content
        payload.dailyValue.createDate = payload.createDate
        userProjDailyList.splice(payload.dialyiIndex, 1, payload.dailyValue);
        yield put({
          type: "querySuccess",
          payload: {
            addLogModalVisit: false,
            dailyValue: {},
            userProjDailyList,
          }
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
    //负责人
    *queryAllActiveStaff ({payload = {}}, {call, put,select}){
      const data = yield call(queryAllActiveStaff, payload);
      if (data.success) {
        yield put({
          type: "querySuccess",
          payload: {
            principalValue: data.list,
          }
        })
      }
    },
    //创建子项目或者根项目
    *createProject ({payload = {}}, {call, put, select}){
      const data = yield call(createProject, payload);
      const userProjectList = yield select(({dashboard})=> dashboard.userProjectList)
      if (data.success) {
        if (data.flag) {
          payload.value["id"] = data.obj
          if (payload.value.executor == JSON.parse(sessionStorage.getItem("UserStrom")).id) {
            userProjectList.push(payload.value)
          }
          yield put({
            type: "querySuccess",
            payload: {
              addSubprojectModalVisible: false,
              addLogProjectRecord: {},
              userProjectList: userProjectList,
            }
          })
          message.success(data.message)
        } else {
          message.error(data.message)
        }
      }
    },
    //已完成，修改子项目为完成状态
    *updateProject ({payload = {}}, {call, put,select}){
      const data = yield call(updateProject, payload);
      if (data.success) {
        if (data.flag) {
          message.success(data.message)
        } else {
          message.error(data.message)
        }
      }
    },
    //删除我的项目某一条日志
    *deleteMyDaily ({payload = {}}, {call, put,select}){
      const data = yield call(deleteProjectDaily, payload);
      let dailyList = yield select(({dashboard}) => dashboard.userProjDailyList);
      dailyList.splice(payload.index, 1);
      yield put({
        type: "querySuccess",
      })
      message.success(data.message)
    },

    *queryFocusProject ({payload = {}}, {call, put,select}){
      payload.currentPage = 1;
      const data = yield call(queryFocusProject, payload);
      if (data.success) {
        if (data.list.length > 0) {
          yield put({
            type: "querySuccess",
            payload: {
              userFocusProjectListCurrPage: 1,
              userFocusProjectList: data.list
            }
          })
        }else {
          yield put({
            type: "querySuccess",
            payload: {
              userFocusProjectListCurrPage: 0,
              userFocusProjectList:[]
            }
          })
        }

      }
    },
    *queryFocusProjectMore ({payload = {}}, {call, put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.userFocusProjectListCurrPage);
      payload.currentPage = currentPage + 1;
      const data = yield call(queryFocusProject, payload);
      //var projectRecord = payload.project;
      let projectListCache = yield select(({dashboard}) => dashboard.userFocusProjectList);
      if (data.success) {
        if (data.list.length > 0) {
          projectListCache = projectListCache.concat(data.list);
          yield put({
            type: "querySuccess",
            payload: {
              //  userFocusProjRowKey: projectRecord.id,
              userFocusProjectListCurrPage: currentPage + 1,
              userFocusProjectList: projectListCache,
            }
          })
        } else {
          message.success("没有更多数据");
        }
      }
    },
    //删除我的关注项目中某一条日志
    *deleteFocusDaily ({payload = {}}, {call, put,select}){
      const data = yield call(deleteProjectDaily, payload);
      let dailyList = yield select(({dashboard}) => dashboard.userFocusDailyList);
      dailyList.splice(payload.index, 1);
      yield put({
        type: "querySuccess",
      })
      message.success(data.message)
    },
    *queryFocusDaily ({payload = {}}, {call, put,select}){
      payload.currentPage = 1;
      var projectRecord = payload.project;
      payload.dataId = projectRecord.id;
      payload.groupId = projectRecord.groupId;
      payload.parentId = projectRecord.parentId;
      const data = yield call(queryProjectDaily, payload);
      let userFocusProjectList = yield select(({dashboard}) => dashboard.userFocusProjectList);
      if (payload.project.renewal == true) {
        payload.projectId = projectRecord.id;
        const dataUpdate = yield call(updateNewDaily, payload);
        userFocusProjectList[payload.index].renewal = false
      }
      if (data.success) {
        let dailyList = data.list;
        let shareUrl = urls + "/temp/dataShare?id=";
        let urlAndImg;
        for (let i in dailyList) {
          urlAndImg = "&dailyStatus=" + dailyList[i].status + "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
          let contentArr = dailyList[i].content.split("@+!Z?@");
          let urlHost = dailyList[i].dailyType === 'resources' && contentArr.length > 1 ? download : ((dailyList[i].dailyType === 'form' || dailyList[i].dailyType === 'addForm') && contentArr.length > 1 ? shareUrl : window.location.protocol + "//" + window.location.host);
          let imgUrlHost = urls + "/pm/teletextShare";
          dailyList[i].content = contentArr.length <= 1 ? contentArr[0] : (
            dailyList[i].dailyType === 'resources' ? contentArr[0] + "<a  href='" + urlHost + "/" + dailyList[i].dailyUrl + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
              dailyList[i].dailyType === 'form' ? contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
                dailyList[i].dailyType === 'addForm' ?
                contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&projectId=" + payload.project.id + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
                  : contentArr[0] + "<a  href='" + imgUrlHost + "/" + dailyList[i].dailyUrl +urlAndImg+ "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
              )
            )
          );
        }
        yield put({
          type: "querySuccess",
          payload: {
            userFocusProjRowKey: projectRecord.id,
            userFocusDailyListCurrPage: 1,
            userFocusDailyList: dailyList,
            isShowFocusDocumentation: false,
            userFocusProjectList: userFocusProjectList,
          }
        })
      }
    },
    *queryFocusDailyMore ({payload = {}}, {call, put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.userFocusDailyListCurrPage);
      payload.currentPage = currentPage + 1;
      var projectRecord = payload.project;
      payload.dataId = projectRecord.id;
      payload.groupId = projectRecord.groupId;
      payload.parentId = projectRecord.parentId;
      const data = yield call(queryProjectDaily, payload);
      if (data.success) {
        let dailyListCache = yield select(({dashboard}) => dashboard.userFocusDailyList);
        if (data.list.length > 0) {
          let dailyList = data.list;
          let shareUrl = urls + "/temp/dataShare?id=";
          let urlAndImg;
          for (let i in dailyList) {
            urlAndImg = "&dailyStatus=" + dailyList[i].status + "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
            let contentArr = dailyList[i].content.split("@+!Z?@");
            let urlHost = dailyList[i].dailyType === 'resources' && contentArr.length > 1 ? download : ((dailyList[i].dailyType === 'form' || dailyList[i].dailyType === 'addForm') && contentArr.length > 1 ? shareUrl : window.location.protocol + "//" + window.location.host);
            let imgUrlHost = urls + "/pm/teletextShare";
            dailyList[i].content = contentArr.length <= 1 ? contentArr[0] : (
              dailyList[i].dailyType === 'resources' ? contentArr[0] + "<a  href='" + urlHost + "/" + dailyList[i].dailyUrl + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
                dailyList[i].dailyType === 'form' ? contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2] : (
                  dailyList[i].dailyType === 'addForm' ?
                  contentArr[0] + "<a  href='" + urlHost + dailyList[i].dailyUrl + "&projectId=" + payload.project.id + "&companyCode=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + urlAndImg + "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
                    : contentArr[0] + "<a  href='" + imgUrlHost + "/" + dailyList[i].dailyUrl +urlAndImg+ "' target='_blank'>" + contentArr[1] + "</a>" + contentArr[2]
                )
              )
            );
          }
          dailyListCache = dailyListCache.concat(dailyList);
        } else {
          message.success("没有更多数据");
        }
        yield put({
          type: "querySuccess",
          payload: {
            userFocusDailyListCurrPage: currentPage + 1,
            userFocusDailyList: dailyListCache
          }
        })
      }
    },
    //添加日志
    *createFocusProjectDaily({payload = {}}, {call, put,select}){
      const data = yield call(createProjectDaily, payload);
      const userFocusDailyList = yield select(({dashboard})=> dashboard.userFocusDailyList)
      const userFocusProjRowKey = yield select(({dashboard})=> dashboard.userFocusProjRowKey)
      if (data.success) {
        if (data.flag) {
          payload.dailyType = "work"
          if (userFocusProjRowKey != "0" && userFocusProjRowKey == payload.id) {
            payload.id = data.obj
            userFocusDailyList.push(payload)
          } else {
            payload.id = data.obj
          }

          //按创建日期排序
          userFocusDailyList.sort(function (a, b) {
            if (a.createDate > b.createDate) {
              return -1;
            } else if (a.createDate < b.createDate) {
              return 1;
            } else {
              if (a.createDate > b.createDate) {
                return 1;
              } else if (a.createDate < b.createDate) {
                return -1;
              }
              return 0;
            }
          });
          message.success(data.message)
          yield put({
            type: 'querySuccess',
            payload: {
              addLogModalVisit: false,
              addLogProjectRecord: {},
              userFocusDailyList: userFocusDailyList,
            }
          })
        } else {
          message.error(data.message)
        }
      }
    },
    *updateFocusProjectDaily ({payload = {}}, {call, put,select}){
      const data = yield call(updateProjectDaily, payload);
      const userFocusDailyList = yield select(({dashboard})=> dashboard.userFocusDailyList)
      if (data.flag == 1) {
        payload.dailyValue.content = payload.content
        payload.dailyValue.createDate = payload.createDate
        userFocusDailyList.splice(payload.dialyiIndex, 1, payload.dailyValue);
        yield put({
          type: "querySuccess",
          payload: {
            addLogModalVisit: false,
            dailyValue: {},
            userFocusDailyList,
          }
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
    //取消关注
    *deleteFocusProject ({payload = {}}, {call, put,select}){
      const data = yield call(deleteFocusProject, payload);
      const userFocusProjectList = yield select(({dashboard})=> dashboard.userFocusProjectList)
      if (data.flag == 1) {
        userFocusProjectList.splice(payload.deleteFocusIndex, 1);
        yield put({
          type: "querySuccess",
          payload: {
            userFocusProjectList,
          }
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
    //查询最新文档
    *queryHomeProjectResources ({payload = {}}, {call, put,select}){
      payload.currentPage = 1;
      const data = yield call(queryHomeProjectResources, payload);
      if (data.success) {
        if (data.list.length > 0) {
          yield put({
            type: "querySuccess",
            payload: {
              userDocumentProjectList: data.list,
              userDocumentListCurrPage: 1,
            }
          })
        } else {
          yield put({
            type: "querySuccess",
            payload: {
              userDocumentProjectList: [],
              userDocumentListCurrPage: 0,
            }
          })
        }

      }
    },
    *queryPeopleHotMap({payload = {}}, {call, put,select}){
      const data = yield call(queryPeopleHotMapService, payload);
      let echartsPeopleHotSetting = TableUtils.createAreaHotSetting(JSON.parse(data.obj));
      yield put({
        type: "querySuccess",
        payload: {
          echartsPeopleHotSetting: echartsPeopleHotSetting,
        }
      })
    },
    //查询

    //查询更多最新文档
    *queryDocumentResourceMore ({payload = {}}, {call, put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.userDocumentListCurrPage);
      payload.currentPage = currentPage + 1;
      const data = yield call(queryHomeProjectResources, payload);
      let projectListCache = yield select(({dashboard}) => dashboard.userDocumentProjectList);
      if (data.success) {
        if (data.list.length > 0) {
          projectListCache = projectListCache.concat(data.list);
          yield put({
            type: "querySuccess",
            payload: {
              userDocumentProjectList: projectListCache,
              userDocumentListCurrPage: currentPage + 1,
            }
          })
        } else {
          message.success("没有更多数据");
        }
      }
    },
    //查询资源
    *queryProjectResources({payload = {}}, {call, put,select}){
      payload.currentPage = 1;
      const data = yield call(dashboardQueryProjectResources, payload);
      if (data.success) {
        if (data.list.length != 0) {
          yield put({
            type: "querySuccess",
            payload: {
              resourcesList: data.list,
              isShowDocumentation: true,
              resourcesListPage: 1
            }
          })
        } else {
          yield put({
            type: "querySuccess",
            payload: {
              resourcesList: [],
              isShowDocumentation: true,
              resourcesListPage: 0,
            }
          })
        }
      }
    },
    //查询更多资源
    *queryProjectResourceseMore ({payload = {}}, {call, put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.resourcesListPage);
      payload.currentPage = currentPage + 1;
      const data = yield call(dashboardQueryProjectResources, payload);
      let resourcesList = yield select(({dashboard}) => dashboard.resourcesList);
      if (data.success) {
        if (data.list.length > 0) {
          resourcesList = resourcesList.concat(data.list);
          yield put({
            type: "querySuccess",
            payload: {
              resourcesList: resourcesList,
              resourcesListPage: currentPage + 1,
            }
          })
        } else {
          message.success("没有更多数据");
        }
      }
    },

    //查询关注资源
    *queryFocusProjectResources({payload = {}}, {call, put,select}){
      payload.currentPage = 1;
      const data = yield call(dashboardQueryProjectResources, payload);
      if (data.success) {
        if (data.list.length != 0) {
          yield put({
            type: "querySuccess",
            payload: {
              resourcesFocusList: data.list,
              isShowFocusDocumentation: true,
              resourcesFocusListPage: 1
            }
          })
        } else {
          yield put({
            type: "querySuccess",
            payload: {
              resourcesFocusList: [],
              isShowFocusDocumentation: true,
              resourcesFocusListPage: 0,
            }
          })
        }
      }
    },
    //查询更多关注资源
    *queryFocusProjectResourceseMore ({payload = {}}, {call, put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.resourcesFocusListPage);
      payload.currentPage = currentPage + 1;
      const data = yield call(dashboardQueryProjectResources, payload);
      let resourcesFocusList = yield select(({dashboard}) => dashboard.resourcesFocusList);
      if (data.success) {
        if (data.list.length > 0) {
          resourcesFocusList = resourcesFocusList.concat(data.list);
          yield put({
            type: "querySuccess",
            payload: {
              resourcesFocusList: resourcesFocusList,
              resourcesFocusListPage: currentPage + 1,
            }
          })
        } else {
          message.success("没有更多数据");
        }
      }
    },
    //查询关注的表单
    *queryFocusFrom ({payload = {}}, {call, put,select}){
      payload.currentPage = 1;
      const data = yield call(queryFocusFrom, payload);
      if (data.success) {
        if (data.list.length > 0) {
          yield put({
            type: "querySuccess",
            payload: {
              userFocusFromList: data.list,
              userFocusFromListCurrPage: 1,
            }
          })
        }else{
          yield put({
            type: "querySuccess",
            payload: {
              userFocusFromList:[],
              userFocusFromListCurrPage:0,
            }
          })
        }
      }
    },
    //查询更多关注的表单
    *queryFocusFromMore ({payload = {}}, {call, put,select}){
      let currentPage = yield select(({dashboard}) => dashboard.userFocusFromListCurrPage);
      payload.currentPage = currentPage + 1;
      const data = yield call(queryFocusFrom, payload);
      let userFocusFromList = yield select(({dashboard}) => dashboard.userFocusFromList);
      if (data.success) {
        if (data.list.length > 0) {
          userFocusFromList = userFocusFromList.concat(data.list);
          yield put({
            type: "querySuccess",
            payload: {
              userFocusFromList: userFocusFromList,
              userFocusFromListCurrPage: currentPage + 1,
            }
          })
        } else {
          message.success("没有更多数据");
        }
      }
    },
    //取消关注表单
    *deleteFocusFrom ({payload = {}}, {call, put,select}){
      const data = yield call(deleteFocusProject, payload);
      const userFocusFromList = yield select(({dashboard}) => dashboard.userFocusFromList)
      if (data.flag == 1) {
        userFocusFromList.splice(payload.index, 1);
        yield put({
          type: "querySuccess",
          payload: {
            userFocusFromList: userFocusFromList,
          }
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}){
      return {
        ...state,
        ...payload
      }
    },
  },
}
