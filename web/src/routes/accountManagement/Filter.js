import React from 'react'
import {FilterItem} from 'components'
import {Row,Col,Button,Form,Input } from 'antd'
import styles from "../../utils/commonStyle.less"
import {Link} from 'dva/router'
const FormItem = Form.Item
const Filter = ({
  dispatch,
  onFilterChange,
  onAdd,
  isCreate,
  onShare,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    },
  }) => {

  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }
  const handleReset = () => {
    resetFields();
    handleSubmit()
  }
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 0},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 4},
    },
  };
  return (
    <div className={styles.filterDiv}>
      <Row gutter={24} style={{maxWidth:'1080px'}} className={styles.marginTop}>
        <Col span={6}>
            {getFieldDecorator('userName', {
              initialValue:""
            })(
              <Input placeholder="姓名" className="margin-right margin-bottom" style={{ width: '100%'}} size='default'/>
            )}
        </Col>
        <Col span={6}>
            {getFieldDecorator('email', {
              initialValue:""
            })(
              <Input placeholder="邮箱" className="margin-right margin-bottom" style={{  width: '100%'}} size='default'/>
            )}
        </Col>
        <Col span={6}>
            {getFieldDecorator('tel', {
              initialValue:""
            })(
              <Input placeholder="手机" className="margin-right margin-bottom" style={{  width: '100%'}} size='default'/>
            )}
        </Col>
        <col span={6}></col>
      </Row>
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col>
          <Button type="primary" className="margin-right margin-bottom" size="default" onClick={handleSubmit}>搜索</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={handleReset} >重置</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onAdd} disabled={isCreate}>创建账户</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onShare} disabled={isCreate}>分享</Button>
        </Col>
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
