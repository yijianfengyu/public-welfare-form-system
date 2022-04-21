import React from 'react'
import {Row,Col, Form,Modal,Button} from 'antd'
const AuthorizationModal = ({
  dispatch,
  ...authorizationModalProps,
  authorizationUrl,
  form: {
    getFieldDecorator,
    validateFields
  },
}) => {
  const FormItem = Form.Item
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const formItemLayoutOne = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  //去授权按钮，打开授权页面
  function handleOk() {
    window.open(authorizationUrl)
  }

  //关闭modal
  function handleCancel() {
    dispatch({type: "weChat/querySuccess",payload:{
      authorizationModalVisible:false
    }})
    dispatch({type: "weChat/SelectAll",payload:{
    }})
  }

  return (
    <Modal
      {...authorizationModalProps}
      onCancel={handleCancel}
      title="提示"
      footer={[
        <a href={authorizationUrl} target="_blank"><Button key="submit" type="primary" size="large">好！去添加公众号</Button></a>,
      ]}
    >
      <Row gutter={24}>
        <Col  xs={24} sm={24}>
          <p>公众号授权是将您的公众号接口授权给绿邦数据，来管理公众号的部分功能，数据绝对安全保密，请放心使用！</p>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(AuthorizationModal)
