import React from 'react'
import {Form,Button, Input, Row,Modal,Col, } from 'antd'
const FormItem = Form.Item;
const SetPwMoal = ({
                    dispatch,
                     tableDefine,
                     form: {
                       getFieldDecorator,
                       validateFieldsAndScroll,
                       getFieldValue,
                       setFieldsValue
                     },
                  }) => {
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 6,
      },
    },
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  function submitPw() {
    validateFieldsAndScroll(
      (err,values) => {
        if(err){
          return ;
        }else{
          dispatch({
            type: 'forms/modifyPw',
            payload: {
              ...values,
              define_id:tableDefine.define_id,
              showSetPwModalVisible: false,
            }
          })
        }
      },
    );

  }
  function handleCancel() {
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        showSetPwModalVisible: false,
      }
    })
  }
  return (
    <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="300"
      title="设置数据修改密码"
      maskClosable={false}
    >

          <Row gutter={24}>
            <Col lg={24} xs={24}>
              <FormItem
                {...formItemLayout}
                label="密码:"
                hasFeedback
              >
                {getFieldDecorator('modifyPw', { rules: [{
                    required: true,
                    len:8,
                    whitespace:true,
                    message: '请输入8位数字密码',
                  }],})(
                  <Input type="number" placeholder="请输入8位数字密码" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={submitPw} htmlType="submit">保存</Button>
              </FormItem>
            </Col>
          </Row>
    </Modal>
  )
}
export default Form.create()(SetPwMoal)
