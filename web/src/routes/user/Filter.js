import React from 'react'
import {FilterItem} from 'components'
import {Form, Button, Row, Col, Input, Select} from 'antd'
import styles from "../../utils/commonStyle.less"

const FormItem = Form.Item

const Filter = ({
  onAdd,
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const handleReset = () => {
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
    handleSubmit()
  }

  function onKeyDown(e) {
    if (13 == e.keyCode) {
      handleSubmit()
    }
  }

  return (
    <div className={styles.filterDiv} onKeyDown={onKeyDown} tabIndex="1">
      <Row >
        <Col span={6}>
        <FormItem label="UserName" labelCol={{span: "7"}}>
          {getFieldDecorator('userName', {})
          (<Input size='default' maxLength="15" style={{width: 150}}/>)}
        </FormItem>
      </Col>
        <Col span={6}>
          <FormItem label="RealName" labelCol={{span: "7"}}>
            {getFieldDecorator('realName', {})
            (<Input size='default' maxLength="15" style={{width: 150}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div >
            <Button type="primary" className="margin-right" onClick={handleSubmit}>Search</Button>
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={onAdd} style={{marginLeft: "20px"}}>Create</Button>
          </div>
        </div>
      </Row>
    </div>
  )
}

export default Form.create()(Filter)
