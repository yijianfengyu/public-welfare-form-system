import React from 'react'
import {Row,Col, Form,Input,Radio,DatePicker,Select,Modal} from 'antd'
//import QuerySupervisor from '../../components/Form/QuerySupervisor'
const AddProjectModal = ({
  dispatch,userName,expectedEndTime,startDate,projectRecord,user,levelOptions,viewPeopleChild,
  viewPeopleAndAllChild,confirmLoading,actualEndTime,selectName,...modalProps,modalType,optionItem,
  projectTypeList,processList,
  form: {
    getFieldDecorator,
    validateFields
  },
}) => {
  const FormItem = Form.Item
  const {TextArea} = Input;
  function handleOk() {
    validateFields((error,value) => {
      if(error){return}
/*      if(value.expectedEndTime!="" && value.expectedEndTime!=undefined){
        value.expectedEndTime = expectedEndTime
      }else{
        value.expectedEndTime=null
      }*/
  /*    if(value.actualEndTime!="" && value.actualEndTime!=undefined){
        value.actualEndTime = actualEndTime
      }else{
        value.actualEndTime=null
      }*/
/*      if(value.startDate!="" && value.startDate!=undefined){
        value.startDate = startDate
      }else{
        value.startDate =null
      }*/
      if(modalType=="1"){
        value.parentId = 0;
        value.groupId = "";
      }else{
        value.parentId = projectRecord.id;
        value.groupId = projectRecord.groupId;
      }
      //value.user = user;
      value.viewPeople = value.viewPeople.toString();
      //value.projectProgress = value.projectProgress.toString().replace("%","");
      value.name = value.projectName;
      //value.companyCode=JSON.parse(sessionStorage.getItem("UserStrom")).companyCode;
      //value.creater=JSON.parse(sessionStorage.getItem("UserStrom")).id;
      //value.createrName=userName;
      value.executorName = selectName;
      dispatch({
        type:"projectManage/createProject",
        payload:{
          value
        }
      })
      dispatch({
        type:"projectManage/querySuccess",
        payload:{
          confirmLoading:true,
        }
      })
    })
  }

  function handleCancel() {
    dispatch({type: "projectManage/querySuccess",payload:{
      addProjectModalVisible:false
    }})
  }
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const formItemLayoutOne = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  //项目阶段
  console.log("--projectRecord--",projectRecord);
  const processChild = [];
  processChild.push(<Option key={"-999"} value={""}>{""}</Option>);
  for (let i in processList) {
    processChild.push(<Option value={processList[i].value} key={'pl'+i}>{processList[i].key}</Option>);
  }
  //项目类型
  const projectTypeChild = [];
  projectTypeChild.push(<Option key={"-99"} value={""}>{""}</Option>);
  for (let i in projectTypeList) {
    projectTypeChild.push(<Option value={projectTypeList[i].value} key={'ptl'+i}>{projectTypeList[i].key}</Option>);
  }
  return (
    <Modal
      {...modalProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title={modalType=="1"?"新增根项目":projectRecord.projectName+"---添加子项目"}
      okText="保存"
      confirmLoading={confirmLoading}
    >
      <Row gutter={24}>
        <Col  xs={24} sm={12}>
          <FormItem label="项目名称:" {...formItemLayout}>
            {getFieldDecorator('projectName', {
              rules: [{required: true,message: '请输入项目名称'}]
            })(<Input size='default' style={{ width:"100%"}}/>)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem label="状态:" {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue:"Active"
            })(<Select size='default'  style={{ width:"100%"}}>
              <Option key={"Active"}>{"正常"}</Option>
              <Option key={"Completed"}>{"已完成"}</Option>
              <Option key={"Cancel"}>{"删除"}</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="负责人:" {...formItemLayout}>
            {getFieldDecorator('executor', {
              rules: [{required: true,message: '请输入负责人'}],
              initialValue:projectRecord.executor
            })(<Select  showSearch size='default'  style={{width: "100%"}}
                        onSelect={function handleChange(value,option) {
                          dispatch({
                            type: "projectManage/querySuccess",
                            payload: {
                              selectName: option.props.children
                            }
                          })
                        }}>
                {viewPeopleChild}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem label="创建人:" {...formItemLayout}>
            {getFieldDecorator('creater', {
              initialValue:userName
            })(<Input size='default' style={{ width:"100%"}} disabled={true}/>)}
          </FormItem>
        </Col>
      </Row>
      {modalType!="1"&&<Row gutter={24}>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <FormItem label="项目类型:" {...formItemLayout}>
              {getFieldDecorator('projectType', {
              })(<Select size='default'  style={{ width:"100%"}}  >
                {projectTypeChild}
              </Select>)}
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem label="项目阶段:" {...formItemLayout}>
              {getFieldDecorator('process', {
              })(<Select size='default'  style={{ width:"100%"}}>
                {processChild}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </Row>}


      {/*<Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="开始时间:" {...formItemLayout}>
            {getFieldDecorator('startDate', {
              rules: [{required: true,message: '请选择开始时间'}]
            })(<DatePicker size='default' style={{ width:"100%"}}  showTime format="YYYY-MM-DD HH:mm:ss"
                           onChange={function(date,dateString){ dispatch({type: "projectManage/querySuccess", payload: {startDate: dateString}}) }
                           }/>)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem label="要求完成时:" {...formItemLayout}>
            {getFieldDecorator('expectedEndTime', {
              rules: [{required: true,message: '请选择要求完成时间'}]
            })(<DatePicker size='default' style={{ width:"100%"}} showTime format="YYYY-MM-DD HH:mm:ss"
                           onChange={function(date,dateString){dispatch({type: "projectManage/querySuccess", payload: {expectedEndTime: dateString}})}
                           }/>)}
          </FormItem>
        </Col>
      </Row>*/}
      {/*<Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="是否逾期:" {...formItemLayout}>
            {getFieldDecorator('isOverdue', {
              initialValue:"NO"
            })(<Select size='default' style={{ width:"100%"}} disabled={true} defaultValue="NO">
              <Option key={"YES"}>{"YES"}</Option>
              <Option key={"NO"}>{"NO"}</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem label="实际完成时:" {...formItemLayout} >
            {getFieldDecorator('actualEndTime', {
            })(<DatePicker  size='default' style={{ width:"100%"}}  showTime format="YYYY-MM-DD HH:mm:ss"
                            onChange={function(date,dateString){dispatch({type: "projectManage/querySuccess", payload: {actualEndTime: dateString}})}
                            }/>)}
          </FormItem>
        </Col>

      </Row>*/}
      {/*<Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="项目进度:" {...formItemLayout}>
            {getFieldDecorator('projectProgress', {
              initialValue:"0%"
            })(<Select size='default'  style={{ width:"100%"}}  >
              <Option key={"0"}>{"0%"}</Option>
              <Option key={"10"}>{"10%"}</Option>
              <Option key={"30"}>{"30%"}</Option>
              <Option key={"50"}>{"50%"}</Option>
              <Option key={"70"}>{"70%"}</Option>
              <Option key={"90"}>{"90%"}</Option>
              <Option key={"100"}>{"100%"}</Option>
            </Select>)}
          </FormItem>
        </Col>

      </Row>*/}
      {/*<Row gutter={24}>
        <Col xs={24} sm={24}>
          <FormItem label="优先级:" {...formItemLayoutOne}>
            {getFieldDecorator('priority', {
              initialValue:"3",
              rules: [{required: true,message: '请选择优先级'}]
            })(<Radio.Group size='default'  options={levelOptions}>
            </Radio.Group>)}
          </FormItem>
        </Col>
      </Row>*/}
      <Row gutter={24}>
        <Col  xs={24} sm={24}>
          <FormItem label="可视人:" {...formItemLayoutOne}>
            {getFieldDecorator('viewPeople', {
              initialValue:"All",
              rules: [{required: true,message: '请选择可视人'}]
            })(<Select mode="multiple" size='default'  style={{width: "100%"}}>
              {viewPeopleAndAllChild}
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <FormItem label="备注:" {...formItemLayoutOne}>
            {getFieldDecorator('remark', {

            })(<TextArea autosize={{minRows: 3, maxRows: 4}}  style={{width: "100%"}}/>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(AddProjectModal)
