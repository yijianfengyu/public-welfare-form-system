import React from 'react'
import {Form,Row,Col,Input,DatePicker,Button,Icon} from 'antd'
import styles from "../../utils/commonStyle.less"

const FormItem = Form.Item
const Filter = ({location,dispatch,startTime,endTime,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
  expand,
}) => {
  function handleSubmit(){
    const fields = getFieldsValue()
      dispatch({
        type: "dailyReport/querys", payload: {
          createName:fields.userName,
          projectName:fields.projectName,
          groupId:fields.groupId,
          startTime:startTime,
          endTime:endTime,
        }
      })
    dispatch({
      type: "dailyReport/querySuccess", payload: {
       filter:fields,
      }
    })
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    dispatch({
      type: "dailyReport/querys",
    })
    dispatch({
      type: "dailyReport/querySuccess", payload: {
        startTime:{},
        endTime:{},
        filter:{},
      }
    })
    // handleSubmit()
  }

  function   onKeyDown(e){
    if(13 == e.keyCode){
      handleSubmit()
    }
  }

  function addDailyReport (){
    dispatch({
      type: 'dailyReport/querySuccess', payload: {
        modalVisible: true
      }
    })

    dispatch({
      type: 'dailyReport/queryProjectName', payload: {
        parentId: 0,
        type:1,
        //companyCode:JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      }
    })
  }

  function collapseClick() {
    let flag = "";
    if (expand) {
      document.getElementsByName("filterRow").item(0).style.display = "none"
      flag = false;
    } else {
      document.getElementsByName("filterRow").item(0).style.display = "block"
      flag = true;
    }
    dispatch({
      type: 'dailyReport/querySuccess', payload: {
        expand: flag
      }
    })
  }

  return (
    <div className={styles.filterDiv} onKeyDown={onKeyDown}  tabIndex="1">
       <Row>
         <Col span={6}>
           <FormItem label="创建人" labelCol={{span: "8"}}>
             {getFieldDecorator('createName', {})(<Input size="default" maxLength="30" style={{width: "150px"}}/>)}
           </FormItem>
         </Col>
         <Col span={6}>
           <FormItem label="项目编号" labelCol={{span: "8"}}>
             {getFieldDecorator('groupId', {})(<Input size="default" maxLength="30" style={{width: "150px"}}/>)}
           </FormItem>
         </Col>
         <Col span={6}>
           <FormItem label="开始时间" labelCol={{span: "8"}}>
             {getFieldDecorator('startTime', {
             })(<DatePicker size="default" style={{width: "150px"}} onChange={function (date, dateString) {
               dispatch({type: "dailyReport/querySuccess", payload: {startTime: dateString}})
             }}/>)}
           </FormItem>
         </Col>
         <Col span={6}>
           <FormItem label="结束时间" labelCol={{span: "8"}}>
             {getFieldDecorator('endTime', {
             })(<DatePicker size="default" style={{width: "150px"}} onChange={function (date, dateString) {
               dispatch({type: "dailyReport/querySuccess", payload: {endTime: dateString}})
             }}/>)}
           </FormItem>
         </Col>
       </Row>
      <Row name="filterRow" style={{display: "none"}}>
        <Col span={6}>
          <FormItem label="项目名称" labelCol={{span: "8"}}>
            {getFieldDecorator('projectName', {})(<Input size="default" maxLength="30" style={{width: "150px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Button size="default" type="primary" className="margin-right" onClick={handleSubmit}>查询</Button>
        <Button size='default' className="margin-right"  onClick={handleReset}>重置</Button>
        <Button size="default" className="margin-right" onClick={addDailyReport}>新增</Button>
        <a style={{float: 'right'}} onClick={collapseClick}>
          <Icon type={expand ? 'toihk-up' : 'toihk-down'} style={{marginTop: "8px", marginRight: "10px"}}/>
        </a>
      </Row>
    </div>
  )
}


export default Form.create()(Filter)
