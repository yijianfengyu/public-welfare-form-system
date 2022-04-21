import React from 'react'
import {connect} from 'dva'
import {Button, Modal, Row, Form, Input} from 'antd'
import {config} from 'utils'
import styles from './index.less'
import RegisterModal from './RegisterModal.js'
import SelectUserModal from './SelectUserModal.js'
import { Link } from 'dva/router'
import Logo from '../../components/Form/Logo'

const FormItem = Form.Item

const Login = ({
  login,app,
  dispatch,

  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    },
  }) => {
  const {loginLoading,loginStatus,values,registerModalVisible,companyList,roleList,fileList,selectUserModalVisible,userOption} = login

  function handleOk() {
    dispatch({
      type: 'app/querySuccess', payload: {
        headerVisible: true,
        menuVisible: true,
      }
    })
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      ////使用邮箱登录
      //if(values.tel.toString().indexOf("@")>=0){
      //  sessionStorage.setItem("email",values.tel)
      //  dispatch({type: 'login/loginByEmail', payload: values})
      //}else{
      dispatch({type: 'login/login', payload: values})
      //}

      dispatch({
        type: 'login/hideLoginLoading', payload: {
          values
        }
      })
    })
  }

  function register() {
    dispatch({
      type: 'login/goToRegister'
    })
  }

  if (loginStatus == true) {
    Modal.confirm({
      title: '确认框',
      content: '当前账号已登陆，您是否要在此处登陆，已登陆的地方会强制下线',
      onOk() {
        dispatch({
          type: "login/mandatoryLogin", payload: {
            values
          }
        })
        dispatch({
          type: "login/hideLoginLoading", payload: {
            loginStatus: false
          }
        })
      },
      onCancel() {
        dispatch({
          type: "login/hideLoginLoading", payload: {
            loginStatus: false
          }
        })
      },
    });
  }

  const registerProps = {
    dispatch, registerModalVisible, companyList, roleList, fileList,
    wrapClassName: 'vertical-center-modal',
  }
  const selectUserModalProps = {
    dispatch,
    maskClosable: false,
    visible: selectUserModalVisible,
    title:"选择账号",
    width:"330px",
    userOption,
  }
  return (
    <div>
      <div className={styles.container}>
      </div>
      <div className={styles.form}>
        <div className={styles.logo}>
          <Logo />
          <span>公益数据</span>
        </div>
        <Form>
          <FormItem >
            {getFieldDecorator('tel', {
              rules: [{required: true, message: '请输入手机号码/邮箱'}],
            })(<Input size="large" onPressEnter={handleOk} placeholder="手机号码/邮箱"/>)}
          </FormItem>
          <FormItem >
            {getFieldDecorator('password', {
              rules: [{required: true, message: '请输入密码'}],
            })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码"/>)}
          </FormItem>
          <Row>
            <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
              登录
            </Button>
          </Row>
          <ul className={styles.re}>
            <li>
              <div>
                <Link onClick={register}>免费注册企业账号</Link>
              </div>
            </li>
          </ul>
        </Form>
      </div>
      {registerModalVisible && <RegisterModal {...registerProps}/>}
      {selectUserModalVisible && <SelectUserModal {...selectUserModalProps}/>}
    </div>
  )
}

export default connect(({login,app,user}) => ({login, app, user}))(Form.create()(Login))
