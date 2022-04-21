import React from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Form,Tabs,Row,Col,Spin,message} from 'antd'
import {request, config} from 'utils'
import _ from 'lodash';
import WxInfo from './WxInfo'
import Filter from './Filter'
import MaterialList from './MaterialList'
import AuthorizationModal from './AuthorizationModal'
import AddMaterialModal from './AddMaterialModal'
import ImageListModal from './ImageListModal'
import MaterialOtherList from "./MaterialOtherList";

import { EditorState, convertToRaw, ContentState,AtomicBlockUtils } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
const {api} = config
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const WeChat = ({
  weChat,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  const {authorizationUrl,wxInfoList,wxInfoRecord,materialList,pagination,paginationImg,listLoading,authorizationModalVisible,materialType,addMaterialModalVisible,
    materialRecord,materialRecordItem,editorState,imageListModalVisible,imageList,materialSaveType,imageSaveType} = weChat

  const props = {
  }
  const MaterialListProps = {
    dispatch,
    dataSource: materialList,
    pagination,
    onChange(page) {//翻页
      dispatch({
        type: "weChat/queryMaterial", payload: {
          appid:wxInfoRecord.authorizerAppid,
          materialType:materialType,
          currentPage: page.current,
          pageSize: page.pageSize
        }
      })
      dispatch({
        type: 'weChat/querySuccess',
        payload: {
          listLoading: true,
        },
      })
    },
    sendMaterial(){//群发素材消息
      dispatch({
        type: "weChat/sendMaterial", payload: {
          appid: wxInfoRecord.authorizerAppid,
          material:JSON.stringify({
            filter:{},
            mpnews:{
              media_id:materialRecord.media_id
            },
            msgtype:"mpnews",
            send_ignore_reprint:0
          })
        }
      })
    },
    deleteMaterial(){//删除素材
      dispatch({
        type: "weChat/deleteMaterial", payload: {
          appid: wxInfoRecord.authorizerAppid,
          media_id:materialRecord.media_id
        }
      })
    },
    listRowClick(record) {//行选择事件
      dispatch({
        type: 'weChat/querySuccess',
        payload: {
          materialRecord:_.cloneDeep(record),
        },
      })
    },
    setEditorState,
  }

  const filterProps = {
    dispatch,
    materialType,
    onFilterChange(value) {
      dispatch({
        type: "weChat/queryMaterial", payload: {
          appid: wxInfoRecord.authorizerAppid,
          materialType: value,
        }
      })
      dispatch({
        type: "weChat/querySuccess",
        payload: {
          materialType: value,
          materialList:[],
          listLoading: true,
        }
      })
    }
  }

  const wxInfoProps = {
    dispatch,
    wxInfoList,
    wxInfoRecord,
  }

  const authorizationModalProps = {
    dispatch,
    authorizationUrl,
    maskClosable: false,
    visible: authorizationModalVisible,
  }

  const addMaterialModalProps = {
    dispatch,
    maskClosable: false,
    visible: addMaterialModalVisible,
    materialRecord,
    materialRecordItem,
    editorState,
    wxInfoRecord,
    materialSaveType,
    setEditorState,
    saveMaterial() {
      if(materialSaveType=="update"){
        dispatch({
          type: "weChat/updateMaterial", payload: {
            appid: wxInfoRecord.authorizerAppid,
            material:JSON.stringify(materialRecord)
          }
        })
      }else{
        dispatch({
          type: "weChat/insertMaterial", payload: {
            appid: wxInfoRecord.authorizerAppid,
            material:JSON.stringify(materialRecord)
          }
        })
      }
    },
    queryMaterialImage(type){
      dispatch({
        type: "weChat/queryMaterialImage",
        payload: {
          appid:wxInfoRecord.authorizerAppid,
          materialType: "image",
        }
      })
      dispatch({
        type: 'weChat/querySuccess',
        payload: {
          imageListModalVisible: true,
          imageSaveType:type
        },
      })
    }
  }

  const imageListModalProps = {
    dispatch,
    maskClosable: false,
    visible: imageListModalVisible,
    imageSaveType,
    wxInfoRecord,
    imageList,
    paginationImg,
    setIdAndUrl(media_id,thumb_url){
      materialRecordItem.thumb_media_id=media_id;
      materialRecordItem.thumb_url=thumb_url;
      materialRecord.content.news_item[materialRecordItem.index] = materialRecordItem
      dispatch({
        type: 'weChat/querySuccess',
        payload: {
          materialRecord: materialRecord,
          materialRecordItem:materialRecordItem,
          imageListModalVisible:false
        }
      })
    },
    setContentImg(thumb_url){
      const entityKey = editorState
        .getCurrentContent()
        .createEntity('IMAGE', 'MUTABLE', { src:thumb_url })
        .getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' ',
      );
      dispatch({
        type: 'weChat/querySuccess',
        payload: {
          imageListModalVisible:false,
          editorState: newEditorState
        }
      })
    },
    queryMaterialImagePage(page) {
      dispatch({
        type: "weChat/queryMaterialImage",
        payload: {
          appid: wxInfoRecord.authorizerAppid,
          materialType: "image",
          currentPage:page
        }
      })
    }
  }

  //页签切换素材管理
  function queryMaterial(key) {
    if(key == '2'){
      dispatch({
        type: "weChat/queryMaterial",
        payload: {
          appid:wxInfoRecord.authorizerAppid,
          materialType: materialType,
        }
      })
      dispatch({
        type: 'weChat/querySuccess',
        payload: {
          listLoading: true,
        },
      })
    }
  }

  //富文本编辑器转换处理
  function setEditorState(val){
    const contentBlock = htmlToDraft(val? val:"");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      dispatch({
        type: 'weChat/querySuccess',
        payload: {
          editorState: editorState,
        },
      })
    }
  }

  return (
    <Tabs defaultActiveKey="1" style={{minWidth:'540px',marginTop:'40px'}} onTabClick={queryMaterial}>
      <Tabs.TabPane tab="微信公众号管理" key="1" style={{paddingTop:'10px'}}>
        {authorizationModalVisible && <AuthorizationModal {...authorizationModalProps}/>}
        <WxInfo {...wxInfoProps} name="wxinfo"/>
      </Tabs.TabPane>
      <Tabs.TabPane tab="素材管理" key="2">
        <div >
          {addMaterialModalVisible && <AddMaterialModal {...addMaterialModalProps}/>}
          {imageListModalVisible && <ImageListModal {...imageListModalProps}/>}
          <Filter {...filterProps} name="filter"/>
          <div className={styles.table}>
            <Spin spinning={listLoading}>
              {materialType=="news"  && <MaterialList {...MaterialListProps} style={{marginTop:"10px"}}/>}
              {materialType!="news"  && <MaterialOtherList {...MaterialListProps} style={{marginTop:"10px"}}/>}
            </Spin>
          </div>
        </div>
      </Tabs.TabPane>
    </Tabs>
  )
}
export default connect(({weChat, loading}) => ({
  weChat, loading
}))((Form.create())(WeChat))
