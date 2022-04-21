import React from 'react'
import {Form, Button, Row, Col, DatePicker, Input, Select} from 'antd'
import styles from "../../utils/commonStyle.less"
const Option=Select.Option;
const Filter = ({
  dispatch,
  examQuestion,
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
    examQuestion.pagination.currentPage=1;
    dispatch({
      type: 'examQuestion/searchList',
      payload: {
        searchValues:fields,
        ...fields,
        ...examQuestion.pagination,
      }
    })
  };

  const handleReset = () => {
    resetFields();
    handleSubmit()
  };

  function onInsert() {
    dispatch({
      type: 'examQuestion/querySuccess',
      payload: {
        updateModalVisit:true,
        updateType:'insert',
        columnLabel:'',
      }
    })
  }
  let labelOptions=examQuestion.labelList.map((item,index)=>{
    return <Option key={index} value={item.key}>{item.key}</Option>;
  });
  labelOptions.unshift(<Option key={9999} value=''></Option>);

  return (
    <div className={styles.filterDiv}>
      <Row gutter={24} className={styles.marginTop} style={{maxWidth: '1080px'}}>
        <Col span={6}>
          {getFieldDecorator('title', {
            initialValue: ""
          })(
            <Input placeholder="题目名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('label', {
            initialValue: ""
          })(
            <Select placeholder="分类" className="margin-right margin-bottom" style={{width: '100%'}} size='default'>
              {labelOptions}
            </Select>
          )}
        </Col>
        <Col span={6}></Col>
      </Row>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col>
          <Button type="primary" className="margin-right margin-bottom" size="default"
                  onClick={handleSubmit}>搜索</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={handleReset}>重置</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onInsert}>新增</Button>
          <Button size="default" type="dashed" style={{marginLeft: "15px"}}>数据总量:{examQuestion.pagination.total}</Button>
        </Col>
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
