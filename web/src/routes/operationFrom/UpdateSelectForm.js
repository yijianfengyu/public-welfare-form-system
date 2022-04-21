import React from 'react'
import {connect} from 'dva'
import {message} from 'antd'

import  styless from './formStyle.less'
import {Form,loader} from 'subschema';

const updateSelectForm = ({
  dispatch,
  selectForm,
  }) => {
  const {OneTempDatasList,objValue,query}=selectForm

  var obj
  let form
  if (OneTempDatasList.length == 0) {
  }
  if (OneTempDatasList[0].define == undefined) {
    obj = null
  } else {
    obj = JSON.parse(OneTempDatasList[0].define)
    form=<div className={styless.from}>
      <div className={styless.divTitleTwo}>
        <span>{OneTempDatasList[0].formTitle}</span>
      </div>
      <div>
        <div dangerouslySetInnerHTML={{__html:OneTempDatasList[0].formDescription }} />
      </div>
      <Form schema={obj} onSubmit={handleSubmit}  value={objValue} disabled="true"/>
    </div>
  }
  function handleSubmit(e, errors, value) {
    var arr = Object.getOwnPropertyNames(errors);
    if(arr.length>0){
    }else if(arr.length==0) {
      if(OneTempDatasList[0].status==1){
        message.warning("已审核不能修改")
      }else {
        if (obj != null) {
          obj["values"] = value
        }
        var obj1 = JSON.parse(sessionStorage.getItem("userStorage"))
        var user1
        if (obj1 == null) {
          user1 = "";
        } else {
          user1 = obj1.id;
        }

        dispatch({
          type: 'selectForm/createTempDatas',
          payload: {
            formTitle: OneTempDatasList[0].formTitle,
            formSynopsis: OneTempDatasList[0].formDescription,
            define: JSON.stringify(obj),
            creator: user1,
            companyCode: query.code,
            data_uuid: query.UUID,
            define_id: query.id,
            method: "update",
            status: OneTempDatasList[0].status,
            id: OneTempDatasList[0].id,
            code_key:query.code,
          }
        })
        dispatch({
          type: 'selectForm/querySuccess',
          payload: {
            query: query,
            isQuery: "update",
            objValue: value,
          }
        })
        return
      }
    }
  }
  console.log("----------内部更新表单数-----------");
  return (
    <div className={styless.fromDiv}>
      {form}
    </div>
  )
}


export default connect(({selectForm, loading}) => ({selectForm, loading}))((updateSelectForm))
