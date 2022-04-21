import React from 'react'
import { Form, loader } from 'subschema'
import { Modal, Icon, message, Input, Tabs, Switch, Row, Col } from 'antd'
import styless from '../../../routes/operationFrom/formStyle.less'
import TableUtils from '../../../utils/TableUtils'

const CreateFormDataModal = ({
  dispatch, createTableDefine, rowDataId, subFormShow,
}) => {
  const { TextArea } = Input
  const TabPane = Tabs.TabPane

  let define = JSON.parse(createTableDefine)
  //匹配默认值
  let obj = TableUtils.createSchemalValues(define)
  //console.log("----新增自定义表单数据:表定义：----",define,obj);
  define.fieldsets = obj.fieldsets
  let schema = define.schema
  for (let item in schema) {
    if (schema[item].visual === 'static') {
      delete schema[item]
      continue
    } else {
      //let item=define.schema[item];
      if (define.schema[item] && define.schema[item].type == 'FormRadioGroup') {
        //方便从表单里面发出事件到外部 TODO 需要改成函数，以适应用户端提交数据和管理端提交数据
        define.schema[item].dispatch = function (params) {
          dispatch({
            type: 'forms/subFormShowAdd',
            payload: {
              uuid: params.uuid,
              subUuid: params.subUuid,
            },
          })
        }
      }
      //TODO 都添加一个全局对象，包含要跳题的选项
      let col = define.schema[item]
      if (col && col.p_option_uuid
        && !(subFormShow && subFormShow[col.p_uuid] && subFormShow[col.p_uuid] == col.p_option_uuid)) {
        delete define.schema[item]
        define.fieldsets.fields.splice(define.fieldsets.fields.indexOf(item), 1)
      }
    }
  }

  function handleCancel () {
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        creatFormDataVisible: false,
      },
    })
  }

  function handleOk (e, errors, value) {
    let arr = Object.getOwnPropertyNames(errors)
    let define = JSON.parse(createTableDefine)
    if (arr.length > 0) {
      console.log('----提交自定义表单数据发生异常----', errors, arr, value)
    } else if (arr.length == 0) {
      console.log("---提交的数据:",value);
      if (define != null) {
        define['values'] = value
      }
      let check = TableUtils.checkInputMaxAndMin(define.schema, value)
      if (!check.result) {
        alert(check.mes)
        return
      }
      //TODO 校验数字大小字母长度
      dispatch({
        type: 'forms/updateTempDatas',
        payload: {
          define_id: define.define_id,
          define: JSON.stringify(define),
          method: 'create',
          value,
          creatFormDataVisible: false,
          rowDataId,
        },
      })

    }
  }

  return (
    <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="900px"
      maskClosable={false}
    >
      <div>
        <div className={styless.divTitleTwo}>
          <span>{define.formTitle}</span>
        </div>
        <Form key="create_form_data" schema={define} onSubmit={handleOk}/>
        <div style={{ clear: 'both' }}></div>
      </div>
    </Modal>
  )
}

export default (CreateFormDataModal)

