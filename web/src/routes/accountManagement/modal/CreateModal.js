import React from 'react'
import {Form,Modal,Row,Col,Select,Input,message} from 'antd'
const FormItem = Form.Item
const CreateModal = ({
  dispatch,
  updateValue,
  isPassword,
  recordIndex,
  tableList,
  isDisable,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  function handleCancel() {
    dispatch({
      type: 'accountManagement/hideCreateModalVisit',
      payload: {
        updateValue: {}
      }
    })
  }
  function handleOk() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      //let user = JSON.parse(sessionStorage.getItem("UserStrom"))
      let obj=new Object()
      //obj.id = user.id
      //obj.companyName = user.companyName
      //obj.companyCode = user.companyCode
      obj.userName = value.userNameOne
      obj.password = value.password
      obj.email = value.emailOne
      obj.tel = value.telOne
      obj.roleId = value.roleId
      if(value.password!=value.newPassword){
        message.warning("两次密码输入不一致")
      }else {
        dispatch({
          type: 'accountManagement/insertAccount',
          payload: {
            obj
          }
        })
        dispatch({
          type: 'accountManagement/querySuccess',
          payload: {
            recordIndex: recordIndex,
            tableList:tableList,
          },
        })
      }
    })
  }

  function handleUpdate() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      //let user = JSON.parse(sessionStorage.getItem("UserStrom"))
      let obj=new Object()
      obj.id = updateValue.id
      //obj.companyName = user.companyName
      //obj.companyCode = user.companyCode
      obj.oldEmail = updateValue.email
      obj.oldTel = updateValue.tel
      obj.userName = value.userNameOne
      obj.email = value.emailOne
      obj.tel = value.telOne
      obj.roleId = value.roleId
      if(value.password==undefined){
        obj.password = updateValue.password
      }else {
        obj.password = value.password
      }
      if(value.password!=value.newPassword){
        message.warning("两次密码输入不一致")
      }else{
        dispatch({
          type: 'accountManagement/UpdateAccount',
          payload: {
            obj
          }
        })
      }
    })
  }
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <Modal
      visible
      onCancel={handleCancel}
      okText="保存"
      onOk={JSON.stringify(updateValue) != '{}'?handleUpdate:handleOk}
      title={JSON.stringify(updateValue) != '{}'?"修改用户":"添加用户"}>
      <Row>
        <Col span={24}>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator('emailOne', {
              initialValue: updateValue.email != undefined ? updateValue.email : "",
              rules: [{required: true, message: '请输入邮箱'}],
            })
            (<Input size='default' style={{width: "200px"}} disabled={isDisable}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="手机"
            {...formItemLayout}
          >
            {getFieldDecorator('telOne', {
              initialValue: updateValue.tel != undefined ? updateValue.tel : "",
              rules: [{required: true, message: '请输入手机号码'}],
            })
            (<Input size='default' style={{width: "200px"}} disabled={isDisable}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="姓名"
            {...formItemLayout}
          >
            {getFieldDecorator('userNameOne', {
              initialValue: updateValue.userName != undefined ? updateValue.userName : "",
              rules: [{required: true, message: '请输入姓名'}],
            })
            (<Input size='default' style={{width: "200px"}} disabled={isDisable}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="密码"
            {...formItemLayout}
          >
            {getFieldDecorator('password', {
            })
            (<Input size='default'type="password" style={{width: "200px"}} disabled={isPassword}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="确认密码"
            {...formItemLayout}
          >
            {getFieldDecorator('newPassword', {
            })
            (<Input size='default'type="password" style={{width: "200px"}} disabled={isPassword}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="角色"
            {...formItemLayout}
          >
            {getFieldDecorator('roleId', {
              initialValue: updateValue.roleId != undefined ? updateValue.roleId : "2",
              rules: [{required: true, message: '请选择角色'}],
            })
            (
              <Select size="default" style={{width: "200px"}} disabled={isDisable}>
                <Option key="1">管理员</Option>
                <Option key="2">普通用户</Option>
              </Select>
            )}
          </FormItem>
        </Col>

      </Row>
    </Modal>
  )
}

export default Form.create()(CreateModal)
