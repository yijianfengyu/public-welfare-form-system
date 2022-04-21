import React from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Form,Tabs,Row,Col,Input,Button,Upload,Icon} from 'antd'
import {request, config} from 'utils'
const {api} = config
const {pmFileUpload} = api
const TabPane = Tabs.TabPane;
const FormItem = Form.Item
const { TextArea } = Input;
const Organization = ({
  organization,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  const {companyInformation,id,fileList,fileUrl,fileName,text} = organization
  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15},
  };
  const formItemOne = {
    wrapperCol: {span:5},
  }
  function handleUpdate() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      if (JSON.stringify(companyInformation) != '{}') {
        if (fileUrl != "") {
          value.logo = fileUrl
          dispatch({
            type: 'organization/querySuccess',
            payload:{
              fileUrl:fileUrl,
              userCompanyName: value.companyName,
            }
          })
        } else if(text=='删除'){
          value.logo=""
          dispatch({
            type: 'organization/querySuccess',
            payload:{
              fileUrl:"",
              userCompanyName: value.companyName,
            }
          })
        }else{
          value.logo = companyInformation.logo
          dispatch({
            type: 'organization/querySuccess',
            payload:{
              fileUrl:companyInformation.logo,
              userCompanyName: value.companyName,
            }
          })
        }

      } else {
        if (fileUrl != "") {
          value.logo = fileUrl
        }else if(text=='删除'){
          value.logo=""
        }
        dispatch({
          type: 'organization/querySuccess',
          payload: {
            userCompanyName: value.companyName,
            fileUrl: fileUrl,
            text:text,
          }
        })
      }
      //value.companyCode = companyInformation.companyCode
      value.id = id
      dispatch({
        type: 'organization/updateOrganization',
        payload: {
          value
        }
      })
    })
  }

  const props = {
    action: pmFileUpload,
    listType: 'picture',
    withCredentials:true,
    headers: {
      'authorization': 'authorization-text',
    },
    onRemove: (file) => {
      if (file.status == "removed") {
        dispatch({
          type: "organization/querySuccess", payload: {
            fileList: [],
            fileUrl: "",
            fileName: "",
            List: [],
            text:'删除',
          }
        })
      }
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
        type: "organization/querySuccess", payload: {
          fileList: fileList,
          fileUrl: info.file.response,
          fileName: info.file.name,
        }
      })
    },
    fileList: fileList
  }
  return (
    <Tabs defaultActiveKey="1" style={{minWidth:'540px',marginTop:'40px'}}>
      <TabPane tab="组织机构" key="1">
          <Row gutter={24} style={{maxWidth:'1080px',paddingTop:'15px'}}>
            <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="机构名称"
                >
                  {getFieldDecorator('companyName', {
                    initialValue: companyInformation != '' && companyInformation != undefined ? companyInformation.companyName : "",
                    rules: [{required: true, message: '请输入机构名称'}],
                  })
                  (<Input size='default'/>)}
                </FormItem>
                <FormItem
                  label="logo"
                  {...formItemLayout}
                >
                  {getFieldDecorator('logo', {
                    initialValue: "",
                  })
                  (
                    <Upload {...props}>
                      <Button>
                        <Icon type="upload"/> 上传logo
                      </Button>
                    </Upload>
                  )}
                </FormItem>
                <FormItem
                  label="网站"
                  {...formItemLayout}
                >
                  {getFieldDecorator('website', {
                    initialValue: companyInformation.website != undefined ? companyInformation.website : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
                <FormItem
                  label="联系人"
                  {...formItemLayout}
                >
                  {getFieldDecorator('userName', {
                    initialValue: companyInformation.userName != undefined ? companyInformation.userName : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
                <FormItem
                  label="联系方式"
                  {...formItemLayout}
                >
                  {getFieldDecorator('tel', {
                    initialValue: companyInformation.tel != '' && companyInformation.tel != undefined ? companyInformation.tel : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
                <FormItem
                  label="邮箱"
                  {...formItemLayout}
                >
                  {getFieldDecorator('email', {
                    initialValue: companyInformation.email != '' && companyInformation.email != undefined ? companyInformation.email : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem
                  label="微博"
                  {...formItemLayout}
                >
                  {getFieldDecorator('weibo', {
                    initialValue: companyInformation.weibo != undefined ? companyInformation.weibo : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
                <FormItem
                  label="微信"
                  {...formItemLayout}
                >
                  {getFieldDecorator('weixin', {
                    initialValue: companyInformation.weixin != undefined ? companyInformation.weixin : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
                <FormItem
                  label="地址"
                  {...formItemLayout}
                >
                  {getFieldDecorator('address', {
                    initialValue: companyInformation.address != undefined ? companyInformation.address : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
                <FormItem
                  label="邮编"
                  {...formItemLayout}
                >
                  {getFieldDecorator('zipcode', {
                    initialValue: companyInformation.zipcode != undefined ? companyInformation.zipcode : "",
                  })
                  (<Input size='default' />)}
                </FormItem>
                <FormItem
                  label="描述"
                  {...formItemLayout}
                >
                  {getFieldDecorator('description', {
                    initialValue: companyInformation.description != undefined ? companyInformation.description : "",
                  })
                  (<TextArea rows={4}/>)}
                </FormItem>
            </Col>
          </Row>
          <row gutter={24} style={{maxWidth:'1080px'}}>
            <Col span={24}>
              <FormItem {...formItemOne}>
                <Button type="primary" onClick={handleUpdate} style={{float:'right'}}>提交</Button>
              </FormItem>
            </Col>
          </row>
      </TabPane>
    </Tabs>
  )
}
export default connect(({organization, loading}) => ({
  organization, loading
}))((Form.create())(Organization))
