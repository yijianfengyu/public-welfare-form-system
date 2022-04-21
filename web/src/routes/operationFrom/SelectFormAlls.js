import React from 'react'
import {Form,loader} from 'subschema';
import  styless from './formStyle.less'
import {connect} from 'dva'

const SelectFormAlls = ({
  selectForm
  }) => {
  const {OneTempDatasList,objValue}=selectForm
  console.log("------用户填数据表单1------");
  let obj
  let form
  if (OneTempDatasList.length != 0) {
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
        <Form schema={obj} value={objValue} disabled="true"/>
      </div>
    }
    obj.fieldsets.buttons = []
  }
  return (
    <div className={styless.fromDiv}>
      {form}
    </div>
  )
}

export default connect(({selectForm, loading}) => ({selectForm, loading}))((SelectFormAlls))

