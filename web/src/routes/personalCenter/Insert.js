import React from 'react'
import {Form,Row,Col,Select,Input,message,Button} from 'antd'
const FormItem = Form.Item
const PersonalCenter = ({
  dispatch,
  personalCenter,
  tableList,
  user,
  nickName,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  function handleUpdate() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      if (tableList.length > 0) {
        let user = JSON.parse(sessionStorage.getItem("UserStrom"))
        value.id = tableList[0].id
        value.companyName = user.companyName
        value.companyCode = user.companyCode
        value.oldEmail = tableList[0].email
        value.oldTel = tableList[0].tel
        value.roleId = tableList[0].roleId

        if (value.password != value.newPassword) {
          message.warning("两次密码输入不一致")
        } else {
          if (value.password == undefined) {
            value.password = tableList[0].password
          } else {
            value.password = value.password
          }
          dispatch({
            type: 'personalCenter/UpdateAccount',
            payload: {
              value
            }
          })
          dispatch({
            type: 'personalCenter/querySuccess',
            payload: {
              userName: value.userName
            }
          })
        }
      }

    })
  }

  function bindWx(){
    var appid = "wxdc602bb0db97e4df"; //微信appid
    var redirect_uri = window.location.href;
    var scope = "snsapi_login";
    window.location.href="https://open.weixin.qq.com/connect/qrconnect?appid="+appid+"&redirect_uri="+encodeURI(redirect_uri)+"&response_type=code&scope="+scope+"&state=STATE#wechat_redirect"
  }

  const formItemLayout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
  };
  const formItemOne = {
    wrapperCol: {
      xs: {span: 24, offset: 0},
      sm: {span: 24, offset: 3},
    },
  }
  return (
    <div>
      <Row>
        <Col span={24}>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator('email', {
              initialValue: tableList.length > 0 ? tableList[0].email : "",
              rules: [{required: true, message: '请输入邮箱'}],
            })
            (<Input size='default' style={{width: "200px"}} disabled={tableList.length > 0&&tableList[0].roleName=="普通用户"?true:(user.companyCreator=="NO"&&user.roleName=="管理员"?true:false)}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="手机"
            {...formItemLayout}
          >
            {getFieldDecorator('tel', {
              initialValue: tableList.length > 0 ? tableList[0].tel : "",
              rules: [{required: true, message: '请输入手机号码'}],
            })
            (<Input size='default' style={{width: "200px"}} disabled={tableList.length > 0&&tableList[0].roleName=="普通用户"?true:(user.companyCreator=="NO"&&user.roleName=="管理员"?true:false)}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="姓名"
            {...formItemLayout}
          >
            {getFieldDecorator('userName', {
              initialValue: tableList.length > 0 ? tableList[0].userName : "",
              rules: [{required: true, message: '请输入姓名'}],
            })
            (<Input size='default' style={{width: "200px"}} disabled={tableList.length > 0&&tableList[0].roleName=="普通用户"?true:(user.companyCreator=="NO"&&user.roleName=="管理员"?true:false)}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="密码"
            {...formItemLayout}
          >
            {getFieldDecorator('password', {})
            (<Input size='default' type="password" style={{width: "200px"}}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="确认密码"
            {...formItemLayout}
          >
            {getFieldDecorator('newPassword', {})
            (<Input size='default' type="password" style={{width: "200px"}}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="微信"
            {...formItemLayout}
          >
            {getFieldDecorator('nickName', {})
            (<label style={{width: "200px"}}>{nickName}</label>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formItemOne}>
          <Button type="" disabled={nickName==null||nickName==""?false:true} onClick={bindWx}>绑定微信</Button>
          </FormItem>
        </Col>
        {tableList.length > 0&&tableList[0].roleName=="普通用户"?<Col span={24}>
          <FormItem {...formItemOne}>
          <span style={{color:'red'}}>
            请联系管理员修改姓名，邮箱，手机号
          </span>
          </FormItem>
        </Col>:(user.companyCreator=="NO"&&user.roleName=="管理员"?<Col span={24}>
          <FormItem {...formItemOne}>
          <span style={{color:'red'}}>
            请联系超级管理员修改姓名，邮箱，手机号
          </span>
          </FormItem>
        </Col>:<div></div>)
        }

        <Col span={24}>
          <FormItem {...formItemOne}>
            <Button type="primary" onClick={handleUpdate}>提交</Button>
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}

export default (Form.create()(PersonalCenter))

