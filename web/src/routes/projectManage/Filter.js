import React from 'react'
import {FilterItem} from 'components'
import {Form, Button, Row, Col, DatePicker, Input, Select, Modal, Icon} from 'antd'
import {warning} from '../../utils/common'
import styles from "../../utils/commonStyle.less"
const Filter = ({
  onFilterChange,
  newProject,
  onUpload,
  copyProject,
  isBoss,
  dispatch,
  optionItem,
  rightStatus,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
  },
  viewPeopleChild,
}) => {
  const FormItem = Form.Item;

  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const handleReset = () => {
    resetFields();
    handleSubmit();
  }

  function onKeyDown(e) {
    if (13 == e.keyCode) {
      handleSubmit()
    }
  }
//const props={
//  dispatch,
//  companyCode:JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
//  optionItem
//}
  return (
    <div className={styles.filterDiv} onKeyDown={onKeyDown} tabIndex="1">
      {rightStatus ?<Row gutter={24} className={styles.marginTop}>
        <Col span={8}>

            {getFieldDecorator('projectName', {
              initialValue:""
            })(<Input className="margin-right margin-bottom"  placeholder="项目名称" size="default" maxLength="30" style={{width: "100%"}}/>)}

        </Col>
        <Col span={8}>

            {getFieldDecorator('groupId', {
              initialValue:""
            })(<Input className="margin-right margin-bottom" placeholder="项目编号" size="default" maxLength="30" style={{width: "100%"}}/>)}

        </Col>
        <Col span={8}>

            {getFieldDecorator('executor', {
              initialValue:""
            })(<Select className="margin-right margin-bottom"  placeholder="负责人"  showSearch size='default'  style={{width: "100%"}}>
              {viewPeopleChild}
            </Select>)}

        </Col>
      </Row>:<Row className={styles.marginTop}>
        <Col span={6}>
          <FormItem label="名称" labelCol={{span: "6"}}>
            {getFieldDecorator('projectName', {
              initialValue:""
            })(<Input size="default" maxLength="30" style={{width: "150px"}}/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="编号" labelCol={{span: "6"}}>
            {getFieldDecorator('groupId', {
              initialValue:""
            })(<Input size="default" maxLength="30" style={{width: "150px"}}/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="负责人" labelCol={{span: "6"}}>
            {getFieldDecorator('executor', {
              initialValue:""
            })(<Select  showSearch size='default'  style={{width: "150px"}}>
              {viewPeopleChild}
            </Select>)}
          </FormItem>
        </Col>
      </Row>}
      <Row className={styles.marginTop}>
        <Button type="primary" size="default"  className={[styles.marginRight,styles.marginBottom]}  onClick={handleSubmit}>搜索</Button>
        <Button size="default"  className={[styles.marginRight,styles.marginBottom]}  onClick={handleReset}>重置</Button>
        <Button size="default"  className={[styles.marginRight,styles.marginBottom]}  disabled={!isBoss} onClick={newProject}>新建项目</Button>
        <Button size="default"  className={[styles.marginRight,styles.marginBottom]}  disabled={!isBoss} onClick={copyProject}>复制项目</Button>
        {/*<Button size="default" className="margin-right" onClick={onUpload}>创建资源</Button>*/}
      </Row>
    </div>
  )
}

export default Form.create()(Filter)
