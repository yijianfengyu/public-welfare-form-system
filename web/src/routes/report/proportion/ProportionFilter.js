import React from 'react'
import {Form, Button, Row, Col, DatePicker, Input, Select} from 'antd'
import styles from "../../../utils/commonStyle.less"

const FormItem = Form.Item;
const ProportionFilter = ({
  dispatch,
                  report,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    },
  }) => {

  function onExcel() {
    dispatch({
      type: "report/querySuccess",
      payload: {
        proportionLoading:true,
      }
    });
    dispatch({
      type: "report/download",
      payload: {
      }
    })

  }

  return (
    <div className={styles.filterDiv}>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col span={6}>
          <Button size="default" className="margin-right margin-bottom" onClick={onExcel}>下载数据</Button>
        </Col>
      </Row>
    </div>
  )
}


export default Form.create()(ProportionFilter)
