import React from 'react'
import {FilterItem} from 'components'
import moment from 'moment'
import {Form, Button, Row, Col, Input,DatePicker} from 'antd'
import {warning} from '../../utils/common'
import styles from "../../utils/commonStyle.less"

const JournalFilter = ({
  onFilterChange,
  projectRecord,dispatch,dateString,today,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const FormItem = Form.Item;

  const handleSubmit = () => {
    let fields = getFieldsValue()

    onFilterChange(fields)
  }


  function onKeyDown(e) {
    if (13 == e.keyCode) {
      handleSubmit()
    }
  }

  return (
    <div className={styles.filterDiv} onKeyDown={onKeyDown} tabIndex="1">
      <Row>
        <Col span={12}>
          <FormItem label="项目名称" labelCol={{span: "8"}}>
            {getFieldDecorator('projectName', {
              initialValue:projectRecord.projectName
            })(<Input size="default" maxLength="30" readOnly={true} style={{width: "150px"}}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="修改时间" labelCol={{span: "8"}}>
            {getFieldDecorator('updateDate', {
              initialValue:moment(today)
            })(<DatePicker size="default" style={{width: "150px"}} onChange={function (date, dateString) {
              dispatch({type: "projectManage/querySuccess", payload: {dateString: dateString}})
              if(projectRecord.parentId == 0){
                dispatch({type:"projectManage/queryProjectDaily",payload:{
                  groupId:projectRecord.groupId,
                  updateDate:dateString
                }})
              }else{
                dispatch({type:"projectManage/queryProjectDaily",payload:{
                  projectId:projectRecord.id,
                  updateDate:dateString
                }})
              }
            }}/>)}
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}

export default Form.create()(JournalFilter)
