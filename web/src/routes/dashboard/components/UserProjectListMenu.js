import React from 'react'
import {Menu,Button,Radio,Row,Col } from 'antd';
import  styles from '../index.less'
import {Dropdown, Icon, message, Modal} from "antd/lib/index";

const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const UserProjectListMenu = ({
  dispatch, record
  })=> {
  function handleClickWriteDaily() {
    dispatch({
      type: 'dashboard/querySuccess',
      payload: {
        addLogModalVisit: true,
        addLogProjectRecord: record,
        saveDailyMethod: "dashboard/createProjectDaily",
      }
    })
  }

  function handleSetProjCompleted() {
    Modal.confirm({
      title: '确认框',
      content: '确认完成？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (record.status == "Completed") {
          message.success("项目已完成，请刷新")
        } else {
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var hour = date.getHours();
          var minute = date.getMinutes();
          var second = date.getSeconds();
          let dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
          let value = new Object()
          value.projectName = record.projectName
          value.executor = record.executor
          value.creater = record.creater
          value.startDate = record.startDate
          value.expectedEndTime = record.expectedEndTime
          value.isOverdue = record.isOverdue
          value.actualEndTime = dataTime
          value.status = "Completed"
          value.priority = record.priority
          value.viewPeople = record.viewPeople
          value.remark = record.remark
          value.id = record.id
          value.groupId = record.groupId
          value.companyCode = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
          value.projectProgress = 100
          //value.index=index

          dispatch({
            type: 'dashboard/updateProject',
            payload: {
              value
            }
          })
        }

      },
      onCancel() {
        return
      }
    })
  }

  function createSubProj() {
    dispatch({
      type: "dashboard/queryAllActiveStaff",
      payload: {
        //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      }
    })
    dispatch({
      type: 'dashboard/querySuccess',
      payload: {
        addSubprojectModalVisible: true,
        addLogProjectRecord: record,
      }
    })
  }

  function documentation() {
    dispatch({
      type: 'dashboard/queryProjectResources',
      payload: {
        groupId: record.groupId,
        projectId: record.id,
        updateDate: record.updateDate,
      }
    })
  }

  function dailyRecord() {
    dispatch({
      type: 'dashboard/querySuccess',
      payload: {
        isShowDocumentation: false
      }
    })
  }

  return (
    <Row gutter={24}>
      <Col lg={12} md={24}>
        <Button.Group>
          <Button size={'small'} type="dashed" onClick={handleClickWriteDaily}>写日志</Button>
          <Button size={'small'} type="dashed" onClick={handleSetProjCompleted}>已完成</Button>
          <Button size={'small'} type="dashed" onClick={createSubProj}>创建子项目</Button>
        </Button.Group>
      </Col>
      <Col lg={8} md={24}>
        <ButtonGroup  >
          <Button type="dashed" size="small" onClick={documentation} value="相关文档">相关文档</Button>
          <Button type="dashed" size="small" onClick={dailyRecord} value="日志" autoFocus="autofocus">日志</Button>
        </ButtonGroup>
      </Col>
    </Row>
  )
}

export default UserProjectListMenu
