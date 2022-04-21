import React from 'react'
import  stylesFrom from './index.less'
import {Row,Col, Form,Input,Modal,Button,Icon,Upload,Popconfirm} from 'antd'
import { Editor } from 'react-draft-wysiwyg';
import {Link} from 'dva/router'
// import { Editor } from 'components';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
const AddMaterialModal = ({
  dispatch,
  ...addMaterialModalProps,
  materialRecord,
  materialRecordItem,
  editorState,
  setEditorState,
  saveMaterial,
  materialSaveType,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    validateFields
  },
}) => {
  const FormItem = Form.Item
  const {TextArea} = Input;

  const formItemLayout = {
    // labelCol: { span: 8 },
    // wrapperCol: { span: 16 },
  };
  const formItemLayoutOne = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  //关闭modal
  function handleCancel() {
    dispatch({type: "weChat/querySuccess",payload:{
      addMaterialModalVisible:false,
    }})
  }

  //富文本编辑器chagne事件
  function onContentStateChange(editorState) {
    dispatch({
      type: 'weChat/querySuccess',
      payload: {
        editorState: editorState
      }
    })
    changeValue();
  }

  //输入框change事件保存值
  function changeValue() {
    let fields = getFieldsValue();
    let materialVal = {
      title:fields.title,
      thumb_media_id:materialRecordItem.thumb_media_id,
      thumb_url:materialRecordItem.thumb_url,
      author:fields.author,
      digest:"",
      show_cover_pic:0,
      content: fields.content?draftToHtml(convertToRaw(editorState.getCurrentContent())):materialRecordItem.content,
      content_source_url:fields.content_source_url,
      index:materialRecordItem.index==undefined?0:materialRecordItem.index
    }

    materialRecord.content.news_item[materialVal.index] = materialVal
    dispatch({
      type: 'weChat/querySuccess',
      payload: {
        materialRecord: materialRecord,
        materialRecordItem:materialVal
      }
    })
  }

  //添加图文
  function addMaterialRecordItem() {
    resetFields();
    let materialInit = {
      title:"",
      thumb_media_id:"",
      author:"",
      digest:"",
      show_cover_pic:0,
      content:"<p></p>",
      content_source_url:"",
      index:materialRecordItem.index+1
    }
    materialRecord.content.news_item.push(materialInit)
    setEditorState(materialInit.content)
    dispatch({
      type: 'weChat/querySuccess',
      payload: {
        materialRecord: materialRecord,
        materialRecordItem:materialInit
      }
    })
  }

  let item;
  if(materialRecord.content){
    item = materialRecord.content.news_item.map((item,index) =>
      <FormItem key={index} {...formItemLayout} label={index==0?"图文列表":""}>
        <Button key={index} type="dashed"  style={{ width: '100%',height:'80px',backgroundImage: 'url('+item.thumb_url+')',backgroundSize:'cover',padding:'0px'}}
          onClick={function (){
            resetFields();
            item.index = index;
            dispatch({type: "weChat/querySuccess",payload:{
              materialRecordItem:item,
            }})
            setEditorState(item.content.replace(/data-src/g,"src"))
          }}>
          <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',backgroundColor: 'rgba(0,0,0,0.3)', color:'#fff',bottom:0}}>
          {item.title}
          </div>
          {index!=0 &&
          <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',backgroundColor: 'rgba(0,0,0,0.3)', color:'#fff',bottom:0}}>
            <Popconfirm placement="left" title="确定删除此篇图文？" onConfirm={function () {
              materialRecord.content.news_item.splice(index,1);
              dispatch({type: "weChat/querySuccess",payload:{
                materialRecord:materialRecord,
              }})
            }} okText="确定"cancelText="取消">
            <Link  style={{color:'#fff',border: 'none', marginRight: "5px"}}><Icon type="delete" /></Link>
            </Popconfirm>
          </div>
          }
        </Button>
      </FormItem>);
  }

  return (
    <Modal
      {...addMaterialModalProps}
      width="1000px"
      onCancel={handleCancel}
      title={materialSaveType=="insert"?"新增图文素材":"修改图文素材"}
      footer={[
        <Button key="submit" type="primary" size="large" onClick={saveMaterial} >保存</Button>,
        <Button size="large" disabled>保存并群发</Button>,
      ]}
    >
      <Row gutter={24}>
        <Col  span={4}>
          {item}
          {materialSaveType=='insert' &&
          <FormItem {...formItemLayout}>
            < Button type="dashed"  style={{width: '100%',height:'80px'}} onClick={addMaterialRecordItem}>
              <Icon type="plus" />添加图文
              </Button>
          </FormItem>
          }
        </Col>
        <Col  span={20}>
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            {getFieldDecorator('title', {
              initialValue: materialRecordItem.title? materialRecordItem.title : "",
            })(<Input placeholder="标题" onBlur={changeValue}/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('author', {
              initialValue: materialRecordItem.author? materialRecordItem.author : "",
            })(<Input placeholder="作者" onChange={changeValue} style={{ width: '180px' }}/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="内容"
          >
            {getFieldDecorator('content', {})(
              <Editor
                editorClassName={stylesFrom.rdw_editor_main}
                editorState={editorState}
                onEditorStateChange={onContentStateChange}
                toolbarCustomButtons={[<Button style={{padding: '0 2px'}} size="small" onClick={addMaterialModalProps.queryMaterialImage.bind(this,'content')}><Icon type="picture" title="图片" style={{ fontSize: 20,padding: '1px'}}/></Button>]}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker','link','remove', 'history'],
                  fontFamily:{
                    options:['宋体','新宋体','黑体','楷体','华文行楷','华文楷体','微软雅黑','幼圆','Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana']
                  },
                  link:{
                    popupClassName:stylesFrom.rdwLinkModal,
                  },
                }}
                placeholder="从这里开始写正文"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="原文链接地址"
          >
            {getFieldDecorator('content_source_url', {
              initialValue: materialRecordItem.content_source_url? materialRecordItem.content_source_url : "",
            })(<Input placeholder="原文链接地址" onChange={changeValue} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="封面"
          >
            <Button size="large" onClick={addMaterialModalProps.queryMaterialImage.bind(this,'cover')}>从图库中选择</Button>
          </FormItem>
        </Col>
        {/*<Col  span={4}>*/}
          {/*<FormItem {...formItemLayout} label="多媒体">*/}
            {/*<Button type="dashed"  style={{ width: '100%',height:'50px' }}>*/}
              {/*<Icon type="picture" />图片*/}
            {/*</Button>*/}
          {/*</FormItem>*/}
        {/*</Col>*/}
      </Row>
    </Modal>
  )
}

export default Form.create()(AddMaterialModal)
