import React from 'react'
import {connect} from 'dva'
import moment from 'moment'
import {Link} from 'dva/router'
import {Row,Tooltip ,Col,Button, Form,Radio,Spin,Tabs, message,Input,DatePicker,Select,Modal,Icon} from 'antd'
import {changeTableColorByClick} from '../../utils/common'
import Filter from './Filter'
import ProjectList from './ProjectList'
import ResourcesList from './ResourcesList'
import DailyList  from './DailyList'
import DailyCard  from './DailyCard'
import AddProjectModal from './AddProjectModal'
import ProjectTree from './ProjectTree'
import NewJournal from './NewJournal'
import JournalFilter from './JournalFilter'
import UploadModal from './UploadModal'
import UploadResouceModal from './UploadResouceModal'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
const ButtonGroup = Button.Group;
import {sharedLinks} from '../../utils/config';
import { config} from 'utils'
import ProjectTeamList from './ProjectTeamList'
import ProjectTeamAddList from './ProjectTeamAddList'
import ProjectPartnerList from './ProjecPartnerList'
import ProjectPartnerAddList from './ProjecPartnerAddList'
import ProjectLocalOrganizationList from './ProjectLocalOrganizationList'
import ProjectLocalOrganizationAddList from './ProjectLocalOrganizationAddList'
import ProjectConnectList from './ProjectConnectList'
import ProjectConnectAddList from './ProjectConnectAddList'
import ProjectPartnerAddCost from './ProjectPartnerAddCost'
import styles from "../../utils/commonStyle.less"

const {api} = config
const {urls} = api


const ProjectManage = ({
  dispatch, projectManage, loading,app,
  form: {
    getFieldsValue,
    setFieldsValue,
    getFieldDecorator,
    validateFields
    },
  }) => {

  const {recordIndex,selectName,cards,logContant,fileResourcesName,projectTitle,resourcesListLoading,listLoading,fileListOne,fileUrlOne,fileNameOne,expectedEndTime,formName,FormModalVisible,actualEndTime,startDate,projectList,pagination,filter,projectRecord,addProjectModalVisible ,confirmLoading ,userList ,dailyList,
    tabKey ,dateString,treeSearchKey,modalType,uploadModalVisible,fileUrl,fileName,resourcesList,uploadModelModalVisible,resourcesRecord,resourcesType,treeDom,isAuthority,
    fileList,projectKey,treeData,treeMode,formList,rightStatus,attention,focusProject,
    processList,projectTypeList,addressFetching,addressDataList,addressShow,researchShow,addressId,
    addProjectTeamModelShow,
    addProjectPartnerModelShow,
    addProjectPartnerCostModelShow,
    addProjectLocalOrganizationModelShow,
    addProjectConnectModelShow,
    projectTeamList,
    projectPartnerList,
    projectLocalOrganizationList,
    projectConnectList,
    projectTeamListSelect,
    projectPartnerListSelect,
    projectLocalOrganizationListSelect,
    projectConnectListSelect,
    addedTeamList,
    addedPartnerList,
    addedLocalOrganizationList,
    addedConnectList,
    tabSelectIndex,
    teamId,
    richTextTypeList,
    projectPartner,
    proTeamAddPartnerSelect,
    projectConnect,subjectList,solveWayList
  } = projectManage
  const {optionItem}=app
  // 判断是否具有Boss权限
  const user = sessionStorage.getItem("UserStrom")
  const isBoss = JSON.parse(user).roleType == "admin"
  const userName = JSON.parse(user).userName
  const id = JSON.parse(user).id
  const code = JSON.parse(user).companyCode
  const FormItem = Form.Item;
  const TabPane = Tabs.TabPane;
  const {TextArea} = Input;
  const levelOptions = ['1', '2', '3', '4', '5'];

  //创建变量
  getFieldDecorator('regionId', {
    initialValue:projectRecord.regionId,
  });
  getFieldDecorator('regionAddress', {
    initialValue:projectRecord.regionAddress,
  });


  let dd = new Date();
  const today = (dd.getYear() + 1900) + "-" + (dd.getMonth() + 1) + "-" + dd.getDate();
  const viewPeopleChild = [];
  for (let i in userList) {
    viewPeopleChild.push(<Option value={userList[i].id} key={'ul'+i}>{userList[i].userName}</Option>);
  }
  //项目所在地{addressDataList.map(d => <Option key={d.value}>{d.text}</Option>)}
  const addressChild = [];
  if(addressShow){
    for (let i in addressDataList) {
      addressChild.push(<Option value={addressDataList[i].id+'@@'+addressDataList[i].mername} key={'adl'+i}>{addressDataList[i].mername}</Option>);
    }
  }


  const subjectChild = [];
  subjectChild.push(<Option key={"-998"} value={""}>{""}</Option>);
  for (let i in subjectList) {
    subjectChild.push(<Option value={''+subjectList[i].key} key={'adl'+i}>{subjectList[i].key}</Option>);
  }

  const solveWayChild = [];
  solveWayChild.push(<Option key={"-997"} value={""}>{""}</Option>);
  for (let i in solveWayList) {
    solveWayChild.push(<Option value={''+solveWayList[i].key} key={'adl'+i}>{solveWayList[i].key}</Option>);
  }
  //项目阶段
  const processChild = [];
  processChild.push(<Option key={"-999"} value={""}>{""}</Option>);
  for (let i in processList) {
    processChild.push(<Option value={''+processList[i].value} key={'pl'+i}>{processList[i].key}</Option>);
  }
  //项目类型
  const projectTypeChild = [];
  projectTypeChild.push(<Option key={"-99"} value={""}>{""}</Option>);
  for (let i in projectTypeList) {
    projectTypeChild.push(<Option value={''+projectTypeList[i].value} key={'ptl'+i}>{projectTypeList[i].key}</Option>);
  }
  const viewPeopleAndAllChild = [];
  viewPeopleAndAllChild.push(<Option key={"All"}>{"All"}</Option>);
  for (let j in userList) {
    viewPeopleAndAllChild.push(<Option value={userList[j].id} key={'vpv'+j}>{userList[j].userName}</Option>);
  }
  const FilterProps = {
    viewPeopleChild, isBoss, rightStatus, optionItem, dispatch,
    newProject(){
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          addProjectModalVisible: true,
          modalType: "1"
        }
      })
    },
    onFilterChange(value){
      dispatch({
        type: "projectManage/queryProject",
        payload: {
          projectName: value.projectName,
          executor: value.executor,
          groupId: value.groupId,
          //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
          //user,
        }
      })
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          filter: value,
          listLoading: true,
        }
      })
    },
    copyProject(){
      if (null != projectRecord && projectRecord != "") {
        Modal.confirm({
          title: '确认框',
          content: '确认要复制【 ' + projectRecord.projectName + ' 】项目吗？',
          onOk() {
            dispatch({
              type: "projectManage/copyProject", payload: {
                id: projectRecord.id,
                creater: projectRecord.creater,
                //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
              }
            })
          },
          onCancel() {
            return
          }
        });
      } else {
        message.info("请选择项目")
      }
    }
  }
  const ProjectListProps = {
    dispatch,
    pagination,
    dataSource: projectList,
    treeSearchKey,
    treeData,
    treeMode,
    treeCreateProject: createProject,
    treeOnUpload: onUpload,
    treeDom,
    setTreeMode(val){
      dispatch({
        type: "projectManage/querySuccess", payload: {
          treeMode: val
        }
      })
    },
    setTreeData(val){
      dispatch({
        type: "projectManage/querySuccess", payload: {
          treeData: val
        }
      })
    },
    setIsAuthority(val){
      dispatch({
        type: "projectManage/querySuccess", payload: {
          isAuthority: val
        }
      })
    },
    setTreeDom(treeDom){
      dispatch({
        type: "projectManage/querySuccess", payload: {
          treeDom: treeDom
        }
      })
      return treeDom;
    },
    treeCopyProject(projectRecord){
      if (null != projectRecord && projectRecord != "") {
        Modal.confirm({
          title: '确认框',
          content: '确认要复制此项目吗？',
          onOk() {
            dispatch({
              type: "projectManage/copyProject", payload: {
                id: projectRecord.id,
                creater: projectRecord.creater,
                //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
              }
            })
          },
          onCancel() {
            return
          }
        });
      } else {
        message.info("请选择项目")
      }
    },
    treeSelectTabKey(key){
      dispatch({
        type: "projectManage/querySuccess", payload: {
          tabKey: key
        }
      })
    },
    handleReset(){
      const fields = getFieldsValue()
      for (let item in fields) {
        if ({}.hasOwnProperty.call(fields, item)) {
          if (fields[item] instanceof Array) {
            fields[item] = []
          } else {
            fields[item] = undefined
          }
        }
      }
      setFieldsValue(fields)
    },
    onChange(page){
      dispatch({
        type: "projectManage/queryProject", payload: {
          currentPage: page.current,
          pageSize: page.pageSize,
          projectName: filter.projectName,
          executor: filter.executor,
          groupId: filter.groupId,
          //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
          //user
        }
      })
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          listLoading: true,
        }
      })
    },
    /**
     * 项目树形菜单被单机时赋值
     * @param record
     * @param index
     */
    listRowClick(record, index){
      if (index != undefined) {
        changeTableColorByClick("projectList", index);
      }
      //判断该项目是否被登录人关注，存在按钮则变为“取消关注”，不存在则变为“关注”
      var attentionTitle;
      var exists = focusProject?focusProject.indexOf(record.id):-1;
      if (exists <= 0) {
        attentionTitle = "关注"
      } else {
        attentionTitle = "取消关注"
      }
      console.log("-----树被单击的值为-----",record);
      let addressShow=record.projectType==2?true:false;//如果项目是吾水专项项目则显示项目所在地
      let researchShow=record.projectType==1?true:false;//如果项目是吾水专项项目则显示项目所在地
 /*     if(record.projectType==2){
        //吾水专项需要查询出对应的下拉列表项
        dispatch({
          type: "projectManage/queryAddress", payload: {
            address:record.regionAddress,
          }
        });
      }*/
      dispatch({
        type: "projectManage/querySuccess", payload: {
          projectRecord: record,
          expectedEndTime: [],
          actualEndTime: [],
          startDate: [],
          recordIndex: index,
          attention: attentionTitle,
          resourcesListLoading: true,
          projectTitle: "新建子项目",
          addressDataList:[],//更换项目时置空
          addressShow,researchShow,
        }
      });
      if (isBoss || record.creater === id || record.executor === id) {
        dispatch({
          type: "projectManage/querySuccess",
          payload: {
            isAuthority: true,
          }
        })
      }
      else {
        dispatch({
          type: "projectManage/querySuccess",
          payload: {
            isAuthority: false,
            resourcesListLoading: false
          }
        })
      }
      if(tabSelectIndex==1){
        dispatch({
          type: "projectManage/queryProjectResources", payload: {
            groupId: record.groupId,
            projectId: record.id,
            updateDate: dateString == "" ? today : dateString,
          }
        })
      }else{
        bottomTabsClick(tabSelectIndex);
      }



      let field = [];
      field.projectName = record.projectName != undefined ? record.projectName : '';
      field.creater = record.createrName != undefined ? record.createrName : '';
      field.executor = record.executor != undefined ? record.executor : '';
      //field.startDate = (null == record.startDate || record.startDate == "" || record.startDate == undefined) ? "" : moment(record.startDate);
      //field.expectedEndTime = (null == record.expectedEndTime || record.expectedEndTime == "" || record.expectedEndTime == undefined) ? "" : moment(record.expectedEndTime);
      //field.actualEndTime = (null == record.actualEndTime || record.actualEndTime == "" || record.actualEndTime == undefined) ? "" : moment(record.actualEndTime);
      //field.isOverdue = record.isOverdue != undefined ? record.isOverdue : '';
      //field.projectProgress = record.projectProgress != undefined ? record.projectProgress + "%" : '';
      //field.priority = record.priority != undefined ? record.priority : '';
      //field.level = record.level != undefined ? record.level : '';
      field.viewPeople = (null == record.viewPeople || record.viewPeople == "" || record.viewPeople == undefined) ? "" : record.viewPeople.split(',');
      field.remark = record.remark != undefined ? record.remark : '';
      field.status = record.status != undefined ? record.status : '';
      if(record.parentId!=0){
        console.log("===========1",record.projectType,record.process);
        field.projectType = record.projectType? record.projectType : '';
        field.process = record.process? record.process : '';
        //field.regionId= record.regionId != undefined ? record.regionId : '';
        if(record.projectType==1){
          field.subject=record.subject? record.subject : '';
        }
        if(record.projectType==2){
          field.enjoyNum= record.enjoyNum ? record.enjoyNum : '';
          field.solveWay= record.solveWay ? record.solveWay : '';
          console.log("---------2");
          field.regionAddressMid= record.regionAddress ? record.regionAddress : '';
          field.regionId= record.regionId ? record.regionId : 0;
          field.regionAdress= record.regionAdress ? record.regionAdress : '';
          console.log("---------3");

        }

      }
      console.log("---------4",field);
      setFieldsValue(field)
    }
  }
  const addProjectProps = {
    dispatch,
    userName,
    expectedEndTime,
    startDate,
    projectRecord,
    user,
    levelOptions,
    viewPeopleChild,
    confirmLoading,
    actualEndTime,
    modalType,
    viewPeopleAndAllChild,
    maskClosable: false,
    visible: addProjectModalVisible,
    optionItem,
    selectName,
    projectTypeList,processList,
  }

  function onUpload() {
    if (null != projectRecord && projectRecord != "") {
      //查询弹出资源表单所需要的基础数据
      dispatch({
        type: "projectManage/queryForms", payload: {
          pageSize: 10000,
          //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
        }
      })
    } else {
      message.info("请先选择项目")
    }
  }

  function updateProject() {
    if (null != projectRecord && projectRecord != "") {
      validateFields((error, value) => {
        if (error) {
          return
        }
        /*if (value.expectedEndTime != "" && value.expectedEndTime != undefined) {
          if (expectedEndTime != "") {
            value.expectedEndTime = expectedEndTime
          } else {
            value.expectedEndTime = projectRecord.expectedEndTime
          }
        } else {
          value.expectedEndTime = null
        }
        if (value.actualEndTime != "" && value.actualEndTime != undefined) {
          if (actualEndTime != "") {
            value.actualEndTime = actualEndTime
          } else {
            value.actualEndTime = projectRecord.actualEndTime
          }
        } else {
          value.actualEndTime = null
        }
        if (value.startDate != "" && value.startDate != undefined) {
          if (startDate != "") {
            value.startDate = startDate
          } else {
            value.startDate = projectRecord.startDate
          }
        } else {
          value.startDate = null
        }
        value.projectProgress = value.projectProgress.toString().replace("%", "");*/
        if(value.viewPeople&&value.viewPeople.indexOf('All')>-1){
          value.viewPeople="All";
        }else{
          value.viewPeople = value.viewPeople.toString();
        }
        value.id = projectRecord.id;
        value.groupId = projectRecord.groupId;
        value.name = value.projectName;

/*        if(value.projectType==2){
          //吾水专项
          value.regionId = addressId;
        }*/
        console.log("--保存项目数据--",value);
        //value.companyCode = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode;
        //value.creater = JSON.parse(sessionStorage.getItem("UserStrom")).id;
        value.executorName = selectName == "" ? projectRecord.executorName : selectName;
        //let raMid=value.regionAddressMid;
        //value.regionAddress=raMid&&raMid.split('@@').length>1?raMid.split('@@')[1]:raMid;
        //value.regionId=raMid&&raMid.split('@@').length>1?raMid.split('@@')[0]:0;
        console.log("保存",value);
        dispatch({
          type: "projectManage/updateProject",
          payload: {
            value,
          }
        })
      })
    } else {
      message.info("请选择项目")
    }
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
  }

  function createProject() {
    if (projectTitle == "新建项目") {
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          addProjectModalVisible: true,
          modalType: "1",
        }
      })
    } else if (projectTitle == "新建子项目") {
      dispatch({
        type: "projectManage/querySuccess", payload: {
          addProjectModalVisible: true,
          modalType: "2",
        }
      })
    }
  }

  function proChange(value) {
    if (value == "100") {
      let field = getFieldsValue()
      if (field.status != "Cancel") {
        if (null == field.actualEndTime || field.actualEndTime == "" || field.actualEndTime == undefined) {
          let date = new Date()
          let time = (date.getYear() + 1900) + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          dispatch({
            type: "projectManage/querySuccess", payload: {
              actualEndTime: time,
            }
          });
          field.actualEndTime = moment(time)
        }
        field.status = "Completed"
      }
    }
  }

  const NewJournalProps = {
    dispatch,
    userName,
    projectRecord,
    today,
  }

  function newJournal() {
    if (null == projectRecord || projectRecord == "") {
      message.info("请选择节点写日志")
      return
    }
    document.getElementsByName("filterRow").item(0).style.display = "block"
  }

  const JournalFilterProps = {
    projectRecord, dispatch, dateString,
    onFilterChange(value){
      if (value.projectName != undefined) {
        dispatch({
          type: "projectManage/queryProjectDaily", payload: {
            projectName: value.projectName,
            updateDate: dateString,
          }
        })
      }
    }
  }

  function tabsClick(key) {
    if (key == "2" && projectRecord != "") {
      if (projectRecord.parentId == 0) {
        dispatch({
          type: "projectManage/queryProjectDaily", payload: {
            groupId: projectRecord.groupId,
            updateDate: dateString == "" ? today : dateString
          }
        })
      } else {
        dispatch({
          type: "projectManage/queryProjectDaily", payload: {
            groupId: projectRecord.groupId,
            dataId: projectRecord.id,
            updateDate: dateString == "" ? today : dateString
          }
        })
      }
    }
    dispatch({type: "projectManage/querySuccess", payload: {tabKey: key}})
  }

  function onDelete() {
    if (null != projectRecord && projectRecord != "") {
      Modal.confirm({
        title: '确认框',
        content: '确认要删除【 ' + projectRecord.projectName + ' 】项目以及它下面所有的子项目吗？',
        onOk() {
          dispatch({
            type: "projectManage/deleteProject", payload: {
              id: projectRecord.id,
              userName,
              companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
            }
          })
          dispatch({
            type: "projectManage/querySuccess", payload: {
              projectList: projectList,
              recordIndex: recordIndex,
            }
          })
        },
        onCancel() {
          return
        }
      });
    } else {
      message.info("请选择项目")
    }
  }

  const UploadModalProps = {
    dispatch, resourcesRecord, projectRecord, fileUrl, fileName, userName, fileList, id,
    visible: uploadModalVisible,
    width: '400px',
    maskClosable: false,
  }
  const UploadModelModalProps = {
    projectManage,
    dispatch,
    projectRecord,
    userName,
    fileUrl,
    resourcesType,
    fileList,
    formList,
    fileName,
    fileListOne,
    fileUrlOne,
    fileNameOne,
    id,
    visible: uploadModelModalVisible,
    width: '700px',
    maskClosable: false,
    fileResourcesName,
    richTextTypeList,
  }
  const ResourcesListProps = {
    dispatch, userName, code,
    dataSource: resourcesList,
    pagination: false,
    resourceListIndex: "",
    id,
    isAuthority,
    // loading: loading.effects['projectManage/queryProjectResources'],
  }

  function projectClick(key) {
    dispatch({
      type: "projectManage/querySuccess",
      payload: {
        projectKey: key,
        projectTitle: "新建项目",
        projectRecord: ""
      }
    })
    handleReset()
  }

  function onOpenAndEnd() {
    dispatch({
      type: "projectManage/querySuccess", payload: {
        rightStatus: !rightStatus
      }
    })
  }

  function onChangeRadio(e) {
    if (null != projectRecord && projectRecord != "") {
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          FormModalVisible: true,
        }
      });
      dispatch({
        type: "projectManage/queryForms", payload: {
          pageSize: 10000,
          //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
        }
      })
    } else {
      message.info("请选择项目")
    }
  }

  const FormModalProps = {
    dispatch,
    projectRecord,
    formList,
    visible: FormModalVisible,
    width: '400px',
    maskClosable: false,
    userName,
    formName,
  }
  const supervisorProps = {
    dispatch,
    companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
    optionItem
  }
  const dailyCardProps = {
    dispatch,
    dailyList,
    userName,
    logContant,
    projectRecord,
  }
  const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };
  const addressLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  };

  function queryMoreDaily() {
    dispatch({
      type: "projectManage/queryProjectDailyMore",
      payload: {}
    })
  }

  function shareDailyLink() {
    if (null != projectRecord && projectRecord != "") {
      let urlAndImg = "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
      let shareDailyLink = urls + "/pm/shareInsertDaily?id=" + projectRecord.id + urlAndImg
      window.open(shareDailyLink)
    } else {
      message.info("请选择项目")
    }
  }

  function onAttention() {
    if (null != projectRecord && projectRecord != "") {
      if (attention === "关注") {
        dispatch({
          type: "projectManage/insertFocusProject",
          payload: {
            projectId: projectRecord.id,
            type: "project",
          }
        })
      } else {
        dispatch({
          type: "projectManage/deleteFocusProject",
          payload: {
            projectId: projectRecord.id,
            type: "project",
          }
        })
      }
    } else {
      message.info("请选择项目")
    }
  }

  function fetchAddress(value){
    dispatch({
      type: "projectManage/querySuccess",
      payload: {
        fetching: true
      }
    })
    dispatch({
      type: "projectManage/queryAddress",
      payload: {
        address:value,
      }
    })

  }

  function handleAddressShow(value){
    console.log("---handleAddressShow-",value);
    if(parseInt(value)==2){
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          addressShow: true,
          researchShow:false,
        }
      })
    }else if(parseInt(value)==1){
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          addressShow: false,
          researchShow:true,
        }
      })
    }else {
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          addressShow: false,
          researchShow:false,
        }
      })
    }
  }
  const projectTeamAddProps = {
    dispatch,
    projectTeamList:projectTeamList,
    visible:addProjectTeamModelShow,
    projectTeamListSelect,
    width: '700px',
    maskClosable: false,
  }
  const projectTeamProps = {
    dispatch,
    addedTeamList,
    projectRecord,
    proTeamAddPartnerSelect,
  }
  const projectPartnerAddProps = {
    dispatch,
    projectPartnerList:projectPartnerList,
    visible:addProjectPartnerModelShow,
    projectPartnerListSelect,
    projectRecord,
    teamId,
    proTeamAddPartnerSelect,
    width: '700px',
    maskClosable: false,
  }
  const projectPartnerAddCostProps = {
    dispatch,
    visible:addProjectPartnerCostModelShow,
    projectPartner,
    width: '700px',
    maskClosable: false,
  }
  const projectPartnerProps = {
    dispatch,
    addedPartnerList,
  }
  const projectLocalOrganizationAddProps = {
    dispatch,
    projectLocalOrganizationList:projectLocalOrganizationList,
    visible:addProjectLocalOrganizationModelShow,
    projectLocalOrganizationListSelect,
    width: '900px',
    maskClosable: false,
  }
  const projectLocalOrganizationProps = {
    dispatch,
    addedLocalOrganizationList
  }
  const projectConnectAddProps = {
    dispatch,
    visible:addProjectConnectModelShow,
    projectTeamListSelect,
    projectTeamList,
    projectConnect,
    width: '700px',
    maskClosable: false,
  }
  const projectConnectProps = {
    dispatch,
    addedConnectList
  }

  function addModelShow(index) {
    console.log("----addModelShow---",index);
    if (null != projectRecord && projectRecord != "") {
      dispatch({
        type: "projectManage/querySuccess",
        payload: {
          addProjectTeamModelShow:index==2?true:false,
          addProjectPartnerModelShow:index==3?true:false,//要特殊出，单击团队加资助方
          addProjectLocalOrganizationModelShow:index==4?true:false,
          addProjectConnectModelShow:index==5?true:false,
          projectTeamListSelect:[],
          projectPartnerListSelect:[],
          projectLocalOrganizationListSelect:[],
          projectConnectListSelect:[],
        }
      })
    }
  }

  function bottomTabsClick(index){
    console.log("----bottomTabsClick---",index);
    if(projectRecord){
      if(index==1){
        dispatch({
          type: "projectManage/queryProjectResources",
          payload: {
            projectId: projectRecord.id,
            tabSelectIndex:index,
          }
        })
        return;
      }
      let type=index==2?"getProjectTeamList":index==3?"getTeamPartnerList":index==4?"getProjectLocalOrganizationList":index==5?"getConnectList":"";
      dispatch({
        type: "projectManage/"+type,
        payload: {
          tabSelectIndex:index,
        }
      })
    }


  }

  function handleAddressChange (value) {
    console.log("---选择地址--",value);
    let raMid=value.split('@@');
    setFieldsValue({
      regionAddress: raMid[1],
      regionId: raMid[0],
    });
  }

  return (
    <div style={{minWidth:'720px',marginTop:'40px'}}>
      <Row gutter={24}>
        <Col span={12}
             style={{height:"540px",minWidth:'360px',borderRight:"2px solid #f7f7f7",borderBottom:"2px solid #f7f7f7"}}>

          <Tabs activeKey={projectKey} onTabClick={projectClick}
                tabBarExtraContent={rightStatus?<Button size="default" style={{border:"none"}} type="primary" ghost onClick={onOpenAndEnd}><Icon type="menu-unfold"></Icon></Button>:
                  <Button size="default" style={{border:"none"}} type="primary" ghost onClick={onOpenAndEnd}><Icon type="menu-fold"></Icon></Button>}
          >
            <TabPane tab="项目管理" key="1">
              <Filter {...FilterProps}/>
              <Spin spinning={listLoading}>
                <ProjectList {...ProjectListProps} style={{marginTop:"10px"}}/>
              </Spin>
            </TabPane>
            <TabPane tab="项目树" key="2"  style={{paddingTop:'10px'}}>
              {projectKey == 2 && <ProjectTree {...ProjectListProps}/>}
            </TabPane>
          </Tabs>

        </Col>
        <Col span={12}
             style={{height:"540px",minWidth:'360px',borderLeft:"2px solid #f7f7f7",borderBottom:"2px solid #f7f7f7",overflow:"scroll",paddingLeft:"5px"}}>
          <Tabs activeKey={tabKey} className="content-inner" onTabClick={tabsClick}>
            <TabPane tab="项目详情" key="1" style={{paddingTop:'10px'}}>
              <Button type="primary" size="default" className={[styles.marginRight,styles.marginBottom]} disabled={!isAuthority}
                      onClick={updateProject}>保存</Button>
              <Button size="default" c className={[styles.marginRight,styles.marginBottom]}  disabled={!isAuthority}
                      onClick={createProject}>{projectTitle}</Button>
              <Button size="default"  className={[styles.marginRight,styles.marginBottom]}  disabled={!isAuthority} onClick={onDelete}>删除项目</Button>
              <ButtonGroup  className={[styles.marginRight,styles.marginBottom]} >
                <Button onClick={newJournal} disabled={!isAuthority}>添加时间线</Button>
                <Button title="分享添加时间线" onClick={shareDailyLink} disabled={!isAuthority}><Icon type="share-alt"
                                                                                              style={{marginBottom:'4px'}}/></Button>
              </ButtonGroup>

              <Button size="default" className="margin-right margin-bottom" disabled={!isAuthority}
                      onClick={onAttention}>{attention}</Button>
              <NewJournal {...NewJournalProps}/>
              <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <FormItem label="项目名称:" {...formItemLayout}>
                    {getFieldDecorator('projectName', {
                      initialValue: "",
                      rules: [{required: true, message: "请输入项目名称"}]
                    })(<Input size='default' disabled={!isAuthority} style={{ width:"100%"}}/>)}
                  </FormItem>
                </Col>
                <Col xs={24} sm={12}>
                  <FormItem label="状态:" {...formItemLayout}>
                    {getFieldDecorator('status', {})(
                      <Select size='default' disabled={!isAuthority} style={{ width:"100%"}}>
                        <Option key={"Prepare"}>{"筹备"}</Option>
                        <Option key={"Active"}>{"发布"}</Option>
                        <Option key={"Completed"}>{"已完成"}</Option>
                        <Option key={"Cancel"}>{"取消"}</Option>
                      </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <FormItem label="负责人:" {...formItemLayout}>
                    {getFieldDecorator('executor', {
                      rules: [{required: true, message: "请选择负责人"}]
                    })(<Select showSearch size='default' disabled={!isAuthority} style={{width: "100%"}}
                               getPopupContainer={triggerNode => triggerNode.parentNode}
                               onSelect={function handleChange(value,option){
                                 dispatch({
                                   type: "projectManage/querySuccess",
                                   payload: {
                                     selectName:option.props.children
                                   }
                                 })
                               }}>
                        {viewPeopleChild}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xs={24} sm={12}>
                  <FormItem label="创建人:" {...formItemLayout}>
                    {getFieldDecorator('creater', {})(<Input size='default' style={{ width:"100%"}} disabled={true}/>)}
                  </FormItem>
                </Col>
              </Row>
              {projectRecord.parentId!=0&&<Row gutter={24}>
                <Col xs={24} sm={12}>
                  <FormItem label="项目类型:" {...formItemLayout}>
                    {getFieldDecorator('projectType', {
                      initialValue:projectRecord.projectType
                    })(<Select
                      onChange={handleAddressShow}
                      size='default'  style={{ width:"100%"}}  >
                      {projectTypeChild}
                    </Select>)}
                  </FormItem>
                </Col>
                <Col xs={24} sm={12}>
                  <FormItem label="项目阶段:" {...formItemLayout}>
                    {getFieldDecorator('process', {
                      initialValue:projectRecord.process
                    })(<Select size='default'  style={{ width:"100%"}}>
                      {processChild}
                    </Select>)}
                  </FormItem>
                </Col>
              </Row>}
              {(researchShow)&&<Row gutter={24}>
                <Col xs={24} sm={12}>
                  <FormItem label="项目主题:" {...formItemLayout}>
                    {getFieldDecorator('subject', {
                      initialValue:projectRecord.subject
                    })(
                      <Select
                        placeholder="选择项目主题"
                        filterOption={false}
                        style={{ width: '100%' }}
                      >
                        {subjectChild}
                      </Select>
                    )}

                  </FormItem>
                </Col>
              </Row>}
              {(addressShow)&&<Row gutter={24}>
                <Col xs={24} sm={24}>
                  <FormItem label="项目所在地:" {...addressLayout}>
                    {getFieldDecorator('regionAddressMid', {
                      initialValue:projectRecord.regionAddress
                    })(
                      <Select
                        showSearch
                        placeholder="选择项目所在地"
                        notFoundContent={addressFetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={fetchAddress}
                        onChange={handleAddressChange}
                        style={{ width: '100%' }}
                      >
                        {addressChild}
                      </Select>
                    )}

                  </FormItem>
                </Col>
              </Row>}
              {(addressShow)&&<Row gutter={24}>

                <Col xs={24} sm={12}>
                  <FormItem label="解决方案:" {...formItemLayout}>
                    {getFieldDecorator('solveWay', {
                      initialValue:projectRecord.solveWay
                    })(
                      <Select
                        showSearch
                        placeholder="选择解决方案"
                        filterOption={false}
                        style={{ width: '100%' }}
                      >
                        {solveWayChild}
                      </Select>
                    )}

                  </FormItem>
                </Col>
                <Col xs={24} sm={12}>
                  <FormItem label="受益人数:" {...formItemLayout}>
                    {getFieldDecorator('enjoyNum', {
                      initialValue:projectRecord.enjoyNum
                    })(<Input placeholder="选输入受益人数" size='default' disabled={!isAuthority} style={{ width:"100%"}}/>)}
                  </FormItem>
                </Col>
              </Row>}


       {/*       <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <FormItem label="开始时间:" {...formItemLayout}>
                    {getFieldDecorator('startDate', {
                      rules: [{required: true, message: "请选择开始时间"}]
                    })(<DatePicker size='default' style={{ width:"100%"}} disabled={!isAuthority} showTime
                                   format="YYYY-MM-DD HH:mm:ss"
                                   onChange={function(date,dateString){ dispatch({type: "projectManage/querySuccess", payload: {startDate: dateString}}) }
                                   }/>)}
                  </FormItem>
                </Col>
                <Col xs={24} sm={12}>
                  <FormItem label="要求完成时:" {...formItemLayout}>
                    {getFieldDecorator('expectedEndTime', {
                      rules: [{required: true, message: "请选择要求完成时间"}]
                    })(<DatePicker size='default' style={{ width:"100%"}} disabled={!isAuthority} showTime
                                   format="YYYY-MM-DD HH:mm:ss"
                                   onChange={function(date,dateString){dispatch({type: "projectManage/querySuccess", payload: {expectedEndTime: dateString}})}
                                   }/>)}
                  </FormItem>
                </Col>
              </Row>*/}
             {/* <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <FormItem label="是否逾期:" {...formItemLayout}>
                    {getFieldDecorator('isOverdue', {})(<Select size='default' style={{ width:"100%"}} disabled={true}>
                      <Option key={"YES"}>{"YES"}</Option>
                      <Option key={"NO"}>{"NO"}</Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col xs={24} sm={12}>
                  <FormItem label="实际完成时:" {...formItemLayout}>
                    {getFieldDecorator('actualEndTime', {})(<DatePicker disabled={!isAuthority} size='default'
                                                                        style={{ width:"100%"}} showTime
                                                                        format="YYYY-MM-DD HH:mm:ss"
                                                                        onChange={function(date,dateString){dispatch({type: "projectManage/querySuccess", payload: {actualEndTime: dateString}})}
                                                                        }/>)}
                  </FormItem>
                </Col>

              </Row>*/}
              {/*<Row gutter={24}>
                <Col xs={24} sm={12}>
                  <FormItem label="项目进度:" {...formItemLayout}>
                    {getFieldDecorator('projectProgress', {})(<Select size='default' disabled={!isAuthority}
                                                                      style={{ width:"100%"}} onChange={proChange}>
                      <Option key={"0"}>{"0%"}</Option>
                      <Option key={"10"}>{"10%"}</Option>
                      <Option key={"30"}>{"30%"}</Option>
                      <Option key={"50"}>{"50%"}</Option>
                      <Option key={"70"}>{"70%"}</Option>
                      <Option key={"90"}>{"90%"}</Option>
                      <Option key={"100"}>{"100%"}</Option>
                    </Select>)}
                  </FormItem>
                </Col>

              </Row>*/}
{/*              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <FormItem label="优先级:" labelCol={{span:"4"}} wrapperCol={{ span: 20 }}>
                    {getFieldDecorator('priority', {
                      rules: [{required: true, message: "请选择优先级"}]
                    })(<Radio.Group size='default' disabled={!isAuthority} options={levelOptions}>
                    </Radio.Group>)}
                  </FormItem>
                </Col>
              </Row>*/}
              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <FormItem label="可视人:" labelCol={{span:"4"}} wrapperCol={{ span: 20 }}>
                    {getFieldDecorator('viewPeople', {
                      rules: [{required: true, message: "请选择可视人"}]
                    })(
                      <Select mode="multiple" size='default' disabled={!isAuthority} style={{width: "100%"}}>
                        {viewPeopleAndAllChild}
                      </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <FormItem label="描述:" labelCol={{span:"4"}} wrapperCol={{ span: 20 }}>
                    {getFieldDecorator('remark', {})(<TextArea autosize={{minRows: 3, maxRows: 4}}
                                                               disabled={!isAuthority} style={{width: "100%"}}/>)}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="查看时间线" key="2" style={{paddingTop:'10px'}}>
              <JournalFilter {...JournalFilterProps}/>
              {/*<DailyList {...dailyListProps} style={{marginTop:"10px"}}/>*/}

              <div style={{marginTop:"10px"}}>
                {dailyList.map(function (card, index) {
                  card.index = index
                  return <DailyCard createName={card.createName} content={card.content} updateDate={card.updateDate}
                                    card={card} logContants={card.logContants} name={card.name}
                                    index={index}  {...dailyCardProps}/>
                })}
                <div style={{textAlign:'center'}}><Link onClick={queryMoreDaily}>查看更多</Link></div>
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      {addProjectModalVisible && <AddProjectModal {...addProjectProps}/>}
      <Row gutter={24} style={{clear:"both",width:"100%",height:"300px"}}>
        <Tabs onChange={bottomTabsClick} defaultActiveKey="1" className="content-inner">
          <TabPane tab={
            <div>
              <span>资源列表</span>
              <Button size="default" style={{marginLeft:"15px"}}  onClick={onUpload} >创建资源</Button>
            </div>
          } key="1">
              <ResourcesList {...ResourcesListProps} style={{marginTop:"-10px"}}/>
          </TabPane>
          <TabPane tab={
            <div>
              <span>团队管理</span>
              <Button size="default" style={{marginLeft:"15px"}} onClick={()=>addModelShow(2)} >+</Button>
            </div>
          } key="2">
            <ProjectTeamList {...projectTeamProps} style={{marginTop:"-10px"}}/>
          </TabPane>
          <TabPane tab={
            <div>
              <span>资方管理</span>
            </div>
          } key="3">
            <ProjectPartnerList {...projectPartnerProps} style={{marginTop:"-10px"}}/>
          </TabPane>
          <TabPane tab={
            <div>
              <span>在地组织</span>
              <Button size="default" style={{marginLeft:"15px"}}  onClick={()=>addModelShow(4)}>+</Button>
            </div>
          } key="4">
            <ProjectLocalOrganizationList {...projectLocalOrganizationProps} style={{marginTop:"-10px"}}/>
            {addProjectLocalOrganizationModelShow && <ProjectLocalOrganizationAddList {...projectLocalOrganizationAddProps}/>}
          </TabPane>
          {projectRecord.projectType=='2'&&<TabPane tab={
            <div>
              <span>对接管理</span>
{/*              <Button size="default" style={{marginLeft:"15px"}} onClick={()=>addModelShow(5)}>+</Button>*/}
            </div>
          } key="5">
            <ProjectConnectList {...projectConnectProps} style={{marginTop:"-10px"}}/>

          </TabPane>}

        </Tabs>
        {uploadModelModalVisible && <UploadResouceModal {...UploadModelModalProps}/>}
        {uploadModalVisible && <UploadModal {...UploadModalProps}/>}
        {addProjectTeamModelShow && <ProjectTeamAddList {...projectTeamAddProps}/>}
        {addProjectPartnerModelShow && <ProjectPartnerAddList {...projectPartnerAddProps}/>}
        {addProjectPartnerCostModelShow && <ProjectPartnerAddCost {...projectPartnerAddCostProps}/>}
        {addProjectConnectModelShow && <ProjectConnectAddList {...projectConnectAddProps}/>}
      </Row>
    </div>
  )
}

export default connect(({projectManage,app, loading}) => ({
  projectManage,
  app,
  loading
}))((Form.create())(ProjectManage))
