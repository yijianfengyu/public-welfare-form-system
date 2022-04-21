import React from 'react'
import { Table, Form, Icon, Tooltip, Modal, Row, Col, Input, Button } from 'antd'
import { request, config } from 'utils'

const { api } = config


const ProjectPartnerAddList = ({ dispatch,...modelProps,
  form: {
    getFieldsValue,
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldValue
  } }) => {
  const FormItem = Form.Item;
  const columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: "100px"
    }, {
    title: '合作方分类',
    dataIndex: 'type',
    key: 'type',
    width: "100px"
    },{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: "100px"
    },{
    title: '联系人姓名',
    dataIndex: 'concat_name',
    key: 'concat_name',
    width: "100px"
    },{
    title: '联系人电话',
    dataIndex: 'concat_phone',
    key: 'concat_phone',
    width: "100px"
    },
  ]
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      dispatch({
        type: 'account/querySuccess', payload: {
          partnerId:record.id,
        },
      })
    },
    hideDefaultSelections:true,
  }

  function handleCancel () {
    dispatch({
      type: 'account/querySuccess', payload: {
        bindModalVisible: false,
      },
    })
  }

  function handleOk () {
    dispatch({
      type: 'account/updateUserPartner', payload: {
        userId:modelProps.userId,
        partnerId:modelProps.partnerId,
        bindModalVisible: false,
      },
    })
  }

  function getData(e){
    let name=e.target.value;
    dispatch({
      type: 'account/queryPartnerList', payload: {
        name,
      },
    })
  }
  function onSearch(){
    let name=getFieldValue('name');
    dispatch({
      type: 'account/queryPartnerList', payload: {
        name,
      },
    })
  }
  return (
    <Modal
      {...modelProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title={'团队资方新增'}
      okText="保存"
    >
      <Row>
        <Col span={12} style={{marginBottom:12}}>
          <FormItem>
            {
              getFieldDecorator('name',{
                initialValue:'',
              })(
                <Input size='default' onChange={getData} style={{width: "250px"}} placeholder='请输入'/>
              )
            }
          </FormItem>
        </Col>
        <Col span={12} style={{marginBottom:12}}>
          <Button type="primary" onClick={onSearch} icon="search">Search</Button>
        </Col>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            columns={columns}
            simple
            rowKey={record => record.id}
            size="small"
            scroll={{ y: 600 }}
            rowSelection={rowSelection}
            dataSource={modelProps.projectPartnerList}
          />
        </Col>
      </Row>
    </Modal>
  )
}
export default Form.create()(ProjectPartnerAddList)
