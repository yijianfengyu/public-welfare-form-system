import React from 'react'
import {connect} from 'dva'
import styles from './shareAccount.less'
import {Form,Row,Col,Input,DatePicker,Radio,Select,Button,message} from 'antd'
const FormItem = Form.Item
const ShareAccount = ({
  shareAccount,
  dispatch,
  loading,
  location,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    },
  }) => {
  const {} = shareAccount
 /* const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 7},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 24},

    },

  };*/
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 7},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 17},
    },
  };
  function handleOk() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      let obj = new Object()
      obj.companyCode = location.query.code
      obj.userName = value.userNameOne
      obj.password = value.password
      obj.email = value.emailOne
      obj.tel = value.telOne
      obj.roleId = "2"
      obj.failureCode = location.query.failureCode
      if (value.password != value.newPassword) {
        message.warning("两次密码输入不一致")
      } else {
        dispatch({
          type: 'shareAccount/insertAccount',
          payload: {
            obj
          }
        })
      }
    })
  }

  return (
    <Row type="flex" justify="space-around">
      <Col md={24} lg={7} className={styles.divThreeOne}>
        <span>注册用户</span>
      </Col>
      <Col md={24} lg={7} className={styles.divThree}>
        <Row className={styles.divTwo}>
          <Col span={24}>
            <FormItem
              {...formItemLayout}
              label="邮箱"
            >
              {getFieldDecorator('emailOne', {
                rules: [{required: true, message: '请输入邮箱'}],
              })
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="手机"
              {...formItemLayout}
            >
              {getFieldDecorator('telOne', {
                rules: [{required: true, message: '请输入手机号码'}],
              })
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="姓名"
              {...formItemLayout}
            >
              {getFieldDecorator('userNameOne', {
                rules: [{required: true, message: '请输入姓名'}],
              })
              (<Input size='default' style={{width: "200px"}}/>)}
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
          <Col span={24} >
            <FormItem
              {...formItemLayout}
            >
              <Button onClick={handleOk} type="primary" style={{marginRight:'2vh'}}>提交</Button>
              {/*<Button  onClick={handleCancel} type="default">清空</Button>*/}
            </FormItem>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default connect(({shareAccount,loading}) => ({
  shareAccount,
  loading,
}))((Form.create())(ShareAccount))
