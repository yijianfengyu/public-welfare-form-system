import React from 'react'
import {FilterItem} from 'components'
import {Row,Col,Button,Form,Input,Select } from 'antd'
import styles from "../../utils/commonStyle.less"
import {Link} from 'dva/router'
const FormItem = Form.Item
const Filter = ({
  dispatch,
  onFilterChange,
  onAdd,
  dataPage,
  optionItem,
  onFile,
  onShare,
  downDataOnClick,
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
    <div className={styles.filterDiv} >
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col span={6}>

            {getFieldDecorator('name', {
              initialValue:""
            })(
              <Input placeholder="姓名" className="margin-right margin-bottom" style={{  width: '100%'}} size='default'/>
            )}

        </Col>
        <Col span={6}>
            {getFieldDecorator('email', {
              initialValue:""
            })(
              <Input  placeholder="邮箱" className="margin-right margin-bottom" style={{   width:'100%'}} size='default'/>)}
        </Col>
        <Col span={6}>
            {getFieldDecorator('tel', {
              initialValue:""
            })(
              <Input  placeholder="手机" className="margin-right margin-bottom" style={{  width:'100%'}} size='default'/>
            )}
        </Col>
        <Col span={6}>

            {getFieldDecorator('organizationNames', {
              initialValue:""
            })(
              <Input  placeholder="机构名称" className="margin-right margin-bottom" style={{  width:'100%'}} size='default'/>
            )}

        </Col>
      </Row>
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col span={6}>
            {getFieldDecorator('unitPosition', {
              initialValue:""
            })(
              <Input placeholder="单位职务" className="margin-right margin-bottom" style={{  width:'100%'}} size='default'/>
            )}

        </Col>
        <Col span={6}>
            {getFieldDecorator('principal', {
              initialValue:""
            })(
              <Select placeholder="负责人" className="margin-right margin-bottom" size="default" style={{ width:'100%'}}>
                {optionItem}
              </Select>
            )}

        </Col>
      </Row>
      <Row style={{maxWidth:'1080px'}}>
        <Col>
          <Button type="primary" className="margin-right margin-bottom" size="default" onClick={handleSubmit}>搜索</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={handleReset}>重置</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onAdd}>创建联系人</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={downDataOnClick} >
            下载当前数据
          </Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onFile}>导入联系人</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onShare}>分享</Button>
          <Button size="default"  type="dashed" className="margin-right margin-bottom">数据总量:{dataPage.total}</Button>
        </Col>
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
