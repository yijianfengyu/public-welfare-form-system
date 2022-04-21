import React from 'react'
import { Row, Col, Form, Input, Modal, Select } from 'antd'

const UpdateModal = ({
  dispatch,region,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
  },
}) => {
  console.log("----updateModal-----",region);
  const {regionRecord,updateType}=region;
  const updateModalProps = {
    visible: region.updateModalVisible,
    width: '600px',
    maskClosable: false,
  }
  const FormItem = Form.Item
  if(updateType!='insert'){
    //更新，添加一个oldId默认值
    getFieldDecorator('oldId', { initialValue: regionRecord.id });
  }
/*  if(updateType=='insert'&&regionRecord&&parseInt(regionRecord.pid)>0){
    getFieldDecorator('pid', { initialValue: regionRecord.pid });
  }*/
  function handleOk() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      let fields = getFieldsValue();
      dispatch({
        type:"region/updateRegion",payload:{
          updateType:region.updateType,
          ...fields,
        }
      })
    });
  }
  function handleCancel () {
    dispatch({
      type: 'region/querySuccess',
      payload: {
        updateModalVisible: false,
        updateType: '',
      },
    })

  }
  const formItemLayoutOne = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }
  return (
    <Modal
      {...updateModalProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title={regionRecord&&regionRecord.id?'更新:'+regionRecord.name:'新增地址'}
      okText="保存"
    >
      <Row style={{marginTop:"20px"}}>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="ID(请和国家编码保持一致):" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('id', {
              rules: [{required: true, message: '请输入ID'}],
              initialValue: regionRecord.id?regionRecord.id:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="PID:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('pid', {
              rules: [{required: true, message: '请输入父ID'}],
              initialValue: regionRecord.pid?regionRecord.pid:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="名称:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('name', {
              rules: [{required: true, message: '请输入名称'}],
              initialValue: regionRecord.name?regionRecord.name:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="地名简称:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('sname', {
              rules: [{required: true, message: '请输入地名简称'}],
              initialValue: regionRecord.sname?regionRecord.sname:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="区域编码:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('citycode', {
              rules: [{ message: '请输入区域编码'}],
              initialValue: regionRecord.citycode?regionRecord.citycode:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="邮政编码:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('yzcode', {
              rules: [{message: '请输入邮政编码'}],
              initialValue: regionRecord.yzcode?regionRecord.yzcode:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="经度:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('lng', {
              rules: [{message: '经度'}],
              initialValue: regionRecord.lng?regionRecord.lng:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="纬度:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('lat', {
              rules: [{ message: '纬度'}],
              initialValue: regionRecord.lat?regionRecord.lat:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayoutOne} label="状态:" style={{ marginBottom: '10px' }}>
            {getFieldDecorator('state', {
              initialValue: regionRecord.state?regionRecord.state:'',
            })(      <Select placeholder="分类" className="margin-right margin-bottom" style={{width: '100%'}} size='default'>
              <Option key={'s'+1} value={'激活'}>{'激活'}</Option>
              <Option key={'s'+2} value={'停用'}>{'停用'}</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(UpdateModal)
