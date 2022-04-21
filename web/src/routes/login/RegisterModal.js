import React from 'react'
import {Form, Input, Checkbox, Modal, DatePicker, Row, Col, Button, message,Upload,Icon} from 'antd'
import moment from "moment"
import {request, config} from 'utils'
const {api} = config
const {pohtoUpload} = api
const RegisterModal = ({dispatch,registerModalVisible,roleList,companyList,fileList,
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
})=>{
  const FormItem = Form.Item
  const CheckboxGroup = Checkbox.Group;
  let roleOptions = [];
  let ownerOptions = [];
    for (var i in roleList) {
      if(roleList[i].settingName!="boss"){
        roleOptions.push(roleList[i].settingName)
      }
    }

  for (var j in companyList) {
    ownerOptions.push(companyList[j].settingName)
  }
  function onOk() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      let photo
      if(value.photot!=undefined){
        photo=value.photot.file.response
      }
      setFieldsValue({
        photot:photo,
      });
      dispatch({
        type: "user/register", payload: {
           value:getFieldsValue(),
        }
      })
      dispatch({type: 'login/querySuccess', payload: {
        registerModalVisible:false,
      }})
  })
  }

  function onCancel() {
    dispatch({type: 'login/querySuccess', payload: {
      registerModalVisible:false,
      dateTime:"",
    }})
  }

  function dateChange(data, dataString) {
    dispatch({
      type: "user/querySuccess", payload: {
        dateTime: dataString
      }
    })
  }
  //上传图片
  function filter(file){
    const {name, response, uid, status} = file;
    return {name, url: response.data, uid, status};
  };
  function  Change1 (info) {
    let fileList = info.fileList;
    fileList = fileList.slice(-2);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;

      }
      return file;
    });
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });
    if(info.file.status==='done'){
      message.info("上传身份证图片成功！");
    }else if(info.file.status === 'error'){
      message.info("上传身份证图片失败！");
    }
    dispatch({
      type: 'customer/querySuccess',
      payload: {
        fileList: fileList,
      },
    })
  }
  function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (isJPG||isPNG) {
      return isJPG || isPNG
    }else {
      message.error('You can only upload JPG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isPNG;
  }
  let code = sessionStorage.getItem("code")
  let user=new Object()
  user.code=code
  let aa=pohtoUpload+"?code_key="+code
  const props = {
    name: 'file',
    action:aa,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'authorization': 'authorization-text'
    },
    accept:'png/jpg',
    method: 'get',
    showUploadList:true,
    multiple: true,
    data:user,
    listType: 'picture',
    onChange: Change1,
  }
return(
  <Modal
    title="用户注册"
    onOk={onOk}
    onCancel={onCancel}
    visible={registerModalVisible}
    width="1150px"
  >

          <Row>
            <Col span={8}>
              <FormItem label="RealName" labelCol={{span: "6"}}>
                {getFieldDecorator('realName', {
                  rules: [{required: true,},],
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Tel" labelCol={{span: "6"}}>
                {getFieldDecorator('tel', {
                  rules: [{required: true,},],
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Cell" labelCol={{span: "6"}}>
                {getFieldDecorator('cell', {
                  rules: [{required:true}]
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="上传身份证图片" labelCol={{span: "6"}}>
                {getFieldDecorator('photot', {})(<Upload {...props}>
                  <Button style={{width: "250px"}}>
                    <Icon type="upload"/> Click to Upload
                  </Button>
                </Upload>)}
              </FormItem>
            </Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="身份证" labelCol={{span: "6"}}>
                {getFieldDecorator('creditNo', {
                  rules: [{required:true}]
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="身份证地址" labelCol={{span: "6"}}>
                {getFieldDecorator('creditAddress', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="MSN" labelCol={{span: "6"}}>
                {getFieldDecorator('msn', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="入职日期" labelCol={{span: "6"}}>
                {getFieldDecorator('birthday', {
                  rules: [{required: true},],
                })(<DatePicker size="default" onChange={dateChange} style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Title" labelCol={{span: "6"}}>
                {getFieldDecorator('title', {
                  rules: [{required: true}]
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Fax" labelCol={{span: "6"}}>
                {getFieldDecorator('fax', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem label="Roles" labelCol={{span: "3"}}>
                {getFieldDecorator('role', {
                  rules: [{required: true}]
                })(<CheckboxGroup size="default" options={roleOptions}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem label="所属分公司" labelCol={{span: "3"}}>
                {getFieldDecorator('companyBranch', {
                  rules: [{required: true}]
                })(<CheckboxGroup size="default" options={ownerOptions}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="Email" labelCol={{span: "6"}}>
                {getFieldDecorator('email', {
                  rules: [{
                    required:true,
                    pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    message:"The input is not valid E-mail!"}]
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Email PW" labelCol={{span: "6"}}>
                {getFieldDecorator('emailPassword', {
                })(<Input size="default" type="password" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="EmergencyTel" labelCol={{span: "6"}}>
                {getFieldDecorator('emergTel', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="City" labelCol={{span: "6"}}>
                {getFieldDecorator('city', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Home Tel" labelCol={{span: "6"}}>
                {getFieldDecorator('homeTel', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Signture" labelCol={{span: "6"}}>
                {getFieldDecorator('signature', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="Address" labelCol={{span: "6"}}>
                {getFieldDecorator('address', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Bank Card No" labelCol={{span: "6"}}>
                {getFieldDecorator('cardNo', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Card Address" labelCol={{span: "6"}}>
                {getFieldDecorator('cardAddress', {
                })(<Input size="default" style={{width: "250px"}}/>)}
              </FormItem>
            </Col>
          </Row>

  </Modal>
)
}
export default Form.create()(RegisterModal)
