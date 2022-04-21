import React from 'react'
import {Row,Col, Form,Input,Modal,Button,Icon,message,Radio,Upload,Select} from 'antd'
import reqwest from 'reqwest';
const FormModal = ({
  dispatch,
  ...modalProps,
  formList,
  projectRecord,
  userName,
  formName,
  form: {
    getFieldDecorator,
    validateFields
    },
  }) => {
  const FormItem = Form.Item
  const {TextArea} = Input;
  const fromChild = [];
  for (let i in formList) {
    fromChild.push(<Option key={formList[i].formTitle+"@@"+formList[i].id}>{formList[i].formTitle}</Option>);
  }
  function handleOk() {
    validateFields((error, value) => {
      if (error) {
        return
      }
      let id = value.url.split("@@")[1];
      // let url = window.location.protocol + "//" + window.location.host + "/visit/selectForms?id=" + id + "&projectId=" + projectRecord.id;
      let url = id;
      dispatch({
        type: "projectManage/addProjectResourceModel",
        payload: {
          type: "附加表单",
          projectId: projectRecord.id,
          resourcesName: value.resourcesName,
          isEssential: value.isEssential,
          remark: value.remark,
          //createName: userName,
          url: url,
          groupId:projectRecord.groupId
        }
      })

      handleCancel()
    })
  }

  function handleCancel() {
    dispatch({
      type: "projectManage/querySuccess", payload: {
        FormModalVisible: false,
        fileList: [],
        formName: "",
      }
    })
  }

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  };

  function handleChange(value) {
    let form = value.split("@")
    let name = form[0]
    dispatch({
      type: 'projectManage/querySuccess',
      payload: {
        formName: name
      }
    })
  }

  return (
    <Modal
      {...modalProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title="附加表单数据"
      okText="保存"
    >
      <Row>
        <Col span={24}>
          <FormItem label="表单名称:" {...formItemLayout}>
            {getFieldDecorator('url', {
              rules: [{required: true, message: '请选择表单名称'}],
            })(<Select size='default' showSearch style={{width: "250px"}} onChange={handleChange}>
              {fromChild}
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="资源名称:" {...formItemLayout}>
            {getFieldDecorator('resourcesName', {
              rules: [{required: true, message: '请输入资源名称'}],
              initialValue: formName
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="备注:" labelCol={{span:"6"}}>
            {getFieldDecorator('remark', {})(<TextArea autosize={{minRows: 2, maxRows: 3}} style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(FormModal)
