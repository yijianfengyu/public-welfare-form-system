import React from 'react'
import {Form, Button, Row, Col, DatePicker, Input, Select} from 'antd'
import styles from "../../utils/commonStyle.less"
const Option=Select.Option;
const Filter = ({
  dispatch,
  account,
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
    account.pagination.currentPage=1;
    dispatch({
      type: 'account/searchList',
      payload: {
        searchValues:fields,
        ...fields,
        ...account.pagination,
      }
    })
  };

  const handleReset = () => {
    resetFields();
    handleSubmit()
  };

  function onInsert() {
    dispatch({
      type: 'account/querySuccess',
      payload: {
        updateModalVisible:true,
        updateType:'insert',
        updateIndex: -1,//更新的索引位置
        regionRecord: {},//更新的索引位置
      }
    })
  }


  return (
    <div className={styles.filterDiv}>
      <Row gutter={24} style={{maxWidth: '1080px'}} className={styles.marginTop}>
        <Col span={6}>
          {getFieldDecorator('name', {
            initialValue: ""
          })(
            <Input placeholder="账户名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('phone', {
            initialValue: ""
          })(
            <Input placeholder="手机号码" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('teamName', {
            initialValue: ""
          })(
            <Input placeholder="团队名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}></Col>
      </Row>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col>
          <Button type="primary" className="margin-right margin-bottom" size="default"
                  onClick={handleSubmit}>搜索</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={handleReset}>重置</Button>
          <Button size="default" type="dashed" style={{marginLeft: "15px"}}>数据总量:{account.pagination.total}</Button>
        </Col>
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
