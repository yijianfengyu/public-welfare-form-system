import React from 'react'
import {connect} from 'dva'
import styles from './shareContact.less'
import {Form,Row,Col,Input,DatePicker,Radio,Select,Button  } from 'antd'
const FormItem = Form.Item
const Option = Select.Option;
const RadioGroup = Radio.Group;
import moment from 'moment';
const { TextArea } = Input;
const ShareContact = ({
  shareContact,
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
  const {selectList} = shareContact
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

  function handleCancel() {
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

  function handleOk() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      for(var i in value){
        if (value[i] instanceof moment == true) {
          value[i] = value[i].format('YYYY-MM-DD HH:mm:ss');
        }
      }
      value.companyCode = location.query.code
      dispatch({
        type: 'shareContact/insertContact',
        payload: {
          value
        }
      })
    })
  }

  return (
    <Row type="flex" justify="space-around">
      <Col md={24} lg={7} className={styles.divThreeOne}>
        <span>填写联系人</span>
      </Col>
      <Col md={24} lg={7} className={styles.divThree}>
        <div className={styles.divOne}>
          <span>基本信息</span>
        </div>
        <Row className={styles.divTwo}>
          <Col md={24} lg={12}>
            <FormItem
              label="姓名"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                rules: [{required: true, message: '请输入姓名'}],
              })
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="邮箱"
              {...formItemLayout}
            >
              {getFieldDecorator('email', {
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
              {getFieldDecorator('tel', {
                rules: [{required: true, message: '请输入手机号码'}],
              })
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="出生日期"
              {...formItemLayout}
            >
              {getFieldDecorator('birthdate', {})
              (<DatePicker showTime format="YYYY-MM-DD" size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="性别"
              {...formItemLayout}
            >
              {getFieldDecorator('sex', {})
              (
                <RadioGroup>
                  <Radio value="男">男</Radio>
                  <Radio value="女">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="身份证"
              {...formItemLayout}
            >
              {getFieldDecorator('identityCard', {})
              (
                <Input size='default' style={{width: "200px"}}/>
              )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="编号"
              {...formItemLayout}
            >
              {getFieldDecorator('serialNumber', {})
              (
                <Input size='default' style={{width: "200px"}}/>
              )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="加入时间"
              {...formItemLayout}
            >
              {getFieldDecorator('addTime', {})(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" size='default' style={{width: "200px"}}/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="地区"
              {...formItemLayout}
            >
              {getFieldDecorator('area', {})(
                <Input size='default' style={{width: "200px"}}/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="最新活跃时间"
              {...formItemLayout}
            >
              {getFieldDecorator('lastActiveDate', {})(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" size='default' style={{width: "200px"}}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Col>
      <Col md={24} lg={7} className={styles.divThree}>
        <div className={styles.divOne}>
          <span>其他/扩展信息</span>
        </div>
        <Row className={styles.divTwo}>
          <Col span={24}>
            <FormItem
              label="备用手机"
              {...formItemLayout}
            >
              {getFieldDecorator('secondPhone', {})
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="备用邮箱"
              {...formItemLayout}
            >
              {getFieldDecorator('secondaryEmail', {})
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="QQ"
              {...formItemLayout}
            >
              {getFieldDecorator('qq', {})
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="微信"
              {...formItemLayout}
            >
              {getFieldDecorator('wechat', {})
              (
                <Input size='default' style={{width: "200px"}}/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="描述"
              {...formItemLayout}
            >
              {getFieldDecorator('description', {})
              (
                <TextArea rows={4} size='default' style={{width: "200px"}}/>
              )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="负责人"
              {...formItemLayout}
            >
              {getFieldDecorator('principal', {})
              (
                <Select size="default" style={{width: "200px"}}>
                  {selectList.map(function (item) {
                    return <Option key={item.id}>{item.userName}</Option>
                  })}
                </Select>
              )
              }
            </FormItem>
          </Col>
        </Row>
      </Col>
      <Col md={24} lg={7} className={styles.divThree}>
        <div className={styles.divOne}>
          <span>机构信息</span>
        </div>
        <Row className={styles.divTwo}>
          <Col span={24}>
            <FormItem
              label="机构名称"
              {...formItemLayout}
            >
              {getFieldDecorator('organizationNames', {})
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="地址"
              {...formItemLayout}
            >
              {getFieldDecorator('address', {})
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="邮编"
              {...formItemLayout}
            >
              {getFieldDecorator('postcode', {})
              (<Input size='default' style={{width: "200px"}}/>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="单位职务"
              {...formItemLayout}
            >
              {getFieldDecorator('unitPosition', {})
              (
                <Input size='default' style={{width: "200px"}}/>
              )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="所在部门"
              {...formItemLayout}
            >
              {getFieldDecorator('department', {})
              (
                <Input size='default' style={{width: "200px"}}/>
              )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="单位电话"
              {...formItemLayout}
            >
              {getFieldDecorator('workTelephone', {})
              (
                <Input size='default' style={{width: "200px"}}/>
              )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="传真"
              {...formItemLayout}
            >
              {getFieldDecorator('fax', {})
              (
                <Input size='default' style={{width: "200px"}}/>
              )
              }
            </FormItem>
          </Col>
        </Row>
      </Col>
      <FormItem
        {...formItemLayout}
      >
        <Button onClick={handleOk} type="primary" style={{marginRight:'2vh'}}>提交</Button>
        {/*<Button  onClick={handleCancel} type="default">清空</Button>*/}
      </FormItem>
    </Row>
  )
}
export default connect(({shareContact,loading}) => ({
  shareContact,
  loading,
}))((Form.create())(ShareContact))
