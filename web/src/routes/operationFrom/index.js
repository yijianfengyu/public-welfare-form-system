import React from 'react'
import {Icon} from 'antd';
import {connect} from 'dva'
import  UpdateSelectForm from './UpdateSelectForm'
import  EditForm from './EditForm'
import  SelectFormAlls from './SelectFormAlls'
import  styless from './formStyle.less'
//import './styles.less'
//自动生成表单的样式
const SelectForms = ({
  location, dispatch, selectForm,
  }) => {
  const {tempTableListId,isDate,query}=selectForm

  function onFunction() {
    let from
    //模板是否有值，0无，1有
    if (location.query.projectId == undefined) {
      if (isDate == 1) {
        //判断query条件
        if (location.query.method == undefined) {
          //条件只有id时只进添加页面
          from = <EditForm/>
        } else if (location.query.method == "update" || location.query.method == "create") {
          from = <UpdateSelectForm/>
        } else if (location.query.method == "select") {
          from = <SelectFormAlls/>
        } else {
          //method乱填
          from = <div className="content-inner">
            <div className={styless.error}>
              <Icon type="frown-o"/>
              <h1>模板不存在</h1>
            </div>
          </div>
        }
      } else if (isDate == 0) {
        //模板没有值进添加页面
        from = <EditForm/>
      }
    } else {
      from = <EditForm/>
    }

    return from
  }

  if (tempTableListId.define != undefined) {
    var obj = sessionStorage.getItem("UserStrom")
    if (query.code == "") {
      return (
        <div className="content-inner">
          <div className={styless.error}>
            <Icon type="frown-o"/>
            <h1>模板不存在</h1>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          {onFunction()}
        </div>
      )
    }
  } else {
    return (

      <EditForm/>
    )
  }
}


export default connect(({selectForm, loading}) => ({selectForm, loading}))((SelectForms))
