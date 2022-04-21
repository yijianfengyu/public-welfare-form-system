import React from 'react'
import {Form, Button, Row, Col, DatePicker, Input, Select} from 'antd'
import styles from "../../utils/commonStyle.less"
// import ExcelFormModal from './formData/Modal/ExcelFormModal'

const FormItem = Form.Item;
const Filter = ({
  dispatch,
                  report,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    },
  }) => {
  const handleSubmit = () => {
    let fields = getFieldsValue();
    if (fields.dateCreated != "" && fields.dateCreated != undefined) {
      let moment = fields.dateCreated;
      fields.dateCreated = moment.format('YYYY-MM-DD');
    }
    console.log(fields)
    dispatch({
      type: "report/querySuccess",
      payload: {
        vFilter:fields,
        listLoading:true,
        proportionLoading:true,
      }
    });
    dispatch({
      type: "report/getReportInfoList",
      payload: {
        value:fields,
      }
    });
    dispatch({
      type: "report/proportion",
      payload: {
        value:fields,
      }
    });
  };

  const handleReset = () => {
    resetFields();
    handleSubmit()
  };
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


  function onExcelProportion() {
    let fields = getFieldsValue();
    dispatch({
      type: "report/querySuccess",
      payload: {
        proportionLoading:true,
      }
    });
    dispatch({
      type: "report/downloadProportion",
      payload: {
        value:fields,
      }
    })
  }



  function onExcel() {
    let fields = getFieldsValue();
    dispatch({
      type: "report/querySuccess",
      payload: {
        listLoading:true,
      }
    });
    dispatch({
      type: "report/download",
      payload: {
        value:fields,
      }
    })
  }

  return (
    <div className={styles.filterDiv}>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col span={6}>
          {getFieldDecorator('title', {
            initialValue: ""
          })(
            <Input placeholder="水源地名称或地址" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('name', {
            initialValue: ""
          })(
            <Input placeholder="团队名称或用户名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('type', {
            initialValue: ""
          })(
            <Select placeholder="报告类型" className="margin-right margin-bottom" style={{width: '100%'}} size='default'>
              <Select.Option value={1}>个人报告</Select.Option>
              <Select.Option value={2}>团队报告</Select.Option>
            </Select>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('dateCreated', {
            initialValue: ""
          })(<DatePicker placeholder="提交时间" className="margin-right margin-bottom"
                         style={{width: '100%'}} size='default'/>)}
        </Col>
        <Col span={6}></Col>
      </Row>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col>
          <Button type="primary" className="margin-right margin-bottom" size="default"
                  onClick={handleSubmit}>搜索</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={handleReset}>重置</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onExcel}>下载报告详细数据</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onExcelProportion}>下载题目比例数据</Button>
        </Col>
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
