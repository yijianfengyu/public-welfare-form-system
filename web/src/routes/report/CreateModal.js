import React from 'react'
import {Form, Modal, Row, Col, Select, Input, InputNumber} from 'antd'

const FormItem = Form.Item
const CreateModal = ({
                       dispatch,
                       report,
                       form: {
                         getFieldDecorator,
                         validateFields,
                       },
                     }) => {


  function handleCancel() {
    dispatch({
      type: 'report/querySuccess',
      payload: {
        createModalVisible: false,
        updateValue:{},
      }
    })
  }


  function handleUpdate() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      console.log(value);
        dispatch({
          type: 'report/updateReport',
          payload: {
            id:report.updateValue.id,
            teamId:report.updateValue.teamId,
            area:value.area,
            supply_population:value.supply_population,
            project:report.updateValue.project,
          }
        })
      handleCancel();
    });
  }

  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  return (
    <Modal
      visible
      onCancel={handleCancel}
      okText="保存"
      onOk={handleUpdate }
      title={ "修改报告信息" }>
      <Row>
        <Col span={24}>
          <FormItem
            {...formItemLayout}
            label="水源地名称"
          >
            {getFieldDecorator('waterSourceName', {
              initialValue: report.updateValue.waterSourceName != undefined ? report.updateValue.waterSourceName : "",
              rules: [{required: true, message: '请输入水源地名称'}],
            })
            (<Input size='default' style={{width: "100%"}} disabled={true}/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="面积(km²)"
            {...formItemLayout}
          >
            {getFieldDecorator('area', {
              initialValue: report.updateValue.area != undefined ? report.updateValue.area : "",
              rules: [{required: true, message: '请输入面积'}],
            })
            (<InputNumber min={1} size='default' style={{width: "100%"}} />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="供应人口(万)"
            {...formItemLayout}
          >
            {getFieldDecorator('supply_population', {
              initialValue: report.updateValue.supply_population != undefined ? report.updateValue.supply_population : "",
              rules: [{required: true, message: '请输入供应人口'}],
            })
            (<InputNumber min={1} size='default' style={{width: "100%"}} />)}
          </FormItem>
        </Col>

      </Row>
    </Modal>
  )
}

export default Form.create()(CreateModal)
