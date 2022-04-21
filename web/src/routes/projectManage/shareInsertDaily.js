import React from 'react'
import {connect} from 'dva'
import styles from './shareInsertDaily.less'
import {Form, Tabs,Spin,Table,Row,Col,Input,Button} from 'antd'
const ShareInsertDaily = ({
  location, dispatch,shareInsertDaily,
  form: {getFieldDecorator,validateFields,getFieldsValue,setFieldsValue }
  }) => {

  const FormItem = Form.Item
  const {TextArea} = Input;
  const {insertDaily,updateDailyValue} = shareInsertDaily;
  //定时器（设置五分钟自动保存）
  setInterval(handleOk,300000);
  function handleOk() {
    validateFields((error, value) => {
      if (error) {
        return;
      }
      var str = value.content.replace(/\n/g, "<br>");
      var content = "<p>" + str + "</p>";
      if(location.query.dailyId!=undefined){
        dispatch({
          type: "shareInsertDaily/updateProjectDaily",
          payload: {
            content: content,
            id:location.query.dailyId instanceof Array==true?location.query.dailyId[location.query.dailyId.length-1]:location.query.dailyId,
            insertDaily: true,
            value: content,
          }
        })
      }else {
        dispatch({
          type: "shareInsertDaily/createProjectDaily",
          payload: {
            content: content,
            projectId: location.query.projectId,
            groupId: location.query.groupId,
            companyCode: location.query.companyCode,
            insertDaily: true,
            value: content,
          }
        })
      }
    })
    //撤销定时器
    window.clearInterval(1);
  }
  function handleUpdate() {
    validateFields((error, value) => {
      if (error) {
        return;
      }
      var str = value.content.replace(/\n/g, "<br>");
      var content = "<p>" + str + "</p>";
      if(location.query.dailyId!=undefined){
        dispatch({
          type: "shareInsertDaily/updateProjectDaily",
          payload: {
            content: content,
            id:location.query.dailyId instanceof Array==true?location.query.dailyId[location.query.dailyId.length-1]:location.query.dailyId,
            insertDaily:false,
          }
        })
      }else{
        dispatch({
          type: "shareInsertDaily/createProjectDaily",
          payload: {
            content: content,
            projectId: location.query.projectId,
            groupId: location.query.groupId,
            companyCode: location.query.companyCode,
            insertDaily:false,
          }
        })
      }
    })
  }

  let contact;
  let str;
  if(location.query.updateDailyValue==undefined){
    contact=""
  }else{
    if(location.query.updateDailyValue instanceof Array==true){
      str=location.query.updateDailyValue[location.query.dailyId.length-1];
    }else{
      str=location.query.updateDailyValue;
    }
    let strContact=str.replace(/<.p?>/ig,"");
    contact=strContact.replace(/<.*?>/ig, "\n");
  }
  return (
    <div className={styles.form}>
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <div><h4>{location.query.projectName}——添加时间线</h4></div>
      </Row>
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col span={24}>
          <FormItem label="内容" span={4}>
            {getFieldDecorator('content', {
              initialValue:contact,
              rules: [{required: true, message: '请输入内容'}],
            })(
              <TextArea autosize={{minRows: 8, maxRows: 10}} size="default" style={{width:'100%'}}/>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem>
            <Button onClick={handleUpdate} type="primary">提交</Button>
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}


export default connect(({shareInsertDaily, loading}) => ({
  shareInsertDaily,
  loading
}))((Form.create())(ShareInsertDaily))
