import React from 'react'
import {Modal, Button, Upload,Icon,Form,Row,Col,message} from 'antd';
import {request, config} from 'utils'
const {api} = config
const {ContactUpload} = api
const ContactExcelModal = ({
  dispatch,
  fileList,
  ...ContactExcelModalProps,
  })=> {
  const props = {
    name: 'file',
    action: ContactUpload,
    headers: {
      'authorization': 'authorization-text',
    },
    multiple: false,
    showUploadList: true,
    onChange: onChange,
    onRemove: onRemove,
    withCredentials:true
  }

  function onChange(info) {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    if (info.file.response != undefined) {
      let data = info.file.response
      if (data.flag == "1") {
        message.success(data.message);
        let user=JSON.parse(sessionStorage.getItem("UserStrom"))
        dispatch({
          type: 'contactManagement/hideContactExcelModalVisit',
        })
        dispatch({
          type:'contactManagement/SelectAll',
          payload:{
          }
        })
      } else {
        message.warning(data.message)
      }
    }
    dispatch({
      type: 'contactManagement/querySuccess',
      payload: {
        fileList: fileList
      }
    })
  }

  function onRemove(file) {
    return false
  }

  function handleCancel() {
    dispatch({
      type: 'contactManagement/hideContactExcelModalVisit',
      payload: {
        fileList: []
      }
    })
  }

  function downContactModel() {
    dispatch({
      type: 'contactManagement/downloadContact',
    })
  }
  return (
    <Modal
      title="导入联系人"
      onCancel={handleCancel}
      visible
      footer={[
            <div>
             <span style={{float:'left',color:'red'}}>注意：一次最多导入5000行数据</span>
             <Button key="back" onClick={handleCancel} type="primary">取消</Button>
           </div>
          ]}
      width="550px"
    >
      <Row type="flex" justify="space-around">
        <Col span={12}>
          <Upload {...props} fileList={fileList}>
            <Button>
              <Icon type="upload"/> 导入联系人
            </Button>
          </Upload>
        </Col>
        <Col span={12}>
          <Button size="default" onClick={downContactModel}>
            下载联系人模板
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(ContactExcelModal)
