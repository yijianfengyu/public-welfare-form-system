import React from 'react'
import {Modal, Button,Form,Row,Col,message,Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const SelectUserModal = ({
  ...modalProps,
  dispatch,
  userOption,
  form: {
    validateFieldsAndScroll,
    getFieldDecorator,
    },
  })=> {

  function handleCancel() {
    dispatch({
      type: 'login/querySuccess',
      payload: {
        selectUserModalVisible: false,
        userOption: [],
      }
    })
  }


  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'login/selectAccount',
        payload: {
          id:userOption[parseInt(values.userinfo)].id,
        }
      })
    })
  }

  return (
    <Modal
      onCancel={handleCancel}
      onOk={handleOk}
      {...modalProps}
    >
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col span={24}>
          <FormItem label="选择账号"  labelCol={{span: "6"}}>
            {getFieldDecorator('userinfo', {
              initialValue:"0",
              //rules: [{required: true, message: '请输入内容'}],
            })(
              <Select size='default' style={{width: "150px"}}>
                {userOption.map(function (option, index) {
                  return <Option key={index}>{option.companyName}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(SelectUserModal)
