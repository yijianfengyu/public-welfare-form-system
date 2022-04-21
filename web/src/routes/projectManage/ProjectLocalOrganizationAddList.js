import React from 'react'
import { Table, message, Icon, Tooltip, Modal, Row, Col, Input, Button, Form } from 'antd'
import { request, config } from 'utils'
const { api } = config

const ProjectLocalOrganizationAddList = ({ location,projectLocalOrganizationListSelect, dispatch,...modelProps,
  form: {
    getFieldsValue,
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldValue
  }
}) => {
  const FormItem = Form.Item
  const columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: "40px"
    }, {
    title: '系统编号',
    dataIndex: 'system_no',
    key: 'system_no',
    width: "50px"
    },{
    title: '在地组织名称',
    dataIndex: 'name',
    key: 'name',
    width: "100px"
    },{
    title: '组织所在地',
    dataIndex: 'location',
    key: 'location',
    width: "150px",
      render:(text, record, index)=>{
        let item=text?JSON.parse(text):'';
        return <span>{item.province} {item.city} {item.county} {item.town?item.town:''} {item.village?tem.village:''} {item.others}</span>;
      }
    },{
    title: '联系人姓名',
    dataIndex: 'concat_name',
    key: 'concat_name',
    width: "50px"
    },{
    title: '联系人电话',
    dataIndex: 'concat_phone',
    key: 'concat_phone',
    width: "50px"
    },{
    title: '联系人邮箱',
    dataIndex: 'concat_email',
    key: 'concat_email',
    width: "50px"
    },
  ]
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      if(selected){
        //加入
        let exist=false;
        for(let i=0;i<projectLocalOrganizationListSelect.length;i++){
          if(projectLocalOrganizationListSelect[i]==record.id){
            exist=true;
            break;
          }
        }
        if(!exist){
          projectLocalOrganizationListSelect.push(record.id);
        }
      }else{
        //删除
        for(let i=0;i<projectLocalOrganizationListSelect.length;i++){
          if(projectLocalOrganizationListSelect[i]==record.id){
            projectLocalOrganizationListSelect.splice(i, 1);
          }
        }
      }
      dispatch({
        type: 'projectManage/querySuccess', payload: {
          projectLocalOrganizationListSelect
        },
      })
    },
    onSelectAll:(selected, selectedRows, changeRows)=>{
      let result=[];
      if(selected){
        for(let k=0;k<selectedRows.length;k++){
          result.push(selectedRows[i].id)
        }
      }
      dispatch({
        type: 'projectManage/querySuccess', payload: {
          projectLocalOrganizationListSelect:result
        },
      })
    },
    hideDefaultSelections:true,
  }

  function handleCancel () {
    dispatch({
      type: 'projectManage/querySuccess', payload: {
        addProjectLocalOrganizationModelShow: false,
      },
    })
  }

  function handleOk () {
    dispatch({
      type: 'projectManage/updateProjectLocalOrganization', payload: {
        projectLocalOrganizationListSelect,
        addProjectLocalOrganizationModelShow: false,
      },
    })
  }

  function getData(e){
    let name=e.target.value;
    dispatch({
      type: 'projectManage/queryLocalOrganizationList', payload: {
        name,
      },
    })
  }
  function onSearch(){
    let name=getFieldValue('name');
    dispatch({
      type: 'projectManage/queryLocalOrganizationList', payload: {
        name,
      },
    })
  }

  return (
    <Modal
      {...modelProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title={'项目在地组织新增'}
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
            dataSource={modelProps.projectLocalOrganizationList}
          />
        </Col>
      </Row>
    </Modal>
  )
}
export default Form.create()(ProjectLocalOrganizationAddList)
