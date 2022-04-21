import React from 'react'
import {Form, Button, Row, Col, DatePicker, Input, Select} from 'antd'
import styles from "../../utils/commonStyle.less"
import ExcelFormModal from './formData/Modal/ExcelFormModal'

const FormItem = Form.Item;
const Filter = ({
  dispatch,
  filterDate,
  onFilterChange,
  excelFormModalVisit, locationId, fileList, location,
  dataObjValue,
  optionItem,
  tablePage,
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
    onFilterChange(fields);
  };

  const ExcelFormModalProps = {
    dispatch,
    excelFormModalVisit,
    locationId,
    fileList,
    location,
    dataObjValue,
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

  function onCreate() {
    dispatch({
      type: 'forms/showcreateModalVisit',
      payload: {

        inputNumberTwo: "Text",
        inputTypeOption: "Text",
        disabledSelect: false,
        TelType: false,
        buttonText: "",
        tableList: [],
      }
    })
  }

  function onExcel() {
    dispatch({
      type: "forms/querySuccess",
      payload: {
        fileList: [],
        excelFormModalVisit: true,
      }
    })

  }

  return (
    <div className={styles.filterDiv}>
      <Row gutter={24} style={{maxWidth: '1080px'}} className={styles.marginTop}>
        <Col span={6}>
          {getFieldDecorator('formTitle', {
            initialValue: ""
          })(
            <Input placeholder="表单名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('creatorName', {
            initialValue: ""
          })(
            <Select placeholder="创建人" className="margin-right margin-bottom" style={{width: '100%'}} size='default'>
              {optionItem}
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
          <Button size="default" className="margin-right margin-bottom" onClick={onCreate}>创建表单</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={onExcel}>上传数据</Button>
          <Button size="default" type="dashed" style={{marginLeft: "15px"}}>数据总量:{tablePage.total}</Button>
        </Col>
        {excelFormModalVisit && <ExcelFormModal {...ExcelFormModalProps}/>}
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
