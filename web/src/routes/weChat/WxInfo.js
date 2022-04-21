import React from 'react'
import {Row,Col,Button,Form,Input,Select,Avatar } from 'antd'
import styles from "../../utils/commonStyle.less"
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const WxInfo = ({
  dispatch,
  wxInfoList,
  wxInfoRecord,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    },
  }) => {

  //打开授权modal
  function openAuthorizationModal() {
    dispatch({type: "weChat/queryGoAuthorUrl",payload:{
    }})

    dispatch({type: "weChat/querySuccess",payload:{
      authorizationModalVisible:true
    }})
  }

  const options = wxInfoList.map(item => <Select.Option key={item.authorizerAppid}>{item.nickName}</Select.Option>);
  return (
    <div className={styles.filterDiv} >
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col span={6}>
          <Form.Item label="选择公众号:" {...formItemLayout}>
            {
            //   getFieldDecorator('nickName', {
            //   initialValue:wxInfoRecord.nickName
            // })
            (<Select
                style={{width: 180}}
                value={wxInfoRecord.authorizerAppid}
                onSelect={function handleChange(value, option) {
                  dispatch({
                    type: "weChat/querySuccess",
                    payload: {
                      wxInfoRecord: wxInfoList[option.props.index]
                    }
                  })
                }}
              >
                {options}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button type="primary" size="large"  onClick={openAuthorizationModal}>公众号授权</Button>
        </Col>
      </Row>
      { wxInfoList.length>0 &&
        <div>
          <Row gutter={24} style={{maxWidth:'1080px'}}>
            <Col span={8}>
              <Avatar size="large"src={wxInfoRecord.headImg}/>
            </Col>
          </Row>
          <Row gutter={24} style={{maxWidth:'1080px'}}>
            <Col span={8}>
              <Form.Item label="公众号名称:" {...formItemLayout}>
                {getFieldDecorator('nickName', {
                })(
                  <Button size="small" style={{ marginLeft: 16 }}>{wxInfoRecord.nickName}</Button>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} style={{maxWidth:'1080px'}}>
            <Col span={8}>
              <Form.Item label="主体名称:" {...formItemLayout}>
                {getFieldDecorator('principalName', {
                })(
                  <Button size="small" style={{ marginLeft: 16 }} >{wxInfoRecord.principalName}</Button>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} style={{maxWidth:'1080px'}}>
            <Col span={8}>
              <Form.Item label="公众号类型:" {...formItemLayout}>
                {getFieldDecorator('serviceTypeInfo', {
                })(
                  <Button size="small" style={{ marginLeft: 16 }} >{wxInfoRecord.serviceTypeInfo==2?"服务号":"订阅号"}</Button>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} style={{maxWidth:'1080px'}}>
            <Col span={8}>
              <Form.Item label="微信认证:" {...formItemLayout}>
                {getFieldDecorator('verifyTypeInfo', {
                })(
                  <Button size="small" style={{ marginLeft: 16 }} >{wxInfoRecord.verifyTypeInfo==0?"已认证":"未认证"}</Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      }
    </div>
  )
}


export default Form.create()(WxInfo)
