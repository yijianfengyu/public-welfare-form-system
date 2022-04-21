import React from 'react'
import {Row,Col, Form,Icon,Modal,Button,Upload,Pagination} from 'antd'
import {request, config} from 'utils'
const {api} = config
const {wxUpload} = api
const ImageListModal = ({
  dispatch,
  ...imageListModalProps,
  imageList,
  wxInfoRecord,
  paginationImg,
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

  const props = {
    media_id :"",
    thumb_url:""
  }

  const images = imageList.map(item =>
    <Button key={item.media_id}  style={{width:'80px',height:'80px',backgroundImage: 'url('+item.url+')',backgroundSize:'80px 80px',margin:'5px'}}
     onClick={
       function (){
         props.media_id = item.media_id;
         props.thumb_url = item.url;
       }
     }/>
  );
  //关闭modal
  function handleCancel() {
    dispatch({type: "weChat/querySuccess",payload:{
      imageListModalVisible:false
    }})
  }
  //确定按钮
  function handleOk(){
    if(imageListModalProps.imageSaveType=='cover'){
      imageListModalProps.setIdAndUrl(props.media_id,props.thumb_url)
    }else{
      imageListModalProps.setContentImg(props.thumb_url)
    }
  }
  //图片分页
  function pageOnChange(page, pageSize){
    imageListModalProps.queryMaterialImagePage(page)
  }

  let obj = new Object()
  obj.appid=wxInfoRecord.authorizerAppid;
  obj.type="thumb";
  const uploadProps = {
    action: wxUpload,
    data: obj,
    listType: 'picture',
    onChange(info){
      dispatch({
        type: "weChat/queryMaterialImage",
        payload: {
          appid:wxInfoRecord.authorizerAppid,
          materialType: "image",
        }
      })
    }
  }
  return (
    <Modal
      {...imageListModalProps}
      onCancel={handleCancel}
      title="选择图片"
      footer={[
        <Button key="submit" type="primary" size="large" onClick={handleOk}>确定</Button>,
      ]}
    >
      <Row gutter={24}>
        <Col  xs={24} sm={24}>
          <FormItem {...formItemLayout}>
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload"/> 上传图片
              </Button>
            </Upload>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col  xs={24} sm={24}>
          {images}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col  xs={24} sm={24}>
          <div style={{textAlign:'center',marginTop:'10px'}}>
          <Pagination size="small" current={paginationImg?paginationImg.current:1} total={paginationImg?paginationImg.total:0} onChange={pageOnChange}/>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(ImageListModal)
