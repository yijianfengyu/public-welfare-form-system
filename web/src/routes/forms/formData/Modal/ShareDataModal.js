import React from 'react'
import {message,Input,Switch,Row,Col,Form,DatePicker,Button,Modal,Icon } from 'antd';
import moment from 'moment';
import {Link} from 'dva/router'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import { config} from 'utils'
const {api} = config
const {urls} = api
import {sharedLinks} from '../../../../utils/config'


const ShareDataModal = ({
  dispatch,
  tableDefine,
  shareDataValue,
  ...modalProps,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    resetFields,
    },
  }) => {
  const FormItem = Form.Item
  const formItemLayout = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 10,
      },
    },
  };

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'forms/createShareUrl',
        payload: {
          payloadValue: {
            userName: JSON.parse(sessionStorage.getItem("UserStrom")).userName,
            userId: JSON.parse(sessionStorage.getItem("UserStrom")).id,
            srcUrl:JSON.stringify(tableDefine),
            defineId: shareDataValue.id,
            shareTitle: values.shareTitle,
            startTime: values.startTime != undefined && values.startTime != "" ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
            endTime: values.endTime != undefined && values.endTime != "" ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
            isConditions: values.isConditions == true ? 1 : 0,
          },
          value:shareDataValue,
        }
      })
      resetFields();
    })
  }

  function downloadQRCodeTwo() {
    var img = document.getElementById("QRCodeTwo")
    var label = document.createElement("a");
    label.href = img.toDataURL();
    label.download = "表单分享数据二维码";
    label.click();
  }


  function handleCancel() {
    delete shareDataValue.shareUrlId
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        shareDataModalVisible: false,
        shareDataValue,
      }
    })
  }

  var shareUrl = urls + "/shareUrl/dataShare?id=" + encodeURIComponent(shareDataValue.shareUrlId)+"&url="+encodeURIComponent(sharedLinks)+"&img="+encodeURIComponent(sessionStorage.getItem("imgOne"));
  return (
    <Modal
      title="分享数据"
      onCancel={handleCancel}
      {...modalProps}
      visible
      width="600px"
      footer={null}
    >
      <Row gutter={24}>
        <Col lg={12} xs={24}>
          {shareDataValue.shareUrlId === undefined ? <div><h5>填写如下基本信息，生成二维码：</h5></div> :
            <div style={{width:'295px',wordBreak: 'break-all', wordWrap:'break-word'}}>
              <Link to={shareUrl} target="_blank" style={{fontSize:'14px'}}>
                <span >{shareUrl}</span>
              </Link>
              <CopyToClipboard text={shareUrl} style={{marginLeft: '10px',cursor:'pointer'}}>
                <Icon type="copy" onClick={() => message.success("链接复制成功！")} title="copy"
                      style={{color:"#108EE9"}}/>
              </CopyToClipboard>
              <h5>填写如下基本信息，生成二维码：</h5>
            </div>}
          <Row style={{marginTop:'20px'}}>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="分享的标题"
              >
                {getFieldDecorator('shareTitle', {
                  initialValue: shareDataValue.formTitle
                })
                (<Input size='default'/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="分享开始时间"
              >
                {getFieldDecorator('startTime', {
                  initialValue: false,
                })
                (<DatePicker size='default' format="YYYY-MM-DD HH:mm:ss"/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="分享结束时间"
              >
                {getFieldDecorator('endTime', {
                  initialValue: false,
                })
                (<DatePicker size='default' format="YYYY-MM-DD HH:mm:ss"/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="是否显示搜索条件"
              >
                {getFieldDecorator('isConditions', {
                  initialValue: false,
                })
                (<Switch size='default' checkedChildren="是" unCheckedChildren="否"/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" size='default' onClick={handleOk}>生成</Button>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col lg={12} xs={24}>
          {shareDataValue.shareUrlId === undefined ? <div></div> :
            <div>
              <Row type="flex" justify="space-around">
                <QRCode
                  value={shareUrl}
                  size={260}
                  id="QRCodeTwo"
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  renderAs={"canvas"}
                />
              </Row>
              <Row type="flex" justify="space-around">
                <Col>右键复制图片或 <a onClick={downloadQRCodeTwo}>下载二维码</a></Col>
              </Row>
            </div>
          }
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(ShareDataModal)
