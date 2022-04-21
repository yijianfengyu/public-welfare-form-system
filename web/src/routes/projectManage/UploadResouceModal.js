import React from 'react'
import { Row, Col, Form, Input, Modal, Button, Icon, Tabs, Radio, Upload, Select, Table } from 'antd'
import {request, config} from 'utils'
import SearchResource from './SearchResource'
const {api,download} = config
const {pmFileUpload} = api
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const UploadResouceModal = ({
  projectManage,
  dispatch,projectRecord,
  ...modalProps,userName,formList,fileName,
  fileUrl,resourcesType,fileList,fileListOne,fileUrlOne,fileNameOne,fileResourcesName,id,richTextTypeList,
  form: {
    getFieldDecorator,
    validateFields
    },
  }) => {
  const FormItem = Form.Item
  const {TextArea} = Input;
  //const typeOptions = ['文件', '表单', '图文','附加表单'];
  const typeOptions = ['文件', '表单', '图文'];
  const isOptions = ['是', '否'];
  //let user = JSON.parse(sessionStorage.getItem("UserStrom"))
  //let obj = new Object()
  //obj.companyCode = user.companyCode
  const actionAddress = pmFileUpload
  const fromChild = [];
  for (let i in formList) {
    fromChild.push(<Option key={formList[i].formTitle+"@@"+formList[i].id}>{formList[i].formTitle}</Option>);
  }
  //上传资源
  const props = {
    action: actionAddress,
    //data: obj,
    multiple: true,
    headers: {
      'authorization': 'authorization-text',
    },
    withCredentials:true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      dispatch({
        type: "projectManage/querySuccess", payload: {
          fileList: newFileList,
        }
      })
    },
    onChange(info) {
      let fileList = info.fileList;
      let name=[]
      //获取上传文件的结果并且展示url
      fileList = fileList.map((file) => {
        let fileName=[]
        fileName=file.name.split(".")
        dispatch({
         type: "projectManage/querySuccess",
         payload: {
         fileResourcesName:fileName[0]
         }
         })
        if (file.response) {
          name.push(file.response)
          file.url = file.response;
        }
        return file;
      });
      dispatch({
        type: "projectManage/querySuccess", payload: {
          fileList: fileList,
          fileUrl: name,
          fileName: name,
        }
      })
    },
  }
  //上传模板
  const propsTemplate = {
    action: actionAddress,
    multiple: true,
    headers: {
      'authorization': 'authorization-text',
    },
    withCredentials:true,
    onRemove: (file) => {
      const index = fileListOne.indexOf(file);
      const newFileList = fileListOne.slice();
      newFileList.splice(index, 1);
      dispatch({
        type: "projectManage/querySuccess", payload: {
          fileListOne: newFileList,
        }
      })
    },
    onChange(info) {
      let name=[]
      let fileList = info.fileList;
      //获取上传文件的结果并且展示url
      fileList = fileList.map((file) => {
        let fileName=[]
        fileName=file.name.split(".")
        dispatch({
          type: "projectManage/querySuccess",
          payload: {
            fileResourcesName: fileName[0]
          }
        })
        if (file.response) {
          name.push(file.response)
          file.url = file.response.url;
        }
        return file;
      });
      dispatch({
        type: "projectManage/querySuccess", payload: {
          fileListOne: fileList,
          fileUrlOne: name,
          fileNameOne: name,
        }
      })
    },
  }

  function handleOk() {
    validateFields((error, value) => {
      if (error) {
        return
      }
      // console.log("projectRecord---",projectRecord);
      let remark = "";
      if (value.remark != "" && value.remark != undefined) {
        remark = "模板备注:" + value.remark
      }
      if (value.type == "文件") {
        if (fileUrl.length!=0 && fileUrlOne.length!=0) {
          dispatch({
            type: "projectManage/addProjectResourceModel", payload: {
              type: value.type,
              projectId: projectRecord.id,
              resourcesName: value.resourcesName,
              templateName: String(fileNameOne),
              templateUrl: String(fileUrlOne),
              isEssential: value.isEssential,
              remark: remark,
              createName: JSON.parse(sessionStorage.getItem("UserStrom")).id,
              url: String(fileUrl),
              fileName:String(fileName),
              groupId:projectRecord.groupId
            }
          })
          handleCancel()
        } else if (fileUrl.length!=0 && fileUrlOne.length==0) {
          dispatch({
            type: "projectManage/addProjectResourceModel", payload: {
              type: value.type,
              projectId: projectRecord.id,
              resourcesName: value.resourcesName,
              isEssential: value.isEssential,
              remark: remark,
              createName: JSON.parse(sessionStorage.getItem("UserStrom")).id,
              url: String(fileUrl),
              fileName: String(fileName),
              groupId:projectRecord.groupId
            }
          })
          handleCancel()
        } else if (fileUrl.length==0&& fileUrlOne.length!=0) {
          dispatch({
            type: "projectManage/addProjectResourceModel", payload: {
              type: value.type,
              projectId: projectRecord.id,
              resourcesName: value.resourcesName,
              templateName: String(fileNameOne),
              templateUrl: String(fileUrlOne),
              isEssential: value.isEssential,
              remark: remark,
              createName: JSON.parse(sessionStorage.getItem("UserStrom")).id,
              groupId:projectRecord.groupId
            }
          })
          handleCancel()
        } else {
          dispatch({
            type: "projectManage/addProjectResourceModel", payload: {
              type: value.type,
              projectId: projectRecord.id,
              resourcesName: value.resourcesName,
              isEssential: value.isEssential,
              remark: remark,
              createName: JSON.parse(sessionStorage.getItem("UserStrom")).id,
              groupId:projectRecord.groupId
            }
          })
          handleCancel()
        }
      }
      else if (value.type == "表单") {
        let id = value.url.split("@@")[1]
        // let url = window.location.protocol + "//" + window.location.host + "/visit/selectForms?id=" + id;
        let url = id;
        dispatch({
          type: "projectManage/addProjectResourceModel", payload: {
            type: value.type,
            projectId: projectRecord.id,
            resourcesName: value.resourcesName,
            isEssential: value.isEssential,
            remark: remark,
            createName: id,
            url:url,
            groupId:projectRecord.groupId
          }
        })
        handleCancel()
      } else if (value.type == "图文") {
        //这里的@uuid@带到后台进行赋值处理
        let url = "?resourcesUuid=@uuid@&projectId=" + projectRecord.id;
        dispatch({
          type: "projectManage/addProjectResourceModel", payload: {
            type: value.type,
            subType: value.subType,
            projectId: projectRecord.id,
            resourcesName: value.resourcesName,
            isEssential: value.isEssential,
            remark: remark,
            createName: JSON.parse(sessionStorage.getItem("UserStrom")).id,
            groupId:projectRecord.groupId,
            url
          }
        })
        handleCancel()
      }else if (value.type == "附加表单") {
        let id = value.url.split("@@")[1];

        let url = id;
        dispatch({
          type: "projectManage/addProjectResourceModel",
          payload: {
            type: "附加表单",
            projectId: projectRecord.id,
            resourcesName: value.resourcesName,
            isEssential: value.isEssential,
            remark: value.remark,
            url: url,
            groupId:projectRecord.groupId
          }
        })
        handleCancel()
      }
    })
  }

  function handleCancel() {
    dispatch({
      type: "projectManage/querySuccess", payload: {
        uploadModelModalVisible: false,
        fileUrl:[],
        fileName: "",
        fileList: [],
        resourcesType: "文件",
        fileListOne: [],
        fileUrlOne: [],
        fileNameOne: "",
        fileResourcesName: "",
      }
    })
  }

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  };

  function handleChange(value) {
    let name = value.split("@@")[0]
    dispatch({
      type: "projectManage/querySuccess",
      payload: {
        fileResourcesName: name
      }
    })
  }
  const richTextChild = [];
  richTextChild.push(<Option key={"-99"} value={""}>{""}</Option>);
  for (let i in richTextTypeList) {
    richTextChild.push(<Option value={''+richTextTypeList[i].value} key={'rtt'+i}>{richTextTypeList[i].key}</Option>);
  }
  let widthsResource = {x: 900};
  return (
    <Modal
      {...modalProps}
      onOk={handleOk}
      onCancel={handleCancel}
      title={projectRecord.projectName+"---上传资源"}
      okText="保存"
    >
      <Tabs defaultActiveKey="1" className="content-inner">
        <TabPane tab="搜索资源库" key="1" style={{paddingTop:'10px'}}>
          <SearchResource projectManage={projectManage} dispatch={dispatch} />
        </TabPane>
        <TabPane tab="新建资源" key="2" style={{paddingTop:'10px'}}>
          <div>
            <Row>
              <Col span={24}>
                <FormItem label="类型:" {...formItemLayout}>
                  {getFieldDecorator('type', {
                    initialValue: resourcesType,
                    rules: [{required: true, message: '请选择类型'}],
                  })(<Radio.Group size='default' options={typeOptions}
                                  onChange={function(e){
                                    dispatch({
                                      type:"projectManage/querySuccess",payload:{
                                        resourcesType:e.target.value,
                                         fileResourcesName:"",
                                        fileListOne:[],
                                      }
                                    })
                                  }}>
                  </Radio.Group>)}
                </FormItem>
              </Col>
            </Row>
            {resourcesType == "表单" && <Row>
            <Col span={24}>
              <FormItem label="表单名称:" {...formItemLayout}>
                {getFieldDecorator('url', {
                  rules: [{required: true, message: '请选择表单名称'}],
                })(<Select size='default' showSearch style={{width: "250px"}} onChange={handleChange}>
                  {fromChild}
                </Select>)}
              </FormItem>
            </Col>
          </Row>}
            {resourcesType == "附加表单" && <Row>
              <Col span={24}>
                <FormItem label="表单名称:" {...formItemLayout}>
                  {getFieldDecorator('url', {
                    rules: [{required: true, message: '请选择表单名称'}],
                  })(<Select size='default' showSearch style={{width: "250px"}} onChange={handleChange}>
                    {fromChild}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>}
            {resourcesType == "文件" && <Row>
              <Col span={24}>
                <Upload {...props}>
                  <Button style={{marginLeft:"92px"}}>
                    <Icon type="upload"/> 上传资源
                  </Button>
                </Upload>
              </Col>
            </Row>}
            {resourcesType == "图文" && <Row>
              <Col span={24}>
                <FormItem label="图文的类型:" {...formItemLayout}>
                  {getFieldDecorator('subType', {
                  })(<Select
                    size='default'  style={{ width:"100%"}}  >
                    {richTextChild}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>}
            <Row style={resourcesType=="文件"?{marginTop:"20px"}:{}}>
              <Col span={24}>
                <FormItem label="资源名称:" {...formItemLayout}>
                  {getFieldDecorator('resourcesName', {
                    rules: [{required: true, message: '请输入资源名称'}],
                    initialValue: fileResourcesName,
                  })(<Input size='default' style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
            </Row>
            {resourcesType=="附加表单"?<div></div>:<Row>
              <Col span={24}>
                <FormItem label="是否必选:" {...formItemLayout}>
                  {getFieldDecorator('isEssential', {
                    initialValue: "否",
                    rules: [{required: true, message: '请选择是否必选'}],
                  })(<Radio.Group size='default' options={isOptions}>
                  </Radio.Group>)}
                </FormItem>
              </Col>
            </Row>}
            <Row>
              <Col span={24}>
                <FormItem label="备注:" labelCol={{span:"6"}}>
                  {getFieldDecorator('remark', {})(<TextArea autosize={{minRows: 2, maxRows: 3}} style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
            </Row>
            {resourcesType == "文件" && <Row>
              <Col span={24}>
                <Upload {...propsTemplate}>
                  <Button style={{marginLeft:"92px"}}>
                    <Icon type="upload"/> 上传模板
                  </Button>
                </Upload>
              </Col>
            </Row>}
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default Form.create()(UploadResouceModal)
