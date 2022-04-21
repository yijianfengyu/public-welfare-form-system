import React from 'react'
import {Form,Modal,Row,Col,Select,Input,Radio,DatePicker} from 'antd'
import moment from 'moment';
import QRCode from 'qrcode.react'

const ShareModal = ({
  dispatch,
  updateValue,
  optionItem,
  shareUrl,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  function handleCancel() {
    dispatch({
      type: 'contactManagement/hideShareModalVisit',
    })
  }

  function downloadQRCode() {
    var img = document.getElementById("QRCode")
    var a = document.createElement("a");
    a.href = img.toDataURL();
    a.download = "联系人二维码";
    a.click();
  }

  return (
    <Modal
      visible
      onCancel={handleCancel}
      width="270px"
      footer={null}
      title="分享到手机填写联系人"
      maskClosable={false}
    >
      <QRCode
        id="QRCode"
        value={shareUrl}
        size={240}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
      />
      <Row type="flex" justify="space-around">
        <Col md={24}>
          右键复制图片或 <a onClick={downloadQRCode}>下载二维码</a>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(ShareModal)
