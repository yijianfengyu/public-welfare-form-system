import React from 'react'
import {Form, Button, Row, Col, DatePicker, Input, Select} from 'antd'
import styles from "../../utils/commonStyle.less"
const Option=Select.Option;
const Filter = ({
  dispatch,
  resource,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    },
  }) => {
  console.log("--filter--");
  const handleSubmit = () => {
    let fields = getFieldsValue();
    resource.pagination.currentPage=1;
    dispatch({
      type: 'resource/searchList',
      payload: {
        searchValues:fields,
        ...fields,
        ...resource.pagination,
      }
    })
  };

  const handleReset = () => {
    resetFields();
    handleSubmit()
  };

  function onInsert() {
    dispatch({
      type: 'resource/popResourceModal',
      payload: {
        updateModalVisible:true,
        updateType:'insert',
      }
    })
  }


  return (
    <div className={styles.filterDiv}>
      <Row gutter={24} style={{maxWidth: '1080px'}} className={styles.marginTop}>
        <Col span={6}>
          {getFieldDecorator('resourcesName', {
            initialValue: ""
          })(
            <Input placeholder="资源名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
        </Col>
        <Col span={6}></Col>
      </Row>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col>
          <Button type="primary" className="margin-right margin-bottom" size="default"
                  onClick={handleSubmit}>搜索</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={handleReset}>重置</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onInsert}>新增</Button>
          <Button size="default" type="dashed" style={{marginLeft: "15px"}}>数据总量:{resource.pagination.total}</Button>
        </Col>
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
