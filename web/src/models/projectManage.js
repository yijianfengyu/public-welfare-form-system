import modelExtend from 'dva-model-extend'
import { pageModel } from './common'
import {
  queryProject,
  updateProject,
  createProjectReport,
  createProject,
  queryAllActiveStaff,
  queryProjectDaily,
  createProjectDaily,
  addProjectResource,
  queryProjectResources,
  addProjectResourceModel,
  deleteProjectDaily,
  updateProjectDaily,
  auditProjectResource,
  copyProject,
  deleteProject,
  queryForms,
  deleteResource,
  insertFocusProject,
  deleteFocusProject,
  queryFocusProject,
  queryFocusProjectId,
  queryOptions,
  queryAddress,
  getTeamList,

  getLocalOrganizationList,
  getConnectList,
  getProjectTeamList,
  getTeamPartnerList,
  getProjectLocalOrganizationList,
  updateTeamList,
  updateConnectList,
  updateLocalOrganizationList,
  updatePartnerList,
  deleteProjectPartner,
  deleteProjectTeam,
  addProjectPartnerCost,
  queryProjectReport,
  addProjectTeamPartner,
  addProjectResourceFromStore,
  getPartnerList,
} from '../services/projectManage'
import { message, Modal } from 'antd'
import { getNowFormatDate } from '../utils/common'
import { download, sharedLinks } from '../utils/config'
import { config } from 'utils'
import { queryHistoryResources } from '../services/resource'

const { api } = config
const { urls } = api
export default modelExtend(pageModel, {
  namespace: 'projectManage',

  state: {
    expectedEndTime: [],
    actualEndTime: [],
    startDate: [],
    projectList: [],
    filter: [],
    projectRecord: '',
    recordIndex: {},
    addProjectModalVisible: false,
    confirmLoading: false,
    userList: [],
    dailyList: [],
    dailyListCurrPage: 0,
    tabKey: [],
    dateString: {},
    treeDom: null,
    modalType: '',
    treeSearchKey: {
      groupId: '',
      status: 'Cancel',
      executor: '',
    },
    treeData: {},
    treeMode: 'R',
    uploadModalVisible: false,
    fileUrl: [],
    fileName: '',
    resourcesList: [],
    uploadModelModalVisible: false,
    FormModalVisible: false,
    resourcesRecord: [],
    resourcesType: '文件',
    isAuthority: false,
    projectKey: '1',
    fileList: [],
    fileListOne: [],
    fileUrlOne: [],
    fileNameOne: '',
    formList: [],
    rightStatus: true,
    formName: '',
    listLoading: false,
    resourcesListLoading: false,
    projectTitle: '新建项目',
    fileResourcesName: '',
    logContant: '',
    selectName: '',//选中的负责人的姓名
    resourceListIndex: '',
    attention: '关注',//关注
    focusProject: [],//关注的项
    projectTypeList: [],//项目类型
    processList: [],//项目阶段
    addressFetching: false,
    addressDataList: [],
    addressShow: false,//吾水专项控制条件
    researchShow:false,//吾水调研控制条件
    addressId: 0,
    addProjectTeamModelShow: false,
    addProjectPartnerModelShow: false,
    addProjectPartnerCostModelShow: false,
    addProjectLocalOrganizationModelShow: false,
    addProjectConnectModelShow: false,
    projectTeamList: [],
    projectPartnerList: [],
    projectLocalOrganizationList: [],
    projectConnectList: [],
    projectTeamListSelect: [],
    projectPartnerListSelect: [],
    projectLocalOrganizationListSelect: [],
    projectConnectListSelect: [],
    addedTeamList: [],
    addedPartnerList: [],
    addedLocalOrganizationList: [],
    addedConnectList: [],
    tabSelectIndex: 1,
    teamId: 0,
    projectDelIndex: -1,
    richTextTypeList:[],//项目资源的图文类型
    projectPartner:null,
    proTeamAddPartnerSelect:[],//支持多选团队人，然后给团队加资助方
    projectConnect:null,
    searchValuesResource: {},
    searchListResource: [],
    paginationResource: {},
    solveWayList:[],
    subjectList:[],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/visit/projectManage') {
          let user = JSON.parse(sessionStorage.getItem('UserStrom'))
          if (user == null) {
            dispatch({
              type: 'app/querys',
            })
          } else {
            dispatch({
              type: 'queryProject',
            })

            let isAuthority = false
            if (JSON.parse(sessionStorage.getItem('UserStrom')).roleType == 'admin') {
              isAuthority = true
            }
            let dd = new Date()
            const today = (dd.getYear() + 1900) + '-' + (dd.getMonth() + 1) + '-' + dd.getDate()
            dispatch({
              type: 'querySuccess', payload: {
                tabKey: '1',
                projectKey: '1',
                expectedEndTime: [],
                actualEndTime: [],
                startDate: [],
                dateString: today,
                isAuthority,
                listLoading: true,
                projectTitle: '新建项目',
                projectRecord: '',
                resourcesList: [],
                dailyList: [],
                dailyListCurrPage: 0,
              },
            })
          }
        }
      })

    },
  },

  effects: {
    * queryProject ({ payload = {} }, { call, put, select }) {
      const data = yield call(queryProject, payload)
      if (data.success) {
        if (data.resultList.length != 0) {

          let projectTypeList = yield select(({ projectManage }) => projectManage.projectTypeList)
          if (projectTypeList == 0) {
            //如果没有初始化要用的数据，加载其它初始化数据
            const projectType = yield call(queryOptions, { id: 1 })
            if (projectType.success) {
              projectTypeList = projectType.list
            }

            let processList = yield select(({ projectManage }) => projectManage.processList)
            if (processList.length == 0) {
              const process = yield call(queryOptions, { id: 2 })
              if (process.success) {
                processList = process.list
              }
            }
            let subjectList = yield select(({ projectManage }) => projectManage.subjectList)
            if (subjectList.length == 0) {
              const process = yield call(queryOptions, { id: 5 })
              if (process.success) {
                subjectList = process.list
              }
            }
            let solveWayList = yield select(({ projectManage }) => projectManage.solveWayList)
            if (solveWayList.length == 0) {
              const process = yield call(queryOptions, { id: 6 })
              if (process.success) {
                solveWayList = process.list
              }
            }
            yield put({
              type: 'queryProjectSuccess',
              payload: {
                projectTypeList,
                processList,
                solveWayList,
                subjectList,
                projectList: data.resultList,
                listLoading: false,
                pagination: {
                  current: data.currentPage,
                  pageSize: data.pageSize,
                  total: data.total,
                  totalPage: data.totalPages,
                  showSizeChanger: false,
                },
              },
            })
          } else {
            yield put({
              type: 'queryProjectSuccess',
              payload: {
                projectList: data.resultList,
                listLoading: false,
                pagination: {
                  current: data.currentPage,
                  pageSize: data.pageSize,
                  total: data.total,
                  totalPage: data.totalPages,
                  showSizeChanger: false,
                },
              },
            })
          }


        } else {
          yield put({
            type: 'queryProjectSuccess',
            payload: {
              projectList: [],
              listLoading: false,
              pagination: {
                current: 0,
                pageSize: 0,
                total: 0,
                totalPage: 0,
                showSizeChanger: false,
              },
            },
          })
        }
        const focusData = yield call(queryFocusProjectId)
        if (focusData.projectId != null && focusData.projectId != '') {
          var focusProject = focusData.projectId.split(',')
          yield put({
            type: 'querySuccess',
            payload: {
              focusProject: focusProject,
            },
          })
        }
      }
      yield put({
        type: 'queryAllActiveStaff',
        payload: {
          //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
        },
      })
    },
    * queryTeamList ({ payload = {} }, { call, put, select }) {
      const data = yield call(getTeamList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            projectTeamList: data.list,
          },
        })
      }
    },
    * getProjectTeamList ({ payload = {} }, { call, put, select }) {
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      if (projectRecord) {
        const data = yield call(getProjectTeamList, { projectId: projectRecord.id })
        if (data.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              addedTeamList: data.list,
              ...payload,
            },
          })
        }
      } else {
        message.info('请先选择项目')
      }

    },
    * updateProjectTeam ({ payload = {} }, { call, put, select }) {
      //更新并返回最新数据
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      if (projectRecord) {
        const data = yield call(updateTeamList, {
          projectId: projectRecord.id,
          projectTeamListSelect: payload.projectTeamListSelect,
        })
        if (data.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              addProjectTeamModelShow: false,
              addedTeamList: data.list,
            },
          })
        }
      } else {
        message.info('请先选择项目')
      }
    },
    /**
     * 将对接人存储为合作机构（资方）并绑定到团队
     * @param payload
     * @param call
     * @param put
     * @param select
     * @returns {Generator<*, void, *>}
     */
    * addProjectTeamPartner ({ payload = {} }, { call, put, select }) {
      const data = yield call(addProjectTeamPartner,payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addProjectConnectModelShow: false,
          },
        })
      }
    },
    * deleteProjectTeam ({ payload = {} }, { call, put, select }) {
      let addedTeamList = yield select(({ projectManage }) => projectManage.addedTeamList)
      const data = yield call(deleteProjectTeam, payload)
      if (data.success) {
        addedTeamList.splice(parseInt(payload.projectDelIndex), 1);
        yield put({
          type: 'querySuccess',
          payload: {
            addedTeamList,
          },
        })
      }
    },
    * deleteProjectPartner ({ payload = {} }, { call, put, select }) {
      const data = yield call(deleteProjectPartner, payload)
      let addedPartnerList = yield select(({ projectManage }) => projectManage.addedPartnerList)
      if (data.success) {
        addedPartnerList.splice(parseInt(payload.projectDelIndex), 1);
        yield put({
          type: 'querySuccess',
          payload: {
            addedPartnerList: addedPartnerList,
          },
        })
      }
    },
    * queryPartnerList ({ payload = {} }, { call, put, select }) {
      const data = yield call(getPartnerList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            projectPartnerList: data.list,
          },
        })
      }
    },
    * getTeamPartnerList ({ payload = {} }, { call, put, select }) {
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      const data = yield call(getTeamPartnerList, { projectId: projectRecord.id })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addedPartnerList: data.list,
            ...payload,
          },
        })
      }
    },

    * updateProjectPartner ({ payload = {} }, { call, put, select }) {
      //更新并返回最新数据
      console.log("----updateProjectPartner----",payload);
      const data = yield call(updatePartnerList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addProjectPartnerModelShow: false,
            addedPartnerList: data.list,
          },
        })
      }
    },
    * updateProjectPartnerCost ({ payload = {} }, { call, put, select }) {
      const data = yield call(addProjectPartnerCost, {
        id:payload.projectPartner.id,
        partnerCost:payload.projectPartner.partner_cost})
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            projectPartner: null,
            addProjectPartnerCostModelShow: false,
          },
        })
      }
    },
    * queryLocalOrganizationList ({ payload = {} }, { call, put, select }) {
      const data = yield call(getLocalOrganizationList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            projectLocalOrganizationList: data.list,
          },
        })
      }
    },
    * getProjectLocalOrganizationList ({ payload = {} }, { call, put, select }) {
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      const data = yield call(getProjectLocalOrganizationList, { projectId: projectRecord.id })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addedLocalOrganizationList: data.list,
            ...payload,
          },
        })
      }
    },
    * updateProjectLocalOrganization ({ payload = {} }, { call, put, select }) {
      //更新并返回最新数据
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      const data = yield call(updateLocalOrganizationList, {
        projectId: projectRecord.id,
        projectLocalOrganizationListSelect: payload.projectLocalOrganizationListSelect,
      })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addProjectLocalOrganizationModelShow: false,
            addedLocalOrganizationList: data.list,
          },
        })
      }
    },
    * queryConnectList ({ payload = {} }, { call, put, select }) {
      const data = yield call(getConnectList, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            projectConnectList: data.list,
          },
        })
      }
    },
    * getConnectList ({ payload = {} }, { call, put, select }) {
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      const data = yield call(getConnectList, { projectId: projectRecord.id })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addedConnectList: data.list,
            ...payload,
          },
        })
      }
    },
    * updateProjectConnect ({ payload = {} }, { call, put, select }) {
      //更新并返回最新数据
      const data = yield call(updateConnectList, {})
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addProjectConnectModelShow: false,
            addedConnectList: data.list,
          },
        })
      }
    },
    * queryAddress ({ payload = {} }, { call, put, select }) {
      const data = yield call(queryAddress, payload);
      console.log("--查询地址为--",data);
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            addressDataList: data.list,
            addressFetching: false,
          },
        })
      }
    },
    * queryProjectDaily ({ payload = {} }, { call, put, select }) {
      payload.currentPage = 1
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      payload.dataId = projectRecord.id
      payload.groupId = projectRecord.groupId
      payload.parentId = projectRecord.parentId
      const data = yield call(queryProjectDaily, payload)
      if (data.success) {
        let dailyListCache = []
        let dailyList = data.list
        let shareUrl = urls + '/temp/dataShare?id='
        let urlAndImg
        if (dailyList.length != 0) {
          for (let i in dailyList) {
            urlAndImg = '&dailyStatus=' + dailyList[i].status + '&url=' + encodeURIComponent(sharedLinks) + '&img=' + encodeURIComponent(sessionStorage.getItem('imgOne'))
            let contentArr = dailyList[i].content.split('@+!Z?@')
            let urlHost = dailyList[i].dailyType === 'resources' && contentArr.length > 1 ? download : ((dailyList[i].dailyType === 'form' || dailyList[i].dailyType === 'addForm') && contentArr.length > 1 ? shareUrl : window.location.protocol + '//' + window.location.host)
            let imgUrlHost = urls + '/pm/teletextShare'
            let contentHref = contentArr.length <= 1 ? contentArr[0] : (
              dailyList[i].dailyType === 'resources' ? contentArr[0] + '<a  href=\'' + urlHost + '/' + dailyList[i].dailyUrl + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2] : (
                dailyList[i].dailyType === 'form' ? contentArr[0] + '<a  href=\'' + urlHost + dailyList[i].dailyUrl + '&companyCode=' + JSON.parse(sessionStorage.getItem('UserStrom')).companyCode + urlAndImg + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2] : (
                  dailyList[i].dailyType === 'addForm' ?
                    contentArr[0] + '<a  href=\'' + urlHost + dailyList[i].dailyUrl + '&projectId=' + projectRecord.id + '&companyCode=' + JSON.parse(sessionStorage.getItem('UserStrom')).companyCode + urlAndImg + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2]
                    : contentArr[0] + '<a  href=\'' + imgUrlHost + '/' + dailyList[i].dailyUrl + urlAndImg + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2]
                )
              )
            )
            let obj = {
              createName: dailyList[i].createName + '的日志',
              content: contentHref,
              updateDate: dailyList[i].updateDate,
              id: dailyList[i].id,
              projectId: dailyList[i].projectId,
              logContants: contentHref,
              name: dailyList[i].createName,
              dailyType: dailyList[i].dailyType,
              processName: dailyList[i].processName,
            }
            dailyListCache.push(obj)
          }
          yield put({
            type: 'querySuccess',
            payload: {
              dailyListCurrPage: 1,
              dailyList: dailyListCache,
            },
          })
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              dailyListCurrPage: 1,
              dailyList: dailyList = [{
                content: '<p>该项目暂无日志</p>',
                logContants: '<p>该项目暂无日志</p>',
              }],
            },
          })
        }

      }
    },
    * queryProjectDailyMore ({ payload = {} }, { call, put, select }) {
      let currentPage = yield select(({ projectManage }) => projectManage.dailyListCurrPage)
      payload.currentPage = currentPage + 1
      let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      payload.dataId = projectRecord.id
      payload.groupId = projectRecord.groupId
      const data = yield call(queryProjectDaily, payload)
      if (data.success) {
        let dailyListCache = yield select(({ projectManage }) => projectManage.dailyList)
        let dailyList = data.list
        let shareUrl = urls + '/temp/dataShare?id='
        let urlAndImg
        if (dailyList.length != 0) {
          for (let i in dailyList) {
            urlAndImg = '&dailyStatus=' + dailyList[i].status + '&url=' + encodeURIComponent(sharedLinks) + '&img=' + encodeURIComponent(sessionStorage.getItem('imgOne'))
            let contentArr = dailyList[i].content.split('@+!Z?@')
            let urlHost = dailyList[i].dailyType === 'resources' && contentArr.length > 1 ? download : ((dailyList[i].dailyType === 'form' || dailyList[i].dailyType === 'addForm') && contentArr.length > 1 ? shareUrl : window.location.protocol + '//' + window.location.host)
            let imgUrlHost = urls + '/pm/teletextShare'
            let contentHref = contentArr.length <= 1 ? contentArr[0] : (
              dailyList[i].dailyType === 'resources' ? contentArr[0] + '<a  href=\'' + urlHost + '/' + dailyList[i].dailyUrl + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2] : (
                dailyList[i].dailyType === 'form' ? contentArr[0] + '<a  href=\'' + urlHost + dailyList[i].dailyUrl + '&companyCode=' + JSON.parse(sessionStorage.getItem('UserStrom')).companyCode + urlAndImg + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2] : (
                  dailyList[i].dailyType === 'addForm' ?
                    contentArr[0] + '<a  href=\'' + urlHost + dailyList[i].dailyUrl + '&projectId=' + projectRecord.id + '&companyCode=' + JSON.parse(sessionStorage.getItem('UserStrom')).companyCode + urlAndImg + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2]
                    : contentArr[0] + '<a  href=\'' + imgUrlHost + dailyList[i].dailyUrl + urlAndImg + '\' target=\'_blank\'>' + contentArr[1] + '</a>' + contentArr[2]
                )
              )
            )
            let obj = {
              createName: dailyList[i].createName + '的日志',
              content: dailyList[i].content,
              updateDate: dailyList[i].updateDate,
              id: dailyList[i].id,
              projectId: dailyList[i].projectId,
              logContants: contentHref,
              name: dailyList[i].createName,
              dailyType: dailyList[i].dailyType,
            }
            dailyListCache.push(obj)
          }
        } else {
          let obj = {
            content: '<p>没有更多日志了</p>',
            logContants: '<p>没有更多日志了</p>',
          }
          dailyListCache.push(obj)
        }
        yield put({
          type: 'querySuccess',
          payload: {
            dailyListCurrPage: currentPage + 1,
            dailyList: dailyListCache,
          },
        })
      }
    },
    * updateProjectDaily ({ payload = {} }, { call, put, select }) {
      const data = yield call(updateProjectDaily, payload)
      let dailyList = yield select(({ projectManage }) => projectManage.dailyList)
      if (data.flag == 1) {
        let today = getNowFormatDate()
        dailyList[payload.index].content = payload.content
        dailyList[payload.index].updateDate = today
        dailyList[payload.index].logContants = payload.content
        yield put({
          type: 'querySuccess',
          payload: {
            dailyList: dailyList,
          },
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
    * deleteProjectDaily ({ payload = {} }, { call, put, select }) {
      const data = yield call(deleteProjectDaily, payload)
      let dailyList = yield select(({ projectManage }) => projectManage.dailyList)
      dailyList.splice(payload.index, 1)
      yield put({
        type: 'querySuccess',
      })
      message.success(data.message)
    },
    * retryDefaultDailyView ({ payload = {} }, { call, put, select }) {
      let dailyList = yield select(({ projectManage }) => projectManage.dailyList)
      dailyList[payload.index].logContants = dailyList[payload.index].content
      yield put({
        type: 'querySuccess',
        payload: {
          dailyList: dailyList,
        },
      })
    },
    * updateProject ({ payload = {} }, { call, put, select }) {
      const data = yield call(updateProject, payload)
      let projectList = yield select(({ projectManage }) => projectManage.projectList)
      let recordIndex = yield select(({ projectManage }) => projectManage.recordIndex)
      let treeDom = yield select(({ projectManage }) => projectManage.treeDom)
      if (data.success) {
        if (data.flag) {
          projectList[recordIndex] = payload.value
          //刷新树
          if (treeDom != null) {
            treeDom.update(payload.value.id + '', payload.value)
            treeDom.refresh()
          }
          yield put({
            type: 'querySuccess',
            payload: {
              projectList: projectList,
              // projectRecord:"",
            },
          })
          message.success(data.message)
        } else {
          message.error(data.message)
        }
      }
    },
    * createProject ({ payload = {} }, { call, put, select }) {
      const data = yield call(createProject, payload)
      if (data.success) {
        if (data.flag) {
          let filter = yield select(({ projectManage }) => projectManage.filter)
          let treeDom = yield select(({ projectManage }) => projectManage.treeDom)
          yield put({
            type: 'querySuccess',
            payload: {
              addProjectModalVisible: false,
            },
          })
          yield put({
            type: 'queryProject',
            payload: {
              projectName: filter.projectName,
              executor: filter.executor,
              //user: sessionStorage.getItem("UserStrom"),
              //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
            },
          })

          //刷新树
          if (treeDom != null) {
            payload.value.id = data.obj
            treeDom.add(payload.value.parentId, payload.value)
            treeDom.refresh()
          }
          message.success(data.message)
        } else {
          message.error(data.message)
        }
        yield put({
          type: 'querySuccess',
          payload: {
            confirmLoading: false,
          },
        })
      }
    },
    * queryAllActiveStaff ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllActiveStaff, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            userList: data.list,
          },
        })
      }
    },
    * createProjectDaily ({ payload = {} }, { call, put }) {
      const data = yield call(createProjectDaily, payload)
      if (data.success) {
        if (data.flag) {
          message.success(data.message)
        } else {
          message.error(data.message)
        }
      }
    },
    * addProjectResource ({ payload = {} }, { call, put, select }) {
      const data = yield call(addProjectResource, payload)
      if (data.success) {
        if (data.flag) {
          message.success('保存成功')
          let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
          yield put({
            type: 'querySuccess',
            payload: {
              uploadModalVisible: false,
            },
          })
          yield put({
            type: 'queryProjectResources',
            payload: {
              projectId: projectRecord.id,
            },
          })
        } else {
          message.error('保存失败')
        }
      }
    },
    *initAddResourcesRichText({payload}, {call,put}){
      const data = yield call(queryProjectReport, payload);
      if (data.success == true) {
        if(data.list.length!=0){
          console.log("--queryProjectReport--1");
          if(data.list[0].id!=null){
            console.log("--queryProjectReport--1.1");
            let html=data.list[0].content
            const contentBlock = htmlToDraft(html);
            let editorStateOne
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              editorStateOne = EditorState.createWithContent(contentState);
            }
            yield put({
              type: 'querySuccess',
              payload: {
                TableList: data.list,
                editorStateOne:editorStateOne,
                name:data.list[0].resourcesName
              }
            })
          }else{
            console.log("--queryProjectReport--1.2");
            const contentBlock = htmlToDraft("");
            let editorStateOne
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              editorStateOne = EditorState.createWithContent(contentState);
            }
            yield put({
              type: 'querySuccess',
              payload: {
                TableList: [],
                editorStateOne:editorStateOne,
                name:data.list[0].resourcesName
              }
            })
          }
        }else {
          console.log("--queryProjectReport--2");
          yield put({
            type: 'querySuccess',
            payload: {
              TableList: [],
            }
          })
        }
      }
    },
    * queryProjectResources ({ payload = {} }, { call, put, select }) {
      const projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      if (projectRecord || payload.projectId) {
        const data = yield call(queryProjectResources, payload)
        if (data.success) {
          if (data.list.length != 0) {
            yield put({
              type: 'querySuccess',
              payload: {
                resourcesList: data.list,
                resourcesListLoading: false,
                tabSelectIndex: 1,
              },
            })
          } else {
            yield put({
              type: 'querySuccess',
              payload: {
                resourcesList: [],
                resourcesListLoading: false,
                tabSelectIndex: 1,
              },
            })
          }
          let tabKey = yield select(({ projectManage }) => projectManage.tabKey)
          if (tabKey == 2) {
            yield put({
              type: 'queryProjectDaily',
            })
          }
        }
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            resourcesList: [],
            resourcesListLoading: false,
            tabSelectIndex: 1,
          },
        })
      }

    },
    * addResource ({ payload = {} }, { call, put, select }) {
      const data = yield call(addProjectResourceFromStore, payload)
      if (data.success) {
        if (data.flag) {
          message.success('添加资源模板成功');
          const projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
          yield put({
            type: 'queryProjectResources',
            payload: {
              projectId: projectRecord.id,
            },
          })
        } else {
          message.error('上传资源模板失败')
        }
      }
    },
    * addProjectResourceModel ({ payload = {} }, { call, put, select }) {
      const data = yield call(addProjectResourceModel, payload)
      const projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
      if (data.success) {
        if (data.flag) {
          message.success('上传资源模板成功')
          yield put({
            type: 'querySuccess',
            payload: {
              uploadModelModalVisible: false,
            },
          })
          yield put({
            type: 'queryProjectResources',
            payload: {
              projectId: projectRecord.id,
            },
          })
        } else {
          message.error('上传资源模板失败')
        }
      }
    },
    * auditProjectResource ({ payload = {} }, { call, put, select }) {
      const data = yield call(auditProjectResource, payload)
      if (data.success) {
        if (data.flag) {
          message.success('审核成功')
          let projectRecord = yield select(({ projectManage }) => projectManage.projectRecord)
          yield put({
            type: 'queryProjectResources',
            payload: {
              projectId: projectRecord.id,
            },
          })
        } else {
          message.error('审核失败')
        }
      }
    },
    * copyProject ({ payload = {} }, { call, put, select }) {
      const data = yield call(copyProject, payload)
      if (data.success) {
        message.success('复制完成请重新查询')
      }
    },
    * deleteProject ({ payload = {} }, { call, put, select }) {
      const data = yield call(deleteProject, payload)
      let treeDom = yield select(({ projectManage }) => projectManage.treeDom)
      let projectList = yield select(({ projectManage }) => projectManage.projectList)
      let recordIndex = yield select(({ projectManage }) => projectManage.recordIndex)
      if (data.success) {
        projectList.splice(recordIndex, 1)
        //刷新树
        if (treeDom != null) {
          treeDom.remove(payload.id + '')
          treeDom.refresh()
        }
        yield put({
          type: 'querySuccess',
          payload: {
            projectList: projectList,
          },
        })
        message.success('删除成功')
      }
    },
    * queryForms ({ payload = {} }, { call, put, select }) {
      //自定表单下拉的列表
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
            uploadModelModalVisible: true,
          },
        })
      }
    },
    * deleteResource ({ payload = {} }, { call, put, select }) {
      const data = yield call(deleteResource, payload)
      if (data.success && data.flag) {
        let resourcesList = yield select(({ projectManage }) => projectManage.resourcesList)
        resourcesList.splice(payload.index, 1)
        yield put({
          type: 'querySuccess',
          payload: {
            resourcesList: resourcesList,
          },
        })
        message.success('删除成功')
      } else {
        message.success(data.message)
      }
    },
    //关注
    * insertFocusProject ({ payload = {} }, { call, put, select }) {
      const data = yield call(insertFocusProject, payload)
      let focusProject = yield select(({ projectManage }) => projectManage.focusProject)
      if (data.flag == 1) {
        focusProject.push(payload.projectId)
        yield put({
          type: 'querySuccess',
          payload: {
            attention: '取消关注',
            focusProject: focusProject,
          },
        })
        message.success(data.message)
      } else {
        message.success(data.message)
      }
    },
    //取消关注
    * deleteFocusProject ({ payload = {} }, { call, put, select }) {
      const data = yield call(deleteFocusProject, payload)
      let focusProject = yield select(({ projectManage }) => projectManage.focusProject)
      if (data.flag == 1) {
        for (var i in focusProject) {
          if (focusProject[i] == payload.projectId) {
            focusProject.splice(i, 1)
          }
        }
        yield put({
          type: 'querySuccess',
          payload: {
            attention: '关注',
            focusProject: focusProject,
          },
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
    * searchListResource ({ payload }, { call, put, select }) {
      const data = yield call(queryHistoryResources, payload)
      if (data.success == true) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchValuesResource:payload.searchValuesResource,
            searchListResource: data.resultList,
            paginationResource: {
              current: data.currentPage,
              pageSize: data.pageSize,
              total: data.total,
              totalPage: data.totalPages,
            },
          },
        })
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    queryProjectSuccess (state, { payload }) {
      const { pagination } = payload
      return {
        ...state, ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },


  },
})
