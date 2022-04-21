import React from 'react'
import {Form,loader} from 'subschema';
import {Modal,Icon,message,Input,Tabs,Switch,Row,Col } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import EyeShareModal from './EyeShareModal'
import {Link} from 'dva/router'
import styless from '../../routes/operationFrom/formStyle.less'
import { config} from 'utils'
const {api} = config
const {urls} = api
import {sharedLinks} from '../../utils/config'
import QRCode from 'qrcode.react'
const EyeModal = ({
  dispatch,
  tempTableListId,
  editValue,
  dataObjValue,
  eyeLink,
  checked,
  eyeRecord,

  }) => {
  const { TextArea } = Input;
  const TabPane = Tabs.TabPane;

  var obj = JSON.parse(eyeRecord.define).schema;

  function handleCancel() {
    dispatch({
      type: 'forms/hideeyeModalVisit',
      payload: {
        tempTableListId: [],
        editValue: {},
        checked: false,
        eyeRecord: {},
      }
    })
  }
  var shareUrl = urls + "/shareUrl/dataShare?id=" + encodeURIComponent(eyeRecord.shareUrlId)+"&url="+encodeURIComponent(sharedLinks)+"&img="+encodeURIComponent(sessionStorage.getItem("imgOne"));

  function downloadQRCodeOne() {
    var img = document.getElementById("QRCodeOne")
    var label = document.createElement("a");
    label.href = img.toDataURL();
    label.download = "填写表单二维码";
    label.click();
  }

  function downloadQRCodeTwo() {
    var img = document.getElementById("QRCodeTwo")
    var label = document.createElement("a");
    label.href = img.toDataURL();
    label.download = "表单分享数据二维码";
    label.click();
  }

  return (
    <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="600"
      title="预览表单内容"
      style={{minHeight:'400px'}}
      maskClosable={false}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span>分享表单填写链接</span>} key="1">
          <Row gutter={24}>
            <Col lg={12} xs={24}>
              <div style={{width:'295px',wordBreak: 'break-all', wordWrap:'break-word'}}>
                <Link to={eyeLink} target="_blank" style={{fontSize:'14px'}}>
                  <span>{eyeLink}</span>
                </Link>
                <CopyToClipboard text={eyeLink} style={{marginLeft: '10px',cursor:'pointer'}}>
                  <Icon type="copy" onClick={() => message.success("链接复制成功！")} title="copy" style={{color:"#108EE9",}}/>
                </CopyToClipboard>
              </div>
              <div>
                <p style={{fontSize:'14px',marginTop:'10px'}}>
                  复制以下代码到你的HTML代码中，方便用户在浏览网站时填写
                </p>
              </div>
              <TextArea rows={6}
                        value={"<iframe allowTransparency=" + "'" + "true" + "'" + " style=" + "'" + "width:100%;border:none;height:669px" + "'" + " scrolling=" + "'" + "no" + "'" + " seamless=" + "'" + "seamless" + "'" + " frameborder=" + "'" + "0" + "'" + " src=" + "'" + "" + eyeLink + "" + "'" + "></iframe>"}
                        style={{fontSize:'14px',height:'138px'}}/>
            </Col>
            <Col lg={12} xs={24}>
              <Row type="flex" justify="space-around">
                <QRCode
                  id="QRCodeOne"
                  value={eyeLink}
                  size={260}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                /></Row>
              <Row type="flex" justify="space-around">
                <Col>右键复制图片或 <a onClick={downloadQRCodeOne}>下载二维码</a></Col>
              </Row>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={<span>预览</span>} key="2">
          <Row gutter={24}>
            <div className={styless.divTitleTwo}>
              <span>{eyeRecord.formTitle}</span>
            </div>
            <div>
              <div
                dangerouslySetInnerHTML={{__html:eyeRecord.formDescription!=undefined?eyeRecord.formDescription:"" }}/>
            </div>
            <div style={{marginBottom:"5vh"}}>
              <Form schema={obj} disabled="true" value={editValue}/>
            </div>
          </Row>
        </TabPane>
        <TabPane tab={<span>分享收集的数据</span>} key="3">
          <Row gutter={24}>
            <Col lg={12} xs={24}>
              {eyeRecord.shareUrlId === undefined ? <div><h5>填写如下基本信息，生成二维码：</h5></div> :
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
              <EyeShareModal value={eyeRecord} dispatch={dispatch}/>
            </Col>
            <Col lg={12} xs={24}>
              {eyeRecord.shareUrlId === undefined ? <div></div> :
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
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default (EyeModal)

