import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import 'element-theme-default';
import styles from './index.less'
import {config} from 'utils'
import {Link} from 'dva/router'
import {Layout, Loader} from 'components'
import {Form, Button, Row, Col, Input,message} from 'antd'

const FormItem = Form.Item
const Register = ({
                    register,
                    dispatch,
                    loading,
                    form: {
                      getFieldDecorator,
                      validateFieldsAndScroll,
                    },
                  }) => {
  const {userName,password,newuserPass,email,companyName,tel,isshow,disableds,codeButtText,second} = register
  let seconds = 60
  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      if (values.newuserPass != values.password) {
        message.info("两次输入的密码不一致")
      } else if (values.newuserPass == values.password) {
        dispatch({
          type: 'register/registerToUser',
          payload: {
            userName: values.userName,
            password: values.password,
            email: values.email,
            tel: values.tel,
            companyName: values.companyName,
            code: values.yanzhenma,
          }
        })
        dispatch({
          type: 'register/querySuccess',
          payload: {
            userName: '',
            password: '',
            newuserPass: '',
          }
        })
      }
    })
  }

  let interval;

  function onClickone() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      if (values.newuserPass != values.password) {
        message.warning('两次密码输入不一致')
      }else if (values.newuserPass == values.password) {
        dispatch({
          type: 'register/toSms',
          payload: {
            verifyPhone: values.tel,
          }
        })
        but()
      }
    })
  }

  function but() {
    dispatch({
      type: 'register/querySuccess',
      payload: {
        disableds: true,
        codeButtText: seconds + 's',
      }
    })
    interval = setInterval(() => time(seconds--), 1000)
  }

  function time(i) {
    dispatch({
      type: 'register/querySuccess',
      payload: {
        second: i,
        codeButtText: seconds + 's'
      }
    })
    if (i == 1) {
      dispatch({
        type: 'register/querySuccess',
        payload: {
          disableds: false,
          codeButtText: '发送验证码',
        }
      })
      clearInterval(interval);
      interval=null
    }
  }


  function onClickTo() {
    return (<div>
      <Loader fullScreen spinning={loading.effects[window.location = `/login`]}/>
    </div>)
  }

  return (
    <div>
      <div className={styles.ba}></div>
      <div className={styles.form}>
        <div className={styles.logo}>
          <span>欢迎注册项目管理系统</span>
        </div>
        <form>
          <FormItem >
            {getFieldDecorator('companyName', {
              rules: [{required: true, message: '机构名称不能为空！!'}],
            })(<Input className={styles.w} size="large" placeholder="机构名称" />)}
          </FormItem>
          <FormItem >
            {getFieldDecorator('userName', {
              rules: [{required: true, message: '姓名不能为空！!'}],
            })(<Input className={styles.w} size="large" placeholder="姓名" />)}
          </FormItem>
          <FormItem >
            {getFieldDecorator('tel', {
              rules: [{required: true, message: '手机号码不能为空！!'}],
            })(<Input className={styles.w} size="large" placeholder="手机号码" />)}
          </FormItem>
          <FormItem >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: '请输入正确的邮箱！！',
              }, {
                required: true, message: '邮箱不能为空！！',
              }],
            })(<Input className={styles.w} size="large" placeholder="邮箱" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{required: true, message: '密码不能为空！!'}],
            })(<Input className={styles.w} size="large" type="password" placeholder="密码"/>)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('newuserPass', {
              rules: [{required: true, message: '确认密码！!'}],
            })(<Input className={styles.w} size="large" type="password" placeholder="确认密码"/>)}
          </FormItem>
          <Row >
            <Col md={24} lg={11}>
              <FormItem>
                {getFieldDecorator('yanzhenma', {})(
                  <div>
                    <Input placeholder="验证码" size="large"/>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col md={24} lg={11} className={styles.yanBut}>
              <FormItem>
                {getFieldDecorator('ss', {})(
                  <div>
                    <Button type="primary" size="large" className={styles.yanBut} disabled={disableds}
                            onClick={onClickone}>{codeButtText}</Button>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Button type="primary" size="large" onClick={handleOk} style={{height:"40px"}}>
              注册
            </Button>
          </Row>

          <Row className={styles.tips}>
            <span>已有账号？</span>
            <Link onClick={onClickTo}>快捷登录></Link>
          </Row>
        </form>
      </div>
    </div>
  )
}


Register.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({register, loading}) => ({register, loading}))((Form.create())(Register))
