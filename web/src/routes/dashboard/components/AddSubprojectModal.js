import React from 'react'
import {Row,Col, Form,Input,Radio,DatePicker,Select,Modal} from 'antd'
import moment from 'moment';
const AddSubprojectModal = ({
  dispatch,
  addLogProjectRecord,
  principalValue,
  selectExecutorName,
  ...modalProps,
  form: {
    getFieldDecorator,
    validateFields
    },
  }) => {

  const FormItem = Form.Item
  const {TextArea} = Input;
  const viewPeopleAndAllChild = [];
  viewPeopleAndAllChild.push(<Option key={"All"}>{"All"}</Option>);
  for (let j in principalValue) {
    viewPeopleAndAllChild.push(<Option key={principalValue[j].id}>{principalValue[j].userName}</Option>);
  }
  const levelOptions = ['1', '2', '3', '4', '5'];

  function handleProjectOk() {
    validateFields((error, value) => {
      if (error) {
        return
      }
      if (value.expectedEndTime != "" && value.expectedEndTime != undefined) {
        value.expectedEndTime = moment(value.expectedEndTime).format('YYYY-MM-DD HH:mm:ss')
      } else {
        value.expectedEndTime = null
      }
      if (value.actualEndTime != "" && value.actualEndTime != undefined) {
        value.actualEndTime = moment(value.actualEndTime).format('YYYY-MM-DD HH:mm:ss')
      } else {
        value.actualEndTime = null
      }
      if (value.startDate != "" && value.startDate != undefined) {
        value.startDate = moment(value.startDate).format('YYYY-MM-DD HH:mm:ss')
      } else {
        value.startDate = null
      }
      value.parentId = 0;
      value.groupId = "";
      value.user = sessionStorage.getItem("UserStrom");
      value.viewPeople = value.viewPeople.toString();
      value.projectProgress = value.projectProgress.toString().replace("%", "");
      value.companyCode = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      value.creater = JSON.parse(sessionStorage.getItem("UserStrom")).id
      value.createrName=JSON.parse(sessionStorage.getItem("UserStrom")).userName
      value.executorName=selectExecutorName
      dispatch({
        type: "dashboard/createProject",
        payload: {
          value
        }
      })
    })
  }

  function handleOk() {
    validateFields((error, value) => {
      if (error) {
        return
      }
      if (value.actualEndTime != undefined&&value.actualEndTime != "") {
        value.actualEndTime = moment(value.actualEndTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if(value.startDate != ""){
        value.startDate = moment(value.startDate).format('YYYY-MM-DD HH:mm:ss')
      }
      if(value.expectedEndTime != ""){
        value.expectedEndTime = moment(value.expectedEndTime).format('YYYY-MM-DD HH:mm:ss')
      }
      value.parentId = addLogProjectRecord.id;
      value.groupId = addLogProjectRecord.groupId;
      value.user = sessionStorage.getItem("UserStrom");
      value.viewPeople = value.viewPeople.toString();
      value.projectProgress = value.projectProgress.toString().replace("%", "");
      value.companyCode = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      value.creater = JSON.parse(sessionStorage.getItem("UserStrom")).id
      value.createrName=JSON.parse(sessionStorage.getItem("UserStrom")).userName
      value.executorName=selectExecutorName
      dispatch({
        type: "dashboard/createProject",
        payload: {
          value
        }
      })
    })
  }

  function handleCancel() {
    dispatch({
      type: "dashboard/querySuccess",
      payload: {
        addSubprojectModalVisible: false,
        addLogProjectRecord: {},
      }
    })
  }

  const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };
  const formItemLayoutOne = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  };

  return (
    <Modal
      {...modalProps}
      onOk={JSON.stringify(addLogProjectRecord) != '{}'?handleOk:handleProjectOk}
      onCancel={handleCancel}
      title={JSON.stringify(addLogProjectRecord) != '{}'?"添加子项目":"新增根项目"}
      okText="保存"
    >
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="项目名称:" {...formItemLayout}>
            {getFieldDecorator('projectName', {
              rules: [{required: true, message: '请输入项目名称'}]
            })(<Input size='default' style={{ width:"100%"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="负责人:" {...formItemLayout}>
            {getFieldDecorator('executor', {
              rules: [{required: true, message: '请输入负责人'}],
              initialValue: addLogProjectRecord.executor
            })(<Select showSearch size='default' style={{width: "100%"}}
                       onSelect={function handleChange(value,option) {
                          dispatch({
                            type: "dashboard/querySuccess",
                            payload: {
                              selectExecutorName: option.props.children
                            }
                          })
                        }}>
                {principalValue.map(function (value) {
                  return <Option key={value.id}>{value.userName}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem label="创建人:" {...formItemLayout}>
            {getFieldDecorator('creater', {
              initialValue: JSON.parse(sessionStorage.getItem("UserStrom")).userName
            })(<Input size='default' style={{ width:"100%"}} disabled={true}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="开始时间:" {...formItemLayout}>
            {getFieldDecorator('startDate', {
              rules: [{required: true, message: '请选择开始时间'}]
            })(<DatePicker size='default' style={{ width:"100%"}} showTime format="YYYY-MM-DD HH:mm:ss"
                           onChange={function(date,dateString){ dispatch({type: "projectManage/querySuccess", payload: {startDate: dateString}}) }
                           }/>)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem label="要求完成时:" {...formItemLayout}>
            {getFieldDecorator('expectedEndTime', {
              rules: [{required: true, message: '请选择要求完成时间'}]
            })(<DatePicker size='default' style={{ width:"100%"}} showTime format="YYYY-MM-DD HH:mm:ss"
                           onChange={function(date,dateString){dispatch({type: "projectManage/querySuccess", payload: {expectedEndTime: dateString}})}
                           }/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="是否逾期:" {...formItemLayout}>
            {getFieldDecorator('isOverdue', {
              initialValue: "NO"
            })(<Select size='default' style={{ width:"100%"}} disabled={true} defaultValue="NO">
              <Option key={"YES"}>{"YES"}</Option>
              <Option key={"NO"}>{"NO"}</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem label="实际完成时:" {...formItemLayout} >
            {getFieldDecorator('actualEndTime', {})(<DatePicker size='default' style={{ width:"100%"}} showTime
                                                                format="YYYY-MM-DD HH:mm:ss"
                                                                onChange={function(date,dateString){dispatch({type: "projectManage/querySuccess", payload: {actualEndTime: dateString}})}
                           }/>)}
          </FormItem>
        </Col>

      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <FormItem label="项目进度:" {...formItemLayout}>
            {getFieldDecorator('projectProgress', {
              initialValue: "0%"
            })(<Select size='default' style={{ width:"100%"}}>
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
        <Col xs={24} sm={12}>
          <FormItem label="状态:" {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: "Active"
            })(<Select size='default' style={{ width:"100%"}}>
              <Option key={"Active"}>{"正常"}</Option>
              <Option key={"Completed"}>{"已完成"}</Option>
              <Option key={"Cancel"}>{"删除"}</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24}>
          <FormItem label="优先级:" {...formItemLayoutOne}>
            {getFieldDecorator('priority', {
              initialValue: "3",
              rules: [{required: true, message: '请选择优先级'}]
            })(<Radio.Group size='default' options={levelOptions}>
            </Radio.Group>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24}>
          <FormItem label="可视人:" {...formItemLayoutOne}>
            {getFieldDecorator('viewPeople', {
              initialValue: "All",
              rules: [{required: true, message: '请选择可视人'}]
            })(<Select mode="multiple" size='default' style={{width: "100%"}}>
              {viewPeopleAndAllChild}
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <FormItem label="备注:" {...formItemLayoutOne}>
            {getFieldDecorator('remark', {})(<TextArea autosize={{minRows: 3, maxRows: 4}} style={{width: "100%"}}/>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(AddSubprojectModal)
