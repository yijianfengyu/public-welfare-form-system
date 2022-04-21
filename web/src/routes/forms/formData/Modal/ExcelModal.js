import React from 'react'
import {Modal, Button, Upload,Icon,Form,Row,Col,message} from 'antd';
import {request, config} from 'utils'
const {api} = config
const {importExcelTempTable} = api
const ExcelModal = ({
  dispatch,
  fileList,
  locationId,
  tableDefine,
  location,
  filertCol,
  dataObjValue,
  ...ExcelModalProps
  })=> {
  let obj = new Object();
  //let user = JSON.parse(sessionStorage.getItem("UserStrom"));
  if (location.state != null) {
    obj.define_id = location.state.id;
    obj.projectId = location.state.projectId;
    //obj.creator = user.userName;
  }else {
    //obj.creator = user.id;
    //obj.creatorName = user.userName;
    obj.define_id = locationId;
  }
  obj.columns=JSON.stringify(dataObjValue);
  //obj.companyCode=user.companyCode;
  obj.define = JSON.stringify(tableDefine);
  const props = {
    name: 'file',
    action: importExcelTempTable,
    headers: {
      //'Access-Control-Allow-Origin': '*',
      'authorization': 'authorization-text'
    },
    multiple: false,
    showUploadList: true,
    withCredentials:true,
    onChange (info){
      let fileList = info.fileList;
      //只允许上传一个文件
      fileList = fileList.slice(-1);
      //获取上传文件的结果并且展示url
      fileList = fileList.map((file) => {
        if (file.status === 'done') {
          let data = info.file.response;
          dispatch({type: 'forms/hideExcelModalVisit'})
          message.success(data.message+",请手动刷新");
        } else if (file.status === 'error') {
          message.error("上传文件失败");
        }
        return file;
      });
    },
    onRemove: onRemove,
    data: obj,
  }

  function onRemove(file) {
    return false
  }

  function handleCancel() {
    dispatch({
      type: 'forms/hideExcelModalVisit',
      payload: {
        fileList: []
      }
    })
  }
  function downContactModel() {
    let obj = new Object()
    obj.columns = filertCol
    dispatch({
      type: 'forms/onTempTableExcelModel',
      payload: {
        columns: JSON.stringify(obj)
      }
    })
  }

  return (
    <Modal
      title="导入数据"
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
          <Upload {...props} >
            <Button>
              <Icon type="upload"/> 导入数据
            </Button>
          </Upload>
        </Col>
        <Col span={12}>
          <Button size="default" onClick={downContactModel}>
            下载导入模板
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(ExcelModal)
