import React from 'react'
import { Table, Form, Icon, Tooltip, Modal, Row, Col, Input, Button } from 'antd'
import { request, config } from 'utils'

const { api } = config


const ProjectPartnerCostAdd = ({ dispatch,projectPartner,...modelProps,
  form: {
    getFieldsValue,
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldValue
  } }) => {
  const FormItem = Form.Item;
  function handleCancel () {
    dispatch({
      type: 'projectManage/querySuccess', payload: {
        addProjectPartnerCostModelShow: false,
      },
    })
  }

  function onConfirm(){
    let cost=getFieldValue('partnerCost');
    projectPartner.partner_cost=cost;
    dispatch({
      type: 'projectManage/updateProjectPartnerCost', payload: {
        projectPartner,
        addProjectPartnerCostModelShow: false,
      },
    })
  }
  return (
    <Modal
      {...modelProps}
      onOk={onConfirm}
      onCancel={handleCancel}
      title={'新增或者修改资助金额'}
      okText="保存"
    >
      <Row>
        <Col span={12} style={{marginBottom:12}}>
          <FormItem>
            {
              getFieldDecorator('partnerCost',{
                initialValue:projectPartner.partner_cost?projectPartner.partner_cost:'',
              })(
                <Input size='default' style={{width: "250px"}} placeholder='请输入资助金额'/>
              )
            }
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}
export default Form.create()(ProjectPartnerCostAdd)
