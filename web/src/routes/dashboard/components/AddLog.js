import React from 'react'
import {Modal, Button,Form,Row,Col,message,Input} from 'antd';

const FormItem = Form.Item;
const {TextArea} = Input;
const AddLog = ({
  ...modalProps,dispatch,
  addLogProjectRecord,
  userProjExpandedRowKey,
  dailyValue,
  saveDailyMethod,
  updateDailyMethod,
  form: {
    validateFieldsAndScroll,
    getFieldDecorator,
    },
  })=> {
  function handleCancel() {
    dispatch({
      type: 'dashboard/querySuccess',
      payload: {
        addLogModalVisit: false,
        addLogProjectRecord: {},
        dailyValue: {},
      }
    })
  }

  function handleUpdate() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      let dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
      var str = values.content.replace(/\n/g, "<br>");
      var content="<p>"+str+"</p>";
      dispatch({
        type: updateDailyMethod,
        payload: {
          content: content,
          id: dailyValue.id,
          dialyiIndex: dailyValue.dialyiIndex,
          dailyValue:dailyValue,
          createDate: dataTime,
        }
      })
    })
  }

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      let dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
      var str = values.content.replace(/\n/g, "<br>");
      var content="<p>"+str+"</p>";
      dispatch({
        //type:"dashboard/createProjectDaily",
        type:saveDailyMethod,
        payload:{
          content:content,
          createName:JSON.parse(sessionStorage.getItem("UserStrom")).userName,
          projectId:addLogProjectRecord.id,
          groupId:addLogProjectRecord.groupId,
          userProjExpandedRowKey:userProjExpandedRowKey,
          createDate:dataTime,
          userName:JSON.parse(sessionStorage.getItem("UserStrom")).userName,
          projectName:addLogProjectRecord.projectName,
          id: addLogProjectRecord.id,
        }
      })
    })
  }

  return (
    <Modal
      title={JSON.stringify(dailyValue) == '{}'?"添加日志":"修改日志"}
      onCancel={handleCancel}
      onOk={JSON.stringify(dailyValue) == '{}'?handleOk:handleUpdate}
      {...modalProps}
      visible
      width="550px"
      style={{ bottom: 20 }}
    >
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col span={24}>
          <FormItem label="内容" span={4}>
            {getFieldDecorator('content', {
              initialValue:JSON.stringify(dailyValue) == '{}'?"":dailyValue.content.replace(/<.p?>/ig,"").replace(/<.*?>/ig, "\n"),
              rules: [{required: true, message: '请输入内容'}],
            })(
              <TextArea autosize={{minRows: 4, maxRows: 6}} size="default" style={{width:'100%'}}/>
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(AddLog)
