import React from 'react'
import {Form,Modal,Row,Col,Select,DatePicker,Input} from 'antd'

const FormItem = Form.Item
const {TextArea} = Input;
const userName=JSON.parse(sessionStorage.getItem("userStorage")).userName

const DailyModal = ({location,modalType , ...modalProps,dispatch,projectName1,projectName2,projectName3,  createTime,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    setFieldsValue,
    validateFields,
  },
}) => {

  let projectName1Options=[]
  for(let i in projectName1){
    projectName1Options.push(<Option  key={projectName1[i].id+"#"+projectName1[i].groupId}>{projectName1[i].projectName}</Option>)
  }

  let projectName2Options=[]
  for(let i in projectName2){
    projectName2Options.push(<Option  key={projectName2[i].id+"#"+projectName2[i].groupId}>{projectName2[i].projectName}</Option>)
  }

  let projectName3Options=[]
  for(let i in projectName3){
    projectName3Options.push(<Option  key={projectName3[i].id+"#"+projectName3[i].groupId}>{projectName3[i].projectName}</Option>)
  }

  function projectName1OnChange(value){
    dispatch({
      type: 'dailyReport/queryProjectName', payload: {
        parentId: value,
        type:2,
        //companyCode:JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      }
    })
    setFieldsValue({
      projectName2: "",
      projectName3: "",
    })

  }

  function projectName2OnChange(value){
    dispatch({
      type: 'dailyReport/queryProjectName', payload: {
        parentId: value,
        type:3,
        //companyCode:JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      }
    })
    setFieldsValue({
      projectName3: "",
    })

  }

  function handleCancel(e) {
    dispatch({
      type: "dailyReport/querySuccess", payload: {
        modalVisible: false,
        projectName1:[],
        projectName2:[],
      }
    })
  }

  function handleOk(){
    validateFields((errors,value) => {
      if (errors) {
        return
      }
      let ids=""
      let id
      if(value.projectName3 != ""){
        ids=value.projectName1.split("#")[0]+","+value.projectName2.split("#")[0]+","+value.projectName3.split("#")[0]
        id=value.projectName3.split("#")[0]
      }else if(value.projectName2 != ""){
        ids=value.projectName1.split("#")[0]+","+value.projectName2.split("#")[0]
        id=value.projectName2.split("#")[0]
      }else{
        ids=value.projectName1.split("#")[0]
        id=value.projectName1.split("#")[0]
      }

      dispatch({
        type: "dailyReport/createProjectDaily", payload: {
          createName:userName,
          content:value.content,
          projectId:id,
          projectPath:ids,
          groupId:value.projectName1.split("#")[1],
        }
      })
    })
  }

  return (
    <div>
      <Modal
        {...modalProps}
        onOk={handleOk}
        onCancel={handleCancel}
        title={modalType=="create"?"添加日报 —— "+userName :"修改日报 —— "+userName}
        okText="保存"
      >
        <Row gutter={8}>
          <Col span={8}>
            <FormItem label="一级项目" labelCol={{span: "8"}}>
              {getFieldDecorator('projectName1', {
                rules: [{required: true}]
              })(<Select size="default" style={{width: "150px"}} onChange={projectName1OnChange}>
                {projectName1Options}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="二级项目" labelCol={{span: "8"}}>
              {getFieldDecorator('projectName2', {
              })(<Select size="default" style={{width: "150px"}} onChange={projectName2OnChange}>
                {projectName2Options}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="三级项目" labelCol={{span: "8"}}>
              {getFieldDecorator('projectName3', {
              })(<Select size="default" style={{width: "150px"}}>
                {projectName3Options}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>

          <Col span={8}>
            <FormItem label="创建时间" labelCol={{span: "8"}} style={{display:modalType == "create" ? "none" : "inline"}}>
              {getFieldDecorator('createDate', {
              })(<DatePicker size="default" showTime format="YYYY-MM-DD HH:mm:ss" style={{width: "150px"}} disabled={true} />)}
            </FormItem>
          </Col>
          <Col span={8}>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label="内容" labelCol={{span: "5"}}>
              {getFieldDecorator('content', {

                rules: [{required: true}]
              })(<TextArea autosize={{minRows: 4, maxRows: 6}} size="default" style={{width: "800px"}}/>)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}


export default Form.create()(DailyModal)
