import React from 'react'
import {connect} from 'dva'
import stylessss from './index.less'
import {Form,Button,Icon} from 'antd'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import  stylesFrom from '../forms/index.less'
const FormItem = Form.Item
const Teletext = ({
  location,
  teletext,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  const {TableList,editorStateOne,name} = teletext
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 0},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 24},
    },
  };

  function onContentStateChange(editorState) {
    dispatch({
      type: 'teletext/querySuccess',
      payload: {
        editorStateOne: editorState
      }
    })
  }

  function handleUpdate() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      if (TableList.length != 0) {
        let contact
        if (value.formSynopsis == undefined) {
          contact = TableList[0].content
        } else {
          contact = draftToHtml(value.formSynopsis)
        }
        dispatch({
          type: 'teletext/createProjectReport',
          payload: {
            content: contact,
            resourcesUuid: TableList[0].resourcesUuid,
            projectId: TableList[0].projectId,
          }
        })
      } else {
        dispatch({
          type: 'teletext/createProjectReport',
          payload: {
            content: draftToHtml(value.formSynopsis),
            resourcesUuid: location.query.UUID,
            projectId: location.query.projectId,
          }
        })
      }
    })
  }

  let form
  if (location.query.method == "select") {
    if (TableList.length != 0) {
      form = <div className={stylessss.aa}>
        <div dangerouslySetInnerHTML={{__html:TableList[0].content }}/>
      </div>
    } else if (TableList.length == 0) {
      form = <div className="content-inner">
        <div className={stylessss.error}>
          <Icon type="frown-o"/>
          <h1>暂无数据</h1>
        </div>
      </div>
    } else if (TableList == "") {
      form = <div></div>
    }
  } else {
    form = <div className={stylessss.ba}>
      <div className={stylessss.bas}>
        <span>{name}</span>
      </div>
      <div className={stylessss.bb}>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('formSynopsis', {})(
            <Editor
              style={{height:"1000px"}}
              wrapperClassName={stylessss.wysiwyg_wrapper}
              toolbarClassName={stylessss.torolbar}
              editorClassName={stylessss.demoEditor}
              editorState={editorStateOne}
              onEditorStateChange={onContentStateChange}
              localization={{
                  locale: 'zh',
                }}
              toolbarCustomButtons={[<Button type="primary" size="small" onClick={handleUpdate}>保存</Button>]}
              toolbar={{
       options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker','image','link','remove', 'history'],
       fontFamily:{
       options:['宋体','新宋体','黑体','楷体','华文行楷','华文楷体','微软雅黑','幼圆','Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana']
       },
       link:{
       popupClassName:stylesFrom.rdwLinkModal,
       }
       }}
            />
          )}
        </FormItem>
      </div>
    </div>

  }

  return (
    <div>
      {form}
    </div>
  )
}
export default connect(({teletext, loading}) => ({teletext, loading}))((Form.create())(Teletext))

