import React from 'react'
import {FilterItem} from 'components'
import {Form, Button, Row, Col, DatePicker, Input, Select, Modal, Icon} from 'antd'
import {warning} from '../../utils/common'
import styles from "../../utils/commonStyle.less"

const NewJournal = ({
  dispatch,
  userName,
  projectRecord,
  form: {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
    getFieldsValue,
    },
  }) => {
  const FormItem = Form.Item;
  const {TextArea} = Input;

  function saveJournal() {
    validateFields((error, value) => {
      if (error) {
        return
      }
      var str = value.content.replace(/\n/g, "<br>");
      var content="<p>"+str+"</p>";
       dispatch({
       type:"projectManage/createProjectDaily",
       payload:{
       content:content,
       //createName:JSON.parse(sessionStorage.getItem("UserStrom")).id,
       projectId:projectRecord.id,
       groupId:projectRecord.groupId
       }
       })
      onCancel()
    })
  }

  function onCancel() {
    document.getElementsByName("filterRow").item(0).style.display = "none";
    let field = []
    field.content = ""
    setFieldsValue(field)
  }

  const formItemLayout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
  };

  return (
    <div name="filterRow" style={{display: "none"}}>
      <div style={{padding:"0 20px 10px 20px"}}>
        <div style={{paddingLeft:"13px",border:"1px dashed #e6e6e6"}}>
          <Row style={{marginTop:"10px"}}>
            <Col span={24}>
              <FormItem label="内容"
                {...formItemLayout}
              >
                {getFieldDecorator('content', {

                  rules: [{required: true, message: '请输入内容'}],
                })(<TextArea autosize={{minRows: 4, maxRows: 6}} size="default"
                             style={{width: "340px"}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Button size="default" className="margin-right" style={{margin:"0px 16px 10px 55px"}} onClick={saveJournal}>保存日志</Button>
            <Button size="default" onClick={onCancel}>取消</Button>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default Form.create()(NewJournal)
