import React from 'react';
import {Modal, Button, Upload, Icon, Form, Row, Col, message} from 'antd';
import {request, config} from 'utils';
const {api} = config;
const {importExcelTempWithData} = api;
const ExcelFormModal = ({
  dispatch,
  fileList,
  locationId,
  location,
  dataObjValue,
  ExcelFormModalVisit,
  ...ExcelFormModalProps,
  ...modalProps
  }) => {
  let obj = new Object();
  //let user = JSON.parse(sessionStorage.getItem("UserStrom"));
  if (location.state != null) {
    obj.define_id = location.state.id;
    obj.projectId = location.state.projectId;
    //obj.creator = user.userName
  } else {
    //obj.creator = user.id;
    //obj.creatorName = user.userName;
    obj.define_id = locationId;
  }
  obj.columns = JSON.stringify(dataObjValue);
  //obj.companyCode = user.companyCode;
  const props = {
    name: 'file',
    action: importExcelTempWithData,
    headers: {
      //'Access-Control-Allow-Origin': '*',
      'authorization': 'authorization-text'
    },
    multiple: false,
    showUploadList: true,
    onChange: onChange,
    onRemove: onRemove,
    data: obj,
    withCredentials:true
  }

  function onChange(info) {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    fileList = fileList.map((file) => {
      if (file.response) {
        if (file.response.flag === 1) {
          message.success(file.response.message);
          dispatch({
            type: 'forms/queryTempTable',
            payload: {}
          })
        } else {
          message.error(file.response.message);
        }
      }
      return file;
    });
  }

  function onRemove(file) {
    return false
  }

  function handleCancel() {
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        fileList: [],
        excelFormModalVisit: false,
      }
    })
  }

  return (
    <Modal
      title="导入数据并生成新的表单"
      onCancel={handleCancel}
      visible
      footer={[
        <div>
          <span style={{float: 'left', color: 'red'}}>注意：一次最多导入5000行数据</span>
          <Button key="back" onClick={handleCancel} type="primary">取消</Button>
        </div>
      ]}
      width="550px"
    >
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <Upload {...props}>
            <Button>
              <Icon type="upload"/> 导入数据
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(ExcelFormModal)
