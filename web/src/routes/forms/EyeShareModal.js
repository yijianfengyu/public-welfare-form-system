import React from 'react'
import {message,Input,Switch,Row,Col,Form,DatePicker,Button } from 'antd';
import moment from 'moment';
const EyeShareModal = ({
  dispatch,
  value,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    resetFields,
    },
  }) => {
  const FormItem = Form.Item
  const formItemLayout = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 10,
      },
    },
  };
  function  handleOk(){
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'forms/createShareUrl',
        payload: {
          payloadValue:{
            userName:JSON.parse(sessionStorage.getItem("UserStrom")).userName,
            userId:JSON.parse(sessionStorage.getItem("UserStrom")).id,
            //srcUrl: value.define,
            defineId:value.id,
            shareTitle:values.shareTitle,
            startTime:values.startTime!=undefined&&values.startTime!=""? values.startTime.format('YYYY-MM-DD HH:mm:ss'):undefined,
            endTime:values.endTime!=undefined&&values.endTime!=""? values.endTime.format('YYYY-MM-DD HH:mm:ss'):undefined,
            isConditions: values.isConditions == true ? 1 : 0,
          },
          value,
        }
      })
      resetFields();
    })
  }
  return (
    <Row style={{marginTop:'20px'}}>
      <Col span={24}>
        <FormItem
          {...formItemLayout}
          label="分享的标题"
        >
          {getFieldDecorator('shareTitle', {
            initialValue: value.formTitle
          })
          (<Input size='default'/>)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem
          {...formItemLayout}
          label="分享开始时间"
        >
          {getFieldDecorator('startTime', {
            initialValue: false,
          })
          (<DatePicker size='default' format="YYYY-MM-DD HH:mm:ss"/>)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem
          {...formItemLayout}
          label="分享结束时间"
        >
          {getFieldDecorator('endTime', {
            initialValue: false,
          })
          (<DatePicker size='default' format="YYYY-MM-DD HH:mm:ss"/>)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem
          {...formItemLayout}
          label="是否显示搜索条件"
        >
          {getFieldDecorator('isConditions', {
            initialValue: false,
          })
          (<Switch size='default' checkedChildren="是" unCheckedChildren="否"/>)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" size='default' onClick={handleOk}>生成</Button>
        </FormItem>
      </Col>
    </Row>
  )
}

export default Form.create()(EyeShareModal)
