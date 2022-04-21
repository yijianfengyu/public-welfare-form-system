import React from 'react'
import {Row,Col, Form,Input,Modal,Upload,Button,Icon,message} from 'antd'
import {config} from 'utils'
const {api} = config
const {pmFileUpload,projectResourceUrl} = api

const UploadModal = ({
  dispatch,resource,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
}) => {
  const {resourcesRecord,fileUrl, fileName, fileList}=resource;
  const uploadModalProps = {
    resourcesRecord,fileUrl, fileName, fileList,
    visible: resource.uploadModalVisible,
    width: '400px',
    maskClosable: false,
  }
  const FormItem = Form.Item
  const {TextArea} = Input;
  let user = JSON.parse(sessionStorage.getItem("UserStrom"))
  let obj=new Object()
  obj.companyCode=user.companyCode
  const actionAddress = pmFileUpload

  function handleOk() {

    if(null==fileUrl || fileUrl=="" ){
      message.info("请上传资源再保存")
      return
    }
    let field = getFieldsValue()
    //let url = projectResourceUrl+fileUrl
    let remark = resourcesRecord.remark
    if(field.remark!=""&&field.remark!=undefined){
      remark += "  上传备注:"+field.remark
    }
        dispatch({
          type:"resource/addResource",payload:{
            id:resourcesRecord.id,
            resourcesName:field.resourcesName,
            remark:remark,
            fileName,
            uploader:JSON.parse(sessionStorage.getItem("UserStrom")).id,
            url:fileUrl,
          }
        })
        handleCancel()
  }

  function handleCancel() {
    dispatch({type: "resource/querySuccess",payload:{
      uploadModalVisible:false,
      fileUrl:"",
      fileList:[],
      fileName:"",
    }})
  }

  const props = {
    action: actionAddress,
    data:obj,
    onRemove: () => {
      dispatch({
        type:"resource/querySuccess",payload:{
          fileList:[],
          fileUrl:"",
          fileName:"",
        }
      })
    },
    onChange(info) {
      let fileList = info.fileList;
      //只允许上传一个文件
      fileList = fileList.slice(-1);
      //获取上传文件的结果并且展示url
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      dispatch({
        type:"resource/querySuccess",payload:{
          fileList:fileList,
          fileUrl:info.file.response,
          fileName:info.file.name,
        }
      })
    },
    fileList: fileList,
  }

  return (
    <Modal
      {...uploadModalProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title={resourcesRecord.resourcesName}
      okText="保存"
    >
      <Row>
        <Col span={24}>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 上传资源
            </Button>
          </Upload>
        </Col>
      </Row>
      <Row style={{marginTop:"20px"}}>
        <Col span={24}>
          <FormItem label="资源名称:">
            {getFieldDecorator('resourcesName', {
              rules: [{required: true, message: '请输入资源名称'}],
              initialValue: resourcesRecord.resourcesName?resourcesRecord.resourcesName:'',
            })(<Input size='default' style={{width: "250px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row style={{marginTop:"20px"}}>
        <Col span={24}>
          <FormItem label="备注:" labelCol={{span:"3"}}>
            {getFieldDecorator('remark', {
              initialValue: resourcesRecord.remark?resourcesRecord.remark:'',
            })(<TextArea autosize={{minRows: 2, maxRows: 3}}  style={{width: "300px"}}/>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(UploadModal)
