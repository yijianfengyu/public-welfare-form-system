import React from 'react'
import { Table, Form, Icon, Tooltip, Modal, Row, Col, Input, Button } from 'antd'
import { request, config } from 'utils'

const { api } = config

const ProjectTeamAddList = ({ dispatch,projectTeamListSelect,...modelProps,
  form: {
  getFieldsValue,
  setFieldsValue,
  getFieldDecorator,
  validateFields,
    getFieldValue
} }) => {
  const FormItem = Form.Item
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '40px',
    }, {
      title: '团队编号',
      dataIndex: 'team_no',
      key: 'team_no',
      width: '60px',
    }, {
      title: '机构名称',
      dataIndex: 'institution_name',
      key: 'institution_name',
      width: '80px',
    }, {
      title: '团队名称',
      dataIndex: 'name',
      key: 'name',
      width: '80px',
    },
  ]
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      if(selected){
        //加入
        let exist=false;
        for(let i=0;i<projectTeamListSelect.length;i++){
          if(projectTeamListSelect[i]==record.id){
            exist=true;
            break;
          }
        }
        if(!exist){
          projectTeamListSelect.push(record.id);
        }
      }else{
        //删除
        for(let i=0;i<projectTeamListSelect.length;i++){
          if(projectTeamListSelect[i]==record.id){
            projectTeamListSelect.splice(i, 1);
          }
        }
      }
      dispatch({
        type: 'projectManage/querySuccess', payload: {
          projectTeamListSelect
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
          projectTeamListSelect:result
        },
      })
    },
    hideDefaultSelections:true,
  }

  function handleCancel () {
    dispatch({
      type: 'projectManage/querySuccess', payload: {
        addProjectTeamModelShow: false,
      },
    })
  }

  function handleOk () {
    dispatch({
      type: 'projectManage/updateProjectTeam', payload: {
        projectTeamListSelect,
        addProjectTeamModelShow: false,
      },
    })
  }

  function getData(e){
    let name=e.target.value;
    dispatch({
      type: 'projectManage/queryTeamList', payload: {
        name,
      },
    })
  }
  function onSearch(){
    let name=getFieldValue('name');
    dispatch({
      type: 'projectManage/queryTeamList', payload: {
        name,
      },
    })
  }

  return (
    <Modal
      {...modelProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title={'项目团队新增'}
      okText="保存"
    >
      <Row>
        <Col span={12} style={{marginBottom:12}}>
            <FormItem>
              {
                getFieldDecorator('name',{
                  initialValue:'',
                })(
                  <Input size='default' onChange={getData} style={{width: "250px"}} placeholder='请输入团队名称或者编号'/>
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
          dataSource={modelProps.projectTeamList}
        />
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(ProjectTeamAddList)
